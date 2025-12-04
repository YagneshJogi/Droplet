// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ref, push, set } from 'firebase/database';
import { database } from '../firebase';
import { NotificationManager } from '../components/Notification';
import { CardTitle, ValueDisplay } from '../components/Card';
import Gauge from '../components/Gauge';
import { useNavigate } from 'react-router-dom';

/* Container and layout */
const Container = styled.div`
  padding: 36px 28px;
  max-width: 1280px;
  margin: 0 auto;
`;

const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom: 26px;
`;

const PageTitle = styled.h2`
  margin: 0;
  color: ${({theme}) => theme.colors.text.primary};
  font-size: 2rem;
`;

/* Connection badge */
const StatusBadge = styled.div`
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 800;
  display:inline-flex;
  align-items:center;
  gap: 8px;
  background: ${({connected}) =>
    connected
      ? 'linear-gradient(90deg, rgba(16,185,129,0.16), rgba(16,185,129,0.08))'
      : 'linear-gradient(90deg, rgba(239,68,68,0.16), rgba(239,68,68,0.08))'};
  color: ${({connected}) => (connected ? '#bbf7d0' : '#fecaca')};
  border: 1px solid
    ${({connected}) =>
      connected ? 'rgba(34,197,94,0.45)' : 'rgba(248,113,113,0.45)'};
  box-shadow: 0 14px 35px rgba(15,23,42,0.7);
  backdrop-filter: blur(8px);
`;

/* Grid layout */
const Grid = styled.div`
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-bottom: 22px;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

/* === NEW: dashboard tiles styled like history slabs === */
const Tile = styled.div`
  background: rgba(15,23,42,0.78);
  border-radius: 22px;
  padding: 26px;
  box-shadow:
    0 22px 50px rgba(15,23,42,0.85),
    inset 0 1px 0 rgba(255,255,255,0.03);
  border: 1px solid rgba(148,163,184,0.28);
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  transition: transform 160ms ease, box-shadow 180ms ease;
  min-height: 210px;
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  justify-content:center;
  color: ${({theme}) => theme.colors.text.primary};
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 28px 70px rgba(15,23,42,0.95),
      inset 0 1px 0 rgba(255,255,255,0.04);
  }
`;

/* Accent bar */
const Accent = styled.div`
  position:absolute;
  top:16px;
  left:22px;
  width:70px;
  height:8px;
  border-radius:999px;
  background: linear-gradient(
    90deg,
    ${p => p.colorStart || '#06b6d4'},
    ${p => p.colorEnd || '#22c1d1'}
  );
  opacity: 1;
  z-index: 6;
  box-shadow: 0 10px 20px rgba(15,23,42,0.85);
`;

const TileWrapper = styled.div`
  position: relative;
`;

const BigTitle = styled(CardTitle)`
  font-size: 1.05rem;
  margin-bottom: 10px;
`;

const BigValue = styled(ValueDisplay)`
  font-size: 2rem;
  color: ${({theme}) => theme.colors.text.primary};
`;

/* Actions row */
const ActionsRow = styled.div`
  display:flex;
  gap: 14px;
  align-items:center;
  margin-top: 18px;
  width: 100%;

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SourceInput = styled.input`
  flex: 1;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(15,23,42,0.92);
  background: rgba(255,255,255,0.96);
  font-size: 1rem;
  font-weight: 500;
  color: #020617;
  box-shadow:
    0 14px 40px rgba(15,23,42,0.85),
    inset 0 2px 6px rgba(0,0,0,0.12);
  outline: none;

  &::placeholder {
    color: #64748b;
  }
`;

const ButtonsGroup = styled.div`
  display:flex;
  gap: 12px;
  align-items:center;
  @media (max-width: 680px) { width: 100%; justify-content: space-between; }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(180deg,#3b82f6,#2563eb);
  color:white;
  padding: 12px 20px;
  border-radius: 16px;
  border: 1px solid rgba(191,219,254,0.6);
  font-weight:800;
  min-width:170px;
  cursor:pointer;
  box-shadow: 0 16px 38px rgba(37,99,235,0.35);

  &:disabled {
    opacity: 0.6;
    cursor:not-allowed;
    box-shadow:none;
  }
`;

const SaveButton = styled(PrimaryButton)`
  background: linear-gradient(180deg,#22c55e,#16a34a);
  box-shadow: 0 16px 38px rgba(34,197,94,0.35);
`;

/* Manual card matches other tiles but with center layout */
const ManualCard = styled(Tile)`
  align-items: center;
  text-align:center;
  justify-content: center;
  gap: 14px;
`;

const ManualButton = styled.button`
  background: linear-gradient(180deg,#7c3aed,#6b21a8);
  color: white;
  padding: 12px 18px;
  border-radius: 999px;
  border: 1px solid rgba(216,180,254,0.7);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 16px 40px rgba(124,58,237,0.4);
`;

const PredictedBar = styled.div`
  margin-top: 20px;
  padding: 14px 20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-radius: 16px;
  background: rgba(15,23,42,0.82);
  border: 1px solid rgba(148,163,184,0.4);
  box-shadow:
    0 20px 55px rgba(15,23,42,0.95),
    inset 0 1px 0 rgba(255,255,255,0.03);
  color: ${({theme}) => theme.colors.text.primary};
`;

function Dashboard() {
  const navigate = useNavigate();

  const [sensorData, setSensorData] = useState({
    temp: 0,
    tds: 0,
    ntu: 0,
    do: 0,
    pH: 7.0
  });
  const [connected, setConnected] = useState(false);
  const [source, setSource] = useState('');
  const [pollutionLabel, setPollutionLabel] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'success') =>
    setNotifications(prev => [...prev, { message, type }]);

  const removeNotification = (i) =>
    setNotifications(prev => prev.filter((_, idx) => idx !== i));

  // Fetch from local Node proxy or ESP32 endpoint
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const hostname = window.location.hostname;
        const res = await fetch(`http://${hostname}:5000/api/data`);
        if (!res.ok) throw new Error('Fetch error');
        const d = await res.json();
        if (!mounted) return;

        setSensorData(prev => ({
          temp: Number(d.temp ?? prev.temp),
          tds: Number(d.tds ?? prev.tds),
          ntu: Number(d.ntu ?? prev.ntu),
          do: Number(d.do ?? prev.do),
          pH: Number(d.pH ?? prev.pH)
        }));
        setConnected(true);
      } catch (err) {
        setConnected(false);
      }
    };

    fetchData();
    const id = setInterval(fetchData, 2000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const classifyLocal = ({ tds, pH, ntu, do: DO, temp }) => {
    if (DO > 7 && tds < 300 && ntu < 5 && pH >= 6.5 && pH <= 8.5) return 'Good Water';
    if (DO < 3 && ntu > 10) return 'Sewage';
    if (tds > 500 && ntu > 10 && pH > 7.5) return 'Agricultural Runoff';
    if (tds > 1000 || pH < 6 || pH > 9) return 'Chemical Intrusion';
    if (temp > 30 && DO < 6) return 'Thermal Pollution';
    return 'Good Water';
  };

  const handleClassify = async () => {
    setIsClassifying(true);
    try {
      const label = classifyLocal(sensorData);
      setPollutionLabel(label);
      addNotification(`Classified: ${label}`, 'success');
    } catch (err) {
      addNotification('Classification failed', 'error');
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSave = async () => {
    if (!pollutionLabel) {
      addNotification('Please classify before saving', 'error');
      return;
    }
    if (!source.trim()) {
      addNotification('Please enter water source', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const readingsRef = ref(database, 'readings');
      const newRef = push(readingsRef);
      await set(newRef, {
        temperature: Number(sensorData.temp),
        tds: Number(sensorData.tds),
        turbidity: Number(sensorData.ntu),
        dissolvedOxygen: Number(sensorData.do),
        pH: Number(sensorData.pH),
        pollutionLabel,
        source: source.trim(),
        timestamp: new Date().toISOString()
      });
      addNotification('Saved reading to Firebase', 'success');
      setSource('');
    } catch (err) {
      addNotification('Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <Header>
        <PageTitle>Current Sensor Readings</PageTitle>
        <StatusBadge connected={connected}>
          {connected ? 'Connected to ESP32 / RTDB' : '⚠ Connection Error'}
        </StatusBadge>
      </Header>

      <Grid>
        {/* Temperature */}
        <TileWrapper>
          <Accent colorStart="#22d3ee" colorEnd="#0ea5e9" />
          <Tile>
            <BigTitle>Temperature</BigTitle>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 14,
                width: '100%'
              }}
            >
              <div style={{ width: '100%', maxWidth: 260 }}>
                <Gauge
                  value={Number(sensorData.temp)}
                  min={-10}
                  max={50}
                  unit="°C"
                />
              </div>
              <BigValue>{Number(sensorData.temp).toFixed(2)} °C</BigValue>
            </div>
          </Tile>
        </TileWrapper>

        {/* TDS */}
        <TileWrapper>
          <Accent colorStart="#60a5fa" colorEnd="#3b82f6" />
          <Tile>
            <BigTitle>TDS</BigTitle>
            <BigValue>{Number(sensorData.tds).toFixed(2)} ppm</BigValue>
          </Tile>
        </TileWrapper>

        {/* Turbidity */}
        <TileWrapper>
          <Accent colorStart="#a855f7" colorEnd="#f97316" />
          <Tile>
            <BigTitle>Turbidity (Quadratic)</BigTitle>
            <BigValue>{Number(sensorData.ntu).toFixed(2)} NTU</BigValue>
          </Tile>
        </TileWrapper>

        {/* DO */}
        <TileWrapper>
          <Accent colorStart="#22c55e" colorEnd="#4ade80" />
          <Tile>
            <BigTitle>Dissolved O2</BigTitle>
            <BigValue>{Number(sensorData.do).toFixed(2)} mg/L</BigValue>
          </Tile>
        </TileWrapper>

        {/* pH */}
        <TileWrapper>
          <Accent colorStart="#38bdf8" colorEnd="#0ea5e9" />
          <Tile>
            <BigTitle>pH (read-only)</BigTitle>
            <BigValue>{Number(sensorData.pH).toFixed(2)}</BigValue>
          </Tile>
        </TileWrapper>

        {/* Manual Test */}
        <TileWrapper>
          <Accent colorStart="#fb7185" colorEnd="#f97316" />
          <ManualCard>
            <BigTitle>Manual Test</BigTitle>
            <div style={{ color: 'rgba(226,232,240,0.9)' }}>
              Enter custom parameters on the test page
            </div>
            <ManualButton onClick={() => navigate('/test-input')}>
              Open Test Input
            </ManualButton>
          </ManualCard>
        </TileWrapper>
      </Grid>

      <ActionsRow>
        <SourceInput
          placeholder="Enter water source (e.g., tap, lake, well)"
          value={source}
          onChange={e => setSource(e.target.value)}
        />

        <ButtonsGroup>
          <PrimaryButton onClick={handleClassify} disabled={isClassifying}>
            {isClassifying ? 'Classifying...' : 'Classify Pollution'}
          </PrimaryButton>

          <SaveButton
            onClick={handleSave}
            disabled={isSaving || !pollutionLabel}
          >
            {isSaving ? 'Saving...' : 'Save to Firebase'}
          </SaveButton>
        </ButtonsGroup>
      </ActionsRow>

      {pollutionLabel && (
        <PredictedBar>
          <div style={{ color: 'rgba(241,245,249,0.96)' }}>
            <strong>Predicted:</strong>&nbsp;
            <span style={{ fontSize: 16 }}>{pollutionLabel}</span>
          </div>
          <div style={{ color: 'rgba(148,163,184,0.9)' }}>
            {new Date().toLocaleString()}
          </div>
        </PredictedBar>
      )}

      <NotificationManager
        notifications={notifications}
        onRemove={removeNotification}
      />
    </Container>
  );
}

export default Dashboard;
