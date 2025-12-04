// src/pages/History.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ref, onValue, off, remove } from 'firebase/database';
import { database } from '../firebase';
import { NotificationManager } from '../components/Notification';
import { Card } from '../components/Card';

const Container = styled.div`
  padding: 28px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  margin:0;
  color: ${({theme}) => theme.colors.text.primary};
`;

const Controls = styled.div`
  display:flex;
  gap: 12px;
  align-items:center;
`;

/* ⬇⬇⬇ FIXED: dropdown text now BLACK on WHITE ⬇⬇⬇ */
const Select = styled.select`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.18);
  background: #ffffff;
  color: #000000;
  font-weight: 600;
  min-width: 150px;
  box-shadow: 0 10px 25px rgba(15,23,42,0.25);

  &:focus {
    outline: none;
    border-color: ${({theme}) => theme.colors.primary};
  }

  & option {
    color: #000000;
    background: #ffffff;
  }
`;

const Fog = styled.div`
  background: rgba(0,0,0,0.18);
  padding: 18px;
  border-radius: 14px;
  backdrop-filter: blur(8px);
`;

const ReadingList = styled.div`
  display:flex;
  flex-direction:column;
  gap: 12px;
`;

const ReadingRow = styled(Card)`
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding: 14px;
`;

const Left = styled.div``;

const Right = styled.div`
  display:flex;
  gap:12px;
  align-items:center;
`;

const SourceName = styled.div`
  font-weight:800;
  color: ${({theme}) => theme.colors.text.primary};
`;

const Time = styled.div`
  color: ${({theme}) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const StatsGrid = styled.div`
  display:grid;
  grid-auto-flow: column;
  gap: 12px;
  align-items:center;
  margin-top: 10px;

  @media (max-width: 900px) {
    grid-auto-flow: row;
    justify-items: flex-start;
  }
`;

const Stat = styled.div`
  text-align:center;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({theme}) => theme.colors.text.secondary};
`;

const StatValue = styled.div`
  font-weight:700;
  color: ${({theme}) => theme.colors.text.primary};
`;

const Badge = styled.div`
  padding: 8px 12px;
  border-radius: 999px;
  color: white;
  font-weight:700;
  white-space: nowrap;
`;

const DelBtn = styled.button`
  background: rgba(239,68,68,0.9);
  color:white;
  padding: 8px 12px;
  border-radius: 10px;
  border:none;
  cursor:pointer;
  font-weight: 700;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const pollutionColors = {
  "Good Water": "#10b981",
  "Sewage": "#ef4444",
  "Agricultural Runoff": "#f59e0b",
  "Chemical Intrusion": "#8b5cf6",
  "Thermal Pollution": "#fb923c",
  "Unknown": "#6b7280"
};

function colorFor(label) {
  return pollutionColors[label] || pollutionColors["Unknown"];
}

function fmt(v) {
  if (v === undefined || v === null || Number.isNaN(Number(v))) return '-';
  return Number(v).toFixed(2);
}

export default function History() {
  const [readings, setReadings] = useState([]);
  const [sources, setSources] = useState([]);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (m, t='success') =>
    setNotifications(prev => [...prev, { message: m, type: t }]);

  const removeNotification = (i) =>
    setNotifications(prev => prev.filter((_, idx) => idx !== i));

  useEffect(() => {
    const readingsRef = ref(database, 'readings');

    const onData = (snap) => {
      const val = snap.val();
      if (!val) {
        setReadings([]);
        setSources([]);
        setLoading(false);
        return;
      }
      const arr = Object.entries(val)
        .map(([id, obj]) => ({ id, ...obj }))
        .reverse();

      setReadings(arr);
      const uniq = [...new Set(arr.map(r => r.source).filter(Boolean))];
      setSources(uniq);
      setLoading(false);
    };

    const onErr = (err) => {
      console.error(err);
      setLoading(false);
    };

    onValue(readingsRef, onData, onErr);
    return () => off(readingsRef);
  }, []);

  const filtered =
    sourceFilter === 'all'
      ? readings
      : readings.filter(r => r.source === sourceFilter);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await remove(ref(database, `readings/${id}`));
      addNotification('Deleted entry', 'success');
    } catch (err) {
      console.error(err);
      addNotification('Delete failed', 'error');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Historical Readings</Title>
        <Controls>
          <Select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
          >
            <option value="all">All Sources</option>
            {sources.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Controls>
      </Header>

      <Fog>
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.9)' }}>Loading...</div>
        ) : (
          <ReadingList>
            {filtered.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.9)' }}>
                No readings found
              </div>
            ) : (
              filtered.map(r => {
                const temp = r.temperature ?? r.temp ?? null;
                const tds = r.tds ?? null;
                const ntu = r.turbidity ?? r.ntu ?? null;
                const doVal = r.dissolvedOxygen ?? r.do ?? null;
                const pH = r.pH ?? null;
                const label = r.pollutionLabel ?? r.label ?? 'Unknown';

                return (
                  <ReadingRow key={r.id}>
                    <div>
                      <SourceName>{r.source ?? 'Unknown'}</SourceName>
                      <Time>
                        {r.timestamp
                          ? new Date(r.timestamp).toLocaleString()
                          : '-'}
                      </Time>

                      <StatsGrid>
                        <Stat>
                          <StatLabel>Temp</StatLabel>
                          <StatValue>{fmt(temp)} °C</StatValue>
                        </Stat>
                        <Stat>
                          <StatLabel>TDS</StatLabel>
                          <StatValue>{fmt(tds)} ppm</StatValue>
                        </Stat>
                        <Stat>
                          <StatLabel>Turbidity</StatLabel>
                          <StatValue>{fmt(ntu)} NTU</StatValue>
                        </Stat>
                        <Stat>
                          <StatLabel>Dissolved O2</StatLabel>
                          <StatValue>{fmt(doVal)} mg/L</StatValue>
                        </Stat>
                        <Stat>
                          <StatLabel>pH</StatLabel>
                          <StatValue>{fmt(pH)}</StatValue>
                        </Stat>
                      </StatsGrid>
                    </div>

                    <Right>
                      <Badge style={{ background: colorFor(label) }}>
                        {label}
                      </Badge>
                      <DelBtn
                        onClick={() => handleDelete(r.id)}
                        disabled={deleting === r.id}
                      >
                        {deleting === r.id ? 'Deleting...' : 'Delete'}
                      </DelBtn>
                    </Right>
                  </ReadingRow>
                );
              })
            )}
          </ReadingList>
        )}
      </Fog>

      <NotificationManager
        notifications={notifications}
        onRemove={removeNotification}
      />
    </Container>
  );
}
