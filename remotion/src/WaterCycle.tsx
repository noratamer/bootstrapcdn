import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

const FPS = 30;

const SKY_TOP = '#7FD1FF';
const SKY_BOTTOM = '#B7E7FF';
const OCEAN_TOP = '#2F8FDB';
const OCEAN_BOTTOM = '#1B5FA6';
const HILL = '#7AC97A';
const HILL_DARK = '#54A85A';
const SUN = '#FFD447';
const CLOUD = '#FFFFFF';
const CLOUD_DARK = '#B8C4D6';
const RAIN = '#4FC3F7';

const Background: React.FC<{ darken?: number }> = ({ darken = 0 }) => {
  const top = mixHex(SKY_TOP, '#4A5A7A', darken);
  const bottom = mixHex(SKY_BOTTOM, '#6D7E9C', darken);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${top} 0%, ${bottom} 60%, ${OCEAN_TOP} 65%, ${OCEAN_BOTTOM} 100%)`,
      }}
    />
  );
};

const Sun: React.FC<{ x: number; y: number; scale?: number; faceHappy?: boolean }> = ({
  x,
  y,
  scale = 1,
  faceHappy = true,
}) => {
  const frame = useCurrentFrame();
  const wobble = Math.sin(frame / 8) * 4;
  const rays = Array.from({ length: 12 });
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g transform={`rotate(${frame * 0.6})`}>
        {rays.map((_, i) => (
          <rect
            key={i}
            x={-6}
            y={-160}
            width={12}
            height={40 + (i % 2 === 0 ? 8 : 0)}
            rx={4}
            fill={SUN}
            transform={`rotate(${(360 / rays.length) * i})`}
          />
        ))}
      </g>
      <circle r={110 + wobble} fill={SUN} />
      <circle r={110 + wobble} fill="none" stroke="#F5B800" strokeWidth={6} />
      <circle cx={-35} cy={-15} r={12} fill="#3A2A00" />
      <circle cx={35} cy={-15} r={12} fill="#3A2A00" />
      <circle cx={-30} cy={-20} r={4} fill="#FFF" />
      <circle cx={40} cy={-20} r={4} fill="#FFF" />
      {faceHappy ? (
        <path d="M -40 25 Q 0 65 40 25" stroke="#3A2A00" strokeWidth={8} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M -40 40 Q 0 15 40 40" stroke="#3A2A00" strokeWidth={8} fill="none" strokeLinecap="round" />
      )}
      <circle cx={-70} cy={30} r={15} fill="#FF9BB0" opacity={0.6} />
      <circle cx={70} cy={30} r={15} fill="#FF9BB0" opacity={0.6} />
    </g>
  );
};

const Cloud: React.FC<{ x: number; y: number; scale?: number; dark?: number }> = ({
  x,
  y,
  scale = 1,
  dark = 0,
}) => {
  const fill = mixHex(CLOUD, CLOUD_DARK, dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={-90} cy={20} rx={80} ry={55} fill={fill} />
      <ellipse cx={0} cy={-10} rx={110} ry={75} fill={fill} />
      <ellipse cx={90} cy={20} rx={85} ry={60} fill={fill} />
      <ellipse cx={-30} cy={40} rx={90} ry={45} fill={fill} />
      <ellipse cx={50} cy={40} rx={80} ry={40} fill={fill} />
    </g>
  );
};

const Droplet: React.FC<{ x: number; y: number; scale?: number; smile?: boolean; opacity?: number }> = ({
  x,
  y,
  scale = 1,
  smile = true,
  opacity = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <path d="M 0 -50 C 30 -10, 40 20, 0 40 C -40 20, -30 -10, 0 -50 Z" fill={RAIN} stroke="#2196F3" strokeWidth={3} />
    <ellipse cx={-8} cy={-10} rx={6} ry={10} fill="#FFF" opacity={0.7} />
    <circle cx={-10} cy={5} r={4} fill="#0D3E66" />
    <circle cx={10} cy={5} r={4} fill="#0D3E66" />
    <circle cx={-8.5} cy={4} r={1.5} fill="#FFF" />
    <circle cx={11.5} cy={4} r={1.5} fill="#FFF" />
    {smile ? (
      <path d="M -8 18 Q 0 26 8 18" stroke="#0D3E66" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    ) : null}
  </g>
);

const Ocean: React.FC<{ y: number }> = ({ y }) => {
  const frame = useCurrentFrame();
  const wave1 = Math.sin(frame / 10) * 8;
  const wave2 = Math.sin(frame / 8 + 1) * 6;
  return (
    <g>
      <rect x={0} y={y} width={1080} height={1920 - y} fill={`url(#oceanGrad)`} />
      <path
        d={`M 0 ${y} Q 270 ${y - 30 + wave1} 540 ${y} T 1080 ${y} L 1080 ${y + 40} L 0 ${y + 40} Z`}
        fill="#5AA9E6"
        opacity={0.6}
      />
      <path
        d={`M 0 ${y + 20} Q 270 ${y - 10 + wave2} 540 ${y + 20} T 1080 ${y + 20} L 1080 ${y + 60} L 0 ${y + 60} Z`}
        fill="#3A88C4"
        opacity={0.5}
      />
    </g>
  );
};

const Hills: React.FC = () => (
  <g>
    <path d="M 0 1450 Q 200 1250 450 1400 T 900 1350 T 1080 1420 L 1080 1600 L 0 1600 Z" fill={HILL_DARK} />
    <path d="M 0 1500 Q 250 1330 550 1470 T 1080 1500 L 1080 1600 L 0 1600 Z" fill={HILL} />
  </g>
);

const Label: React.FC<{ text: string; y: number; frame: number; startFrame: number; color?: string }> = ({
  text,
  y,
  frame,
  startFrame,
  color = '#0F3B66',
}) => {
  const local = frame - startFrame;
  const scale = spring({ frame: local, fps: FPS, config: { damping: 10, stiffness: 120 } });
  const opacity = interpolate(local, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <g transform={`translate(540 ${y}) scale(${scale})`} opacity={opacity}>
      <rect x={-460} y={-70} width={920} height={140} rx={40} fill="#FFF" stroke={color} strokeWidth={8} />
      <text
        x={0}
        y={20}
        textAnchor="middle"
        fontFamily="'Comic Sans MS', 'Baloo', 'Fredoka', sans-serif"
        fontWeight={900}
        fontSize={88}
        fill={color}
      >
        {text}
      </text>
    </g>
  );
};

const Arrow: React.FC<{ path: string; color: string; startFrame: number; frame: number }> = ({
  path,
  color,
  startFrame,
  frame,
}) => {
  const local = frame - startFrame;
  const opacity = interpolate(local, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <path
      d={path}
      stroke={color}
      strokeWidth={10}
      fill="none"
      strokeLinecap="round"
      strokeDasharray="20 15"
      opacity={opacity}
      markerEnd="url(#arrowhead)"
    />
  );
};

const Defs: React.FC = () => (
  <defs>
    <linearGradient id="oceanGrad" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor={OCEAN_TOP} />
      <stop offset="100%" stopColor={OCEAN_BOTTOM} />
    </linearGradient>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 Z" fill="#FFF" stroke="#0F3B66" strokeWidth={1} />
    </marker>
  </defs>
);

// -------------------- SCENES --------------------

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const sunY = interpolate(frame, [0, 40], [500, 320], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const titleScale = spring({ frame: frame - 20, fps: FPS, config: { damping: 8 } });
  const subScale = spring({ frame: frame - 45, fps: FPS, config: { damping: 10 } });
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Sun x={540} y={sunY} scale={1.1} />
      <Hills />
      <Ocean y={1500} />
      <g transform={`translate(540 900) scale(${titleScale})`}>
        <rect x={-500} y={-140} width={1000} height={280} rx={50} fill="#FFF" stroke="#0F3B66" strokeWidth={10} />
        <text
          x={0}
          y={-10}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={140}
          fill="#0F3B66"
        >
          The Water
        </text>
        <text
          x={0}
          y={110}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={140}
          fill="#1E88E5"
        >
          Cycle!
        </text>
      </g>
      <g transform={`translate(540 1180) scale(${subScale})`}>
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={700}
          fontSize={64}
          fill="#0F3B66"
        >
          How water travels around Earth!
        </text>
      </g>
    </svg>
  );
};

const EvaporationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const drops = [
    { x: 250, delay: 0 },
    { x: 450, delay: 15 },
    { x: 700, delay: 30 },
    { x: 850, delay: 8 },
    { x: 350, delay: 45 },
    { x: 600, delay: 60 },
  ];
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Sun x={880} y={280} scale={0.85} />
      <Hills />
      <Ocean y={1400} />
      {drops.map((d, i) => {
        const local = Math.max(0, frame - d.delay);
        const y = interpolate(local, [0, 90], [1400, 500], { extrapolateRight: 'clamp' });
        const opacity = interpolate(local, [0, 10, 80, 100], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
        const scale = interpolate(local, [0, 90], [0.7, 0.3], { extrapolateRight: 'clamp' });
        const wobble = Math.sin((frame + i * 10) / 6) * 25;
        return (
          <Droplet
            key={i}
            x={d.x + wobble}
            y={y}
            scale={scale}
            opacity={opacity}
          />
        );
      })}
      <Arrow
        path="M 200 1300 Q 300 900 400 500"
        color="#FFF"
        startFrame={20}
        frame={frame}
      />
      <Arrow
        path="M 800 1300 Q 750 900 700 500"
        color="#FFF"
        startFrame={35}
        frame={frame}
      />
      <Label text="EVAPORATION" y={200} frame={frame} startFrame={10} color="#E67E22" />
    </svg>
  );
};

const CondensationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cloudScale = spring({ frame, fps: FPS, config: { damping: 12, stiffness: 60 } });
  const drops = [
    { fromX: 200, fromY: 1200, delay: 0 },
    { fromX: 900, fromY: 1300, delay: 10 },
    { fromX: 500, fromY: 1500, delay: 20 },
    { fromX: 750, fromY: 1250, delay: 30 },
    { fromX: 300, fromY: 1400, delay: 15 },
  ];
  const cloudCenter = { x: 540, y: 700 };
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Sun x={200} y={280} scale={0.7} />
      <Hills />
      <Ocean y={1500} />
      <g transform={`translate(${cloudCenter.x} ${cloudCenter.y}) scale(${cloudScale})`}>
        <Cloud x={0} y={0} scale={1.3} />
      </g>
      {drops.map((d, i) => {
        const local = Math.max(0, frame - d.delay);
        const t = interpolate(local, [0, 50], [0, 1], { extrapolateRight: 'clamp' });
        const x = interpolate(t, [0, 1], [d.fromX, cloudCenter.x + (i - 2) * 30]);
        const y = interpolate(t, [0, 1], [d.fromY, cloudCenter.y]);
        const opacity = interpolate(local, [40, 55], [1, 0], { extrapolateRight: 'clamp' });
        return <Droplet key={i} x={x} y={y} scale={0.5} opacity={opacity} />;
      })}
      <Label text="CONDENSATION" y={280} frame={frame} startFrame={10} color="#8E44AD" />
    </svg>
  );
};

const PrecipitationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rainCount = 22;
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Background darken={0.35} />
      <Hills />
      <Ocean y={1500} />
      <Cloud x={540} y={620} scale={1.5} dark={0.5} />
      <Cloud x={220} y={500} scale={0.9} dark={0.4} />
      <Cloud x={860} y={560} scale={1} dark={0.4} />
      {Array.from({ length: rainCount }).map((_, i) => {
        const startX = 180 + (i % 12) * 60;
        const delay = (i * 4) % 40;
        const local = Math.max(0, frame - delay);
        const cycle = local % 45;
        const y = interpolate(cycle, [0, 45], [720, 1500], { extrapolateRight: 'clamp' });
        const opacity = interpolate(cycle, [0, 5, 40, 45], [0, 1, 1, 0]);
        return (
          <g key={i} transform={`translate(${startX} ${y})`} opacity={opacity}>
            <path d="M 0 -18 L 6 12 L -6 12 Z" fill={RAIN} stroke="#1976D2" strokeWidth={2} />
          </g>
        );
      })}
      <Label text="PRECIPITATION" y={250} frame={frame} startFrame={10} color="#2C3E50" />
      {[220, 540, 860].map((x, i) => {
        const bolt = Math.floor(frame / 20) % 3 === i;
        return bolt ? (
          <path
            key={i}
            d={`M ${x - 20} 780 L ${x + 10} 820 L ${x - 10} 850 L ${x + 20} 900`}
            stroke="#FFEB3B"
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            opacity={0.9}
          />
        ) : null;
      })}
    </svg>
  );
};

const CollectionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const drops = [
    { delay: 0 },
    { delay: 20 },
    { delay: 40 },
    { delay: 60 },
    { delay: 80 },
  ];
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Sun x={880} y={280} scale={0.75} />
      <Hills />
      <path
        d="M 500 1350 Q 480 1380 520 1420 Q 500 1460 540 1490 L 620 1500 L 480 1500 Z"
        fill={RAIN}
        stroke="#1976D2"
        strokeWidth={4}
      />
      <path
        d="M 340 1420 Q 420 1400 500 1440 Q 580 1420 700 1440 Q 780 1460 720 1500 L 320 1500 Z"
        fill={RAIN}
        stroke="#1976D2"
        strokeWidth={4}
      />
      <Ocean y={1500} />
      {drops.map((d, i) => {
        const local = ((frame - d.delay) % 100 + 100) % 100;
        const t = local / 100;
        const y = interpolate(t, [0, 1], [1360, 1520]);
        const x = 510 + Math.sin(t * Math.PI * 2) * 30;
        const opacity = interpolate(t, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
        return <Droplet key={i} x={x} y={y} scale={0.35} opacity={opacity} />;
      })}
      <Label text="COLLECTION" y={280} frame={frame} startFrame={10} color="#1976D2" />
      <g transform={`translate(540 950)`} opacity={interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' })}>
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={72}
          fill="#FFF"
          stroke="#0F3B66"
          strokeWidth={4}
        >
          ...and it starts
        </text>
        <text
          x={0}
          y={90}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={72}
          fill="#FFF"
          stroke="#0F3B66"
          strokeWidth={4}
        >
          all over again!
        </text>
      </g>
    </svg>
  );
};

const CycleFinaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = interpolate(frame, [0, 60], [-30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const scale = spring({ frame, fps: FPS, config: { damping: 10 } });
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Background />
      <Sun x={200} y={280} scale={0.7} />
      <Hills />
      <Ocean y={1500} />
      <Cloud x={800} y={400} scale={1} />
      <g transform={`translate(540 960) rotate(${rot}) scale(${scale})`}>
        <circle r={380} fill="none" stroke="#FFF" strokeWidth={20} strokeDasharray="40 25" opacity={0.9} />
        <g transform="rotate(0)">
          <polygon points="0,-395 40,-355 -40,-355" fill="#FFF" />
        </g>
        <g transform="rotate(120)">
          <polygon points="0,-395 40,-355 -40,-355" fill="#FFF" />
        </g>
        <g transform="rotate(240)">
          <polygon points="0,-395 40,-355 -40,-355" fill="#FFF" />
        </g>
        <text
          x={0}
          y={-30}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={110}
          fill="#FFF"
          stroke="#0F3B66"
          strokeWidth={6}
        >
          Nature's
        </text>
        <text
          x={0}
          y={90}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={110}
          fill="#FFEB3B"
          stroke="#0F3B66"
          strokeWidth={6}
        >
          Amazing
        </text>
        <text
          x={0}
          y={210}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={110}
          fill="#FFF"
          stroke="#0F3B66"
          strokeWidth={6}
        >
          Cycle!
        </text>
      </g>
    </svg>
  );
};

// -------------------- ROOT COMPOSITION --------------------

export const WaterCycle: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ width, height, background: '#7FD1FF' }}>
      <Sequence from={0} durationInFrames={120} name="Title">
        <TitleScene />
      </Sequence>
      <Sequence from={120} durationInFrames={130} name="Evaporation">
        <EvaporationScene />
      </Sequence>
      <Sequence from={250} durationInFrames={120} name="Condensation">
        <CondensationScene />
      </Sequence>
      <Sequence from={370} durationInFrames={140} name="Precipitation">
        <PrecipitationScene />
      </Sequence>
      <Sequence from={510} durationInFrames={100} name="Collection">
        <CollectionScene />
      </Sequence>
      <Sequence from={610} durationInFrames={50} name="Finale">
        <CycleFinaleScene />
      </Sequence>
    </AbsoluteFill>
  );
};

// -------------------- UTIL --------------------

function mixHex(a: string, b: string, t: number): string {
  const clamp = Math.max(0, Math.min(1, t));
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * clamp);
  const g = Math.round(ag + (bg - ag) * clamp);
  const bl = Math.round(ab + (bb - ab) * clamp);
  return `rgb(${r}, ${g}, ${bl})`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}
