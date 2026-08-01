import { Composition } from 'remotion';
import { WaterCycle, TOTAL_FRAMES } from './WaterCycle';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="WaterCycle"
      component={WaterCycle}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
