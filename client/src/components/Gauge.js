// src/components/Gauge.js
import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

/*
  Modern semicircle gauge.
  Props:
    - value (number)
    - min (number)
    - max (number)
    - size (px) optional (default 160)
    - thickness (px) optional (default 12)
    - unit (string) optional
*/

const rotateIn = keyframes`
  from { transform: rotate(-90deg); }
  to { transform: rotate(0deg); }
`;

const Wrapper = styled.div`
  display:inline-flex;
  flex-direction:column;
  align-items:center;
  gap: 6px;
  user-select: none;
`;

const SvgWrap = styled.div`
  width: ${p => p.size}px;
  height: ${p => Math.ceil(p.size/2)}px; /* semicircle area */
  display:block;
  overflow: visible;
`;

const Value = styled.div`
  font-weight: 800;
  color: ${({theme}) => theme.colors.text.primary};
  font-size: 1.05rem;
  margin-top: 2px;
`;

const LabelSmall = styled.div`
  font-size: 0.85rem;
  color: ${({theme}) => theme.colors.text.secondary};
  margin-top: 2px;
`;

/* helper to pick color from value % */
function colorForPct(pct) {
  if (pct <= 0.25) return ['#06b6d4', '#06b6d4']; // teal
  if (pct <= 0.5) return ['#60a5fa', '#2563eb']; // blue
  if (pct <= 0.75) return ['#f59e0b', '#f97316']; // amber
  return ['#ef4444', '#f43f5e']; // red
}

export default function Gauge({
  value = 0,
  min = 0,
  max = 100,
  size = 180,
  thickness = 14,
  unit = ''
}) {
  // clamp
  const clamped = Math.max(min, Math.min(max, Number(value) || 0));
  const pct = (clamped - min) / (max - min || 1);
  const angle = pct * 180; // 0..180

  const [startColor, endColor] = colorForPct(pct);

  // arc math
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const start = polarToCartesian(cx, cy, radius, 180);
  const end = polarToCartesian(cx, cy, radius, 0);
  const fullArc = describeArc(cx, cy, radius, 180, 0);

  // progress arc path from 180 to 180-angle
  const progressEndAngle = 180 - angle; // because svg arc goes from left to right
  const progressArc = describeArc(cx, cy, radius, 180, progressEndAngle);

  // tick marks configuration (optional, small tics)
  const ticks = useMemo(() => {
    const t = [];
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const a = 180 - (i / steps) * 180;
      const p1 = polarToCartesian(cx, cy, radius - thickness - 4, a);
      const p2 = polarToCartesian(cx, cy, radius + 2, a);
      t.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    }
    return t;
  }, [cx, cy, radius, thickness]);

  return (
    <Wrapper>
      <SvgWrap size={size}>
        <svg width={size} height={size/2} viewBox={`0 0 ${size} ${size/2}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="gaugeTrack" x1="0%" x2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.06)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)"/>
            </linearGradient>

            <linearGradient id="gaugeProgress" x1="0%" x2="100%">
              <stop offset="0%" stopColor={startColor}/>
              <stop offset="100%" stopColor={endColor}/>
            </linearGradient>
            <filter id="gaugeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* background arc track */}
          <path d={fullArc}
                fill="none"
                stroke="url(#gaugeTrack)"
                strokeWidth={thickness}
                strokeLinecap="round"
                opacity="0.9"
          />

          {/* progress arc */}
          <path d={progressArc}
                fill="none"
                stroke="url(#gaugeProgress)"
                strokeWidth={thickness}
                strokeLinecap="round"
                style={{ filter: 'url(#gaugeGlow)', transition: 'd 500ms ease, stroke 500ms ease' }}
          />

          {/* ticks */}
          {ticks.map((tk, i) => (
            <line
              key={i}
              x1={tk.x1}
              y1={tk.y1 - (size/2 - cy)}
              x2={tk.x2}
              y2={tk.y2 - (size/2 - cy)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={i % 5 === 0 ? 2 : 1}
              strokeLinecap="round"
            />
          ))}

          {/* needle dot at progress end */}
          {(() => {
            const needle = polarToCartesian(cx, cy, radius, progressEndAngle);
            return (
              <circle cx={needle.x} cy={needle.y - (size/2 - cy)} r={6} fill={endColor} stroke="rgba(255,255,255,0.12)" strokeWidth={2}/>
            );
          })()}
        </svg>
      </SvgWrap>

      <Value>{clamped.toFixed(2)} {unit}</Value>
      <LabelSmall>{/* optional small label */}</LabelSmall>
    </Wrapper>
  );
}

/* ---------------------------
   Helper functions (arc math)
   --------------------------- */
function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle){
  // This describes an arc in absolute coordinates (SVG path)
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");

  return d;
}
