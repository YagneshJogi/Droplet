// src/components/Card.js
import styled from 'styled-components';

export const Card = styled.div`
  background: ${({theme}) => theme.ui.glassBg};
  border-radius: ${({theme}) => theme.borderRadius.lg};
  padding: 18px;
  box-shadow: ${({theme}) => theme.ui.cardShadow};
  border: 1px solid ${({theme}) => theme.ui.cardBorder};
  backdrop-filter: blur(${({theme}) => theme.ui.blur}) saturate(120%);
  -webkit-backdrop-filter: blur(${({theme}) => theme.ui.blur});
  transition: transform 180ms ease, box-shadow 220ms ease;
  will-change: transform;
  position: relative;
  &:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(2,6,23,0.36); }
`;

export const CardTitle = styled.h3`
  color: ${({theme}) => theme.colors.text.primary};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const CardContent = styled.div`
  color: ${({theme}) => theme.colors.text.secondary};
`;

export const ValueDisplay = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({theme}) => theme.colors.primary};
  text-align: center;
  margin: 12px 0;
`;

export const Unit = styled.span`
  font-size: 0.95rem;
  color: ${({theme}) => theme.colors.text.secondary};
  margin-left: 6px;
`;
