import { Composition } from 'remotion';
import { WaterCycle, TOTAL_FRAMES } from './WaterCycle';
import { Storybook, STORYBOOK_FRAMES } from './Storybook';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WaterCycle"
        component={WaterCycle}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Storybook"
        component={Storybook}
        durationInFrames={STORYBOOK_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
