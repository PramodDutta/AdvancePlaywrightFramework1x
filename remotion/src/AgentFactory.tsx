import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const EMERALD = '#10b981';
const EMERALD_DEEP = '#059669';
const INK = '#0b1220';
const FONT =
  'ui-sans-serif, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(1200px 700px at 18% 12%, #102a22 0%, ${INK} 55%, #05080f 100%)`,
    }}
  />
);

/** Fade a scene in for the first 12 frames and out for the last 12. */
const Fade: React.FC<{ durationInFrames: number; children: React.ReactNode }> = ({
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>{children}</AbsoluteFill>;
};

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', fontFamily: FONT }}>
    {children}
  </AbsoluteFill>
);

const Pill: React.FC<{ label: string; sub: string }> = ({ label, sub }) => (
  <div
    style={{
      width: 360,
      padding: '28px 30px',
      borderRadius: 22,
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${EMERALD}55`,
      boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
      textAlign: 'center',
    }}
  >
    <div style={{ color: '#fff', fontSize: 40, fontWeight: 800 }}>{label}</div>
    <div style={{ color: '#9fb3c8', fontSize: 24, marginTop: 10 }}>{sub}</div>
  </div>
);

const Arrow: React.FC = () => (
  <div style={{ color: EMERALD, fontSize: 64, fontWeight: 900, padding: '0 6px' }}>→</div>
);

const SceneTitle: React.FC<{ kicker: string; title: string }> = ({ kicker, title }) => (
  <div style={{ position: 'absolute', top: 90, width: '100%', textAlign: 'center' }}>
    <div style={{ color: EMERALD, fontSize: 26, fontWeight: 700, letterSpacing: 4 }}>
      {kicker.toUpperCase()}
    </div>
    <div style={{ color: '#fff', fontSize: 58, fontWeight: 800, marginTop: 8 }}>{title}</div>
  </div>
);

const Shot: React.FC<{ src: string; caption: string }> = ({ src, caption }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 70], [1.04, 1.12], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', fontFamily: FONT }}>
      <div
        style={{
          width: 1380,
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
          background: '#fff',
        }}
      >
        <Img src={staticFile(src)} style={{ width: '100%', display: 'block', transform: `scale(${scale})` }} />
      </div>
      <div
        style={{
          marginTop: 28,
          color: '#cfe9df',
          fontSize: 30,
          fontWeight: 600,
          background: 'rgba(16,185,129,0.12)',
          border: `1px solid ${EMERALD}55`,
          padding: '12px 26px',
          borderRadius: 999,
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14 } });
  return (
    <Center>
      <div style={{ transform: `scale(${pop})`, textAlign: 'center' }}>
        <div style={{ fontSize: 96, fontWeight: 900, color: '#fff' }}>
          AI Agent Factory <span style={{ color: EMERALD }}>⚡</span> Playwright
        </div>
        <div style={{ fontSize: 34, color: '#9fb3c8', marginTop: 22 }}>
          Advance Playwright Framework 1x — The Testing Academy
        </div>
        <div
          style={{
            marginTop: 34,
            display: 'inline-block',
            color: INK,
            background: `linear-gradient(90deg, ${EMERALD}, ${EMERALD_DEEP})`,
            fontWeight: 800,
            fontSize: 26,
            padding: '14px 30px',
            borderRadius: 999,
          }}
        >
          plan → generate → heal → report (with AI)
        </div>
      </div>
    </Center>
  );
};

const Outro: React.FC = () => (
  <Center>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 70, fontWeight: 900, color: '#fff' }}>
        Build your own AI test agents
      </div>
      <div style={{ fontSize: 32, color: EMERALD, marginTop: 18, fontWeight: 700 }}>
        src/ai · @ai/index · llmGateway()
      </div>
      <div style={{ fontSize: 28, color: '#9fb3c8', marginTop: 30 }}>
        Built with 💚 by Pramod Dutta · The Testing Academy
      </div>
    </div>
  </Center>
);

export const AgentFactory: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      <Sequence from={0} durationInFrames={60}>
        <Fade durationInFrames={60}>
          <Intro />
        </Fade>
      </Sequence>

      <Sequence from={60} durationInFrames={72}>
        <Fade durationInFrames={72}>
          <SceneTitle kicker="IDE agents (.github/agents)" title="The plan → generate → heal loop" />
          <Center>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 60 }}>
              <Pill label="Planner" sub="framework-aware plan → specs/" />
              <Arrow />
              <Pill label="Generator" sub="POM specs · typecheck + lint" />
              <Arrow />
              <Pill label="Healer" sub="fix in the right layer" />
            </div>
          </Center>
        </Fade>
      </Sequence>

      <Sequence from={132} durationInFrames={72}>
        <Fade durationInFrames={72}>
          <SceneTitle kicker="src/ai — AI Agent Factory" title="Agents from simple prompts" />
          <Center>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 60 }}>
              <Pill label="LLM Gateway" sub="OpenRouter · Groq · OpenAI" />
              <Arrow />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Pill label="DataGenerator" sub="schema-valid test data" />
                <Pill label="RCA Agent" sub="AI Verdict in the report" />
                <Pill label="Flaky Analyzer" sub="build 1 vs build 2" />
              </div>
            </div>
          </Center>
        </Fade>
      </Sequence>

      <Sequence from={204} durationInFrames={66}>
        <Fade durationInFrames={66}>
          <Shot src="01-report.png" caption="Custom TTA report — AI Data · AI Verdict · AI Flaky tabs" />
        </Fade>
      </Sequence>

      <Sequence from={270} durationInFrames={60}>
        <Fade durationInFrames={60}>
          <Shot src="02-playwright.png" caption="Playwright HTML report — @ai tagged agent tests" />
        </Fade>
      </Sequence>

      <Sequence from={330} durationInFrames={60}>
        <Fade durationInFrames={60}>
          <Shot src="03-allure.png" caption="Allure report — trends, suites, environment" />
        </Fade>
      </Sequence>

      <Sequence from={390} durationInFrames={30}>
        <Fade durationInFrames={30}>
          <Outro />
        </Fade>
      </Sequence>
    </AbsoluteFill>
  );
};
