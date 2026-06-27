import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';

const INK = '#0b1220';
const EMERALD = '#10b981';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const FONT = 'ui-sans-serif, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const Background: React.FC = () => (
  <AbsoluteFill
    style={{ background: `radial-gradient(1200px 700px at 80% 8%, #102a22 0%, ${INK} 55%, #05080f 100%)` }}
  />
);

const Fade: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(
    interpolate(f, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(f, [d - 10, d], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** Typewriter that reveals `text` over `frames` frames, starting at local frame `start`. */
const Line: React.FC<{ start: number; text: string; prompt?: boolean; ok?: boolean }> = ({
  start,
  text,
  prompt,
  ok,
}) => {
  const f = useCurrentFrame();
  const chars = Math.max(0, Math.floor(interpolate(f - start, [0, text.length], [0, text.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })));
  if (f < start) return null;
  return (
    <div style={{ fontFamily: MONO, fontSize: 30, lineHeight: 1.7, color: ok ? EMERALD : '#e6edf3' }}>
      {prompt && <span style={{ color: EMERALD }}>$ </span>}
      {ok && <span style={{ color: EMERALD }}>✓ </span>}
      {text.slice(0, chars)}
    </div>
  );
};

const Terminal: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', fontFamily: FONT }}>
    <div style={{ width: 1500, textAlign: 'center' }}>
      <div style={{ color: '#fff', fontSize: 58, fontWeight: 800, marginBottom: 30 }}>
        Install &amp; run in 60 seconds
      </div>
      <div
        style={{
          background: 'rgba(8,12,20,0.85)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 18,
          boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
          textAlign: 'left',
          padding: '26px 34px',
        }}
      >
        <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
          <span style={{ width: 16, height: 16, borderRadius: 999, background: '#ff5f56' }} />
          <span style={{ width: 16, height: 16, borderRadius: 999, background: '#ffbd2e' }} />
          <span style={{ width: 16, height: 16, borderRadius: 999, background: '#27c93f' }} />
        </div>
        <Line start={6} prompt text="git clone .../AdvancePlaywrightFramework1x" />
        <Line start={46} prompt text="cd AdvancePlaywrightFramework1x" />
        <Line start={74} prompt text="npm install" />
        <Line start={104} prompt text="npx playwright install --with-deps" />
        <Line start={150} prompt text="npm test" />
        <Line start={186} ok text="3 passed  (api + chromium)  4s" />
        <Line start={214} prompt text="open tta-report/index.html" />
      </div>
    </div>
  </AbsoluteFill>
);

export const InstallFlow: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Sequence from={0} durationInFrames={300}>
      <Fade d={300}>
        <Terminal />
      </Fade>
    </Sequence>
  </AbsoluteFill>
);
