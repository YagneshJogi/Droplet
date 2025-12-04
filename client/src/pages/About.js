// src/pages/About.js
import React, { useState } from 'react';
import styled from 'styled-components';
import SystemInfo from '../components/SystemInfo';
import Specs from '../components/Specs';
import Team from '../components/Team';

/* ---------- PAGE WRAPPER (same spacing feel as dashboard/history) ---------- */
const Container = styled.div`
  padding: 40px 20px 60px;
  max-width: 1120px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* ---------- GLASS HEADER SLAB (matches history/dashboard tiles) ---------- */
const HeaderCard = styled.div`
  width: 100%;
  border-radius: 22px;
  padding: 26px 28px;
  margin-bottom: 30px;

  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(14px) saturate(120%);
  -webkit-backdrop-filter: blur(14px) saturate(120%);
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow:
    0 26px 70px rgba(15, 23, 42, 0.98),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);

  text-align: center;
`;

/* ---------- TITLE & SUBTITLE (no hover, high readability) ---------- */
const Title = styled.h1`
  margin: 0 0 10px;
  font-size: 2.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  pointer-events: none;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`;

/* ---------- TABS (dark pill group like rest of UI) ---------- */
const TabsOuter = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const TabContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: 999px;

  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.45);
  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.95),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
`;

const Tab = styled.button`
  padding: 9px 20px;
  border-radius: 999px;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;

  background: ${({ active }) =>
    active ? 'linear-gradient(180deg,#3b82f6,#2563eb)' : 'transparent'};

  /* ✅ LOCKED TEXT COLORS */
  color: ${({ active }) =>
    active ? '#ffffff' : 'rgba(226,232,240,0.9)'};

  box-shadow: ${({ active }) =>
    active ? '0 16px 36px rgba(37,99,235,0.6)' : 'none'};

  transition: none;

  /* ✅ COMPLETELY DISABLE ALL HOVER VISUAL CHANGES */
  &:hover {
    background: ${({ active }) =>
      active ? 'linear-gradient(180deg,#3b82f6,#2563eb)' : 'transparent'};
    color: ${({ active }) =>
      active ? '#ffffff' : 'rgba(226,232,240,0.9)'};
    box-shadow: ${({ active }) =>
      active ? '0 16px 36px rgba(37,99,235,0.6)' : 'none'};
    transform: none;
  }
`;



/* ---------- CONTENT SLAB (same glass style as dashboard tiles) ---------- */
const ContentContainer = styled.div`
  width: 100%;
  border-radius: 22px;
  padding: 24px 26px;
  margin-top: 4px;

  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(14px) saturate(120%);
  -webkit-backdrop-filter: blur(14px) saturate(120%);
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow:
    0 26px 70px rgba(15, 23, 42, 0.98),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
`;

const About = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SystemInfo />;
      case 'specs':
        return <Specs />;
      case 'team':
        return <Team />;
      default:
        return <SystemInfo />;
    }
  };

  return (
    <Container>
      {/* glass header, like a big history/dashboard card */}
      <HeaderCard>
        <Title>About Smart Water Quality Monitoring System</Title>
        <Subtitle>
          A real-time ESP32-based IoT project that measures key water quality parameters,
          helps classify pollution, and stores only the readings you choose in Firebase.
        </Subtitle>
      </HeaderCard>

      {/* pill-style tabs in front of the ocean */}
      <TabsOuter>
        <TabContainer>
          <Tab
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Tab>
          <Tab
            active={activeTab === 'specs'}
            onClick={() => setActiveTab('specs')}
          >
            Specifications
          </Tab>
          <Tab
            active={activeTab === 'team'}
            onClick={() => setActiveTab('team')}
          >
            Our Team
          </Tab>
        </TabContainer>
      </TabsOuter>

      {/* glass content slab like the other pages */}
      <ContentContainer>{renderContent()}</ContentContainer>
    </Container>
  );
};

export default About;
