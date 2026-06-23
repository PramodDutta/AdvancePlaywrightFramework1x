import React from 'react';
import { Composition } from 'remotion';
import { AgentFactory } from './AgentFactory';
import { InstallFlow } from './InstallFlow';
import { FrameworkLayers } from './FrameworkLayers';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AgentFactory"
        component={AgentFactory}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="InstallFlow"
        component={InstallFlow}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FrameworkLayers"
        component={FrameworkLayers}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
