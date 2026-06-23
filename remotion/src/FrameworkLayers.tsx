import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const INK = '#0b1220';
const EMERALD = '#10b981';
const FONT = 'ui-sans-serif, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const Background: React.FC = () => (
  <AbsoluteFill
    style={{ background: `radial-gradient(1200px 700px at 20% 10%, #14223a 0%, ${INK} 55%, #05080f 100%)` }}
  />
);

type LayerProps = { title: string; items: string; color: string; from: number };

const Layer: React.FC<LayerProps> = ({ title, items, color, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 16 }, durationInFrames: 24 });
  const y = interpolate(s, [0, 1], [60, 0]);
  if (frame < from) return null;
  return (
    <div
      style={{
        transform: `translateY(${y}px)`,
        opacity: s,
        width: 1180,
        margin: '0 auto 16px',
        borderRadius: 16,
        padding: '20px 30px',
        background: 'rgba(255,255,255,0.04)',
        borderLeft: `8px solid ${color}`,
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ color: '#fff', fontSize: 34, fontWeight: 800 }}>{title}</span>
      <span style={{ color: '#9fb3c8', fontSize: 24 }}>{items}</span>
    </div>
  );
};

export const FrameworkLayers: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background />
      <div style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center', opacity: titleOpacity }}>
        <div style={{ color: EMERALD, fontSize: 24, fontWeight: 700, letterSpacing: 4 }}>
          HOW THE FRAMEWORK IS BUILT
        </div>
        <div style={{ color: '#fff', fontSize: 54, fontWeight: 800, marginTop: 8 }}>
          Layered &amp; scalable by design
        </div>
      </div>
      <Sequence from={0} durationInFrames={330}>
        <AbsoluteFill style={{ justifyContent: 'flex-start', paddingTop: 250 }}>
          <div>
            <Layer from={20} title="src/utils" items="logger · ApiHelper · DataGenerator · schemaValidator" color="#38bdf8" />
            <Layer from={44} title="src/pages  ·  src/api" items="BasePage → POMs  ·  BookingApi client" color="#a78bfa" />
            <Layer from={68} title="src/fixtures" items="test-base (POMs)  ·  booker.fixture (token)" color="#f59e0b" />
            <Layer from={92} title="src/tests" items="e2e  ·  apiTests 01 → 06 (raw → AI)" color="#34d399" />
            <Layer from={116} title="Reports" items="Custom TTA · Playwright · Allure" color="#10b981" />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
