import { Composition } from 'remotion';
import { WaterCycle } from './WaterCycle';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="WaterCycle"
      component={WaterCycle}
      durationInFrames={30 * 22}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
