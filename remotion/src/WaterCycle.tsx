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

// -------------------- PASTEL PALETTE --------------------
const SKY_TOP = '#FFD6E7';
const SKY_BOTTOM = '#D6ECFF';
const OCEAN_TOP = '#A8CBE8';
const OCEAN_BOTTOM = '#7FA6C9';
const HILL_FAR = '#D4EBD8';
const HILL_MID = '#B8DFBF';
const HILL_NEAR = '#9BCFA5';
const GRASS = '#7EB88A';
const SUN = '#FFE9A3';
const SUN_STROKE = '#EFCA7A';
const CLOUD = '#FFFCFB';
const CLOUD_SHADOW = '#F1E4EE';
const CLOUD_DARK = '#B0AAC7';
const RAIN = '#BEE4F3';
const RAIN_STROKE = '#7FA8C4';
const INK = '#5A6480';
const FLOWER_PINK = '#F7B8D0';
const FLOWER_YELLOW = '#FFEFA8';
const CHEEK = '#FFC3D2';
const HIGHLIGHT_YELLOW = '#FFF3C4';

// hand-drawn wiggle for outlines
const wiggle = (frame: number, amp = 1.2) => Math.sin(frame / 4) * amp;

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

// -------------------- DEFS --------------------
const Defs: React.FC = () => (
  <defs>
    <linearGradient id="skyGrad" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor={SKY_TOP} />
      <stop offset="100%" stopColor={SKY_BOTTOM} />
    </linearGradient>
    <linearGradient id="skyGradDark" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#B8B4D6" />
      <stop offset="100%" stopColor="#D6CFE3" />
    </linearGradient>
    <linearGradient id="oceanGrad" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor={OCEAN_TOP} />
      <stop offset="100%" stopColor={OCEAN_BOTTOM} />
    </linearGradient>
    <linearGradient id="sunGrad" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#FFF3C4" />
      <stop offset="100%" stopColor={SUN} />
    </linearGradient>
    <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor="#FFF3E0" stopOpacity="0.55" />
      <stop offset="100%" stopColor="#FFF3E0" stopOpacity="0" />
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
      <feOffset dx="0" dy="6" result="offsetblur" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.35" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// -------------------- SKY / BG --------------------
const Sky: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <rect x={0} y={0} width={1080} height={1920} fill={dark ? 'url(#skyGradDark)' : 'url(#skyGrad)'} />
);

const Star: React.FC<{ x: number; y: number; scale?: number; delay?: number }> = ({
  x,
  y,
  scale = 1,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.7 + 0.3 * Math.sin((frame + delay) / 6);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={pulse}>
      <path d="M 0 -14 L 4 -4 L 14 0 L 4 4 L 0 14 L -4 4 L -14 0 L -4 -4 Z" fill="#FFF3C4" />
    </g>
  );
};

// -------------------- SUN --------------------
const Sun: React.FC<{ x: number; y: number; scale?: number; happy?: boolean; wink?: boolean }> = ({
  x,
  y,
  scale = 1,
  happy = true,
  wink = false,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 14) * 6;
  const rays = Array.from({ length: 14 });
  const cheeks = 0.55 + 0.15 * Math.sin(frame / 20);
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${scale})`}>
      <circle r={180} fill="url(#sunGlow)" />
      <g transform={`rotate(${frame * 0.7})`}>
        {rays.map((_, i) => (
          <path
            key={i}
            d="M 0 -170 L 10 -130 L -10 -130 Z"
            fill={SUN}
            stroke={SUN_STROKE}
            strokeWidth={3}
            transform={`rotate(${(360 / rays.length) * i})`}
          />
        ))}
      </g>
      <circle r={115} fill="url(#sunGrad)" stroke={SUN_STROKE} strokeWidth={6} />
      <circle cx={-70} cy={30} r={18} fill={CHEEK} opacity={cheeks} />
      <circle cx={70} cy={30} r={18} fill={CHEEK} opacity={cheeks} />
      {wink ? (
        <path d="M -50 -15 Q -35 -25 -20 -15" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      ) : (
        <>
          <ellipse cx={-35} cy={-15} rx={12} ry={16} fill={INK} />
          <circle cx={-30} cy={-22} r={5} fill="#FFF" />
        </>
      )}
      <ellipse cx={35} cy={-15} rx={12} ry={16} fill={INK} />
      <circle cx={40} cy={-22} r={5} fill="#FFF" />
      {happy ? (
        <path
          d="M -40 20 Q 0 60 40 20"
          stroke={INK}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path d="M -35 40 Q 0 20 35 40" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
      )}
      <path
        d="M -22 25 Q -15 40 -8 25"
        stroke="#E896A8"
        strokeWidth={4}
        fill="#E896A8"
        strokeLinecap="round"
      />
    </g>
  );
};

// -------------------- CLOUD --------------------
const Cloud: React.FC<{
  x: number;
  y: number;
  scale?: number;
  dark?: number;
  eyes?: boolean;
  smile?: boolean;
  frown?: boolean;
}> = ({ x, y, scale = 1, dark = 0, eyes = false, smile = false, frown = false }) => {
  const frame = useCurrentFrame();
  const w = wiggle(frame, 1);
  const fill = mixHex(CLOUD, CLOUD_DARK, dark);
  const shadow = mixHex(CLOUD_SHADOW, CLOUD_DARK, dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={-100 + w} cy={40} rx={95} ry={55} fill={shadow} />
      <ellipse cx={20 + w} cy={55} rx={130} ry={55} fill={shadow} />
      <ellipse cx={100} cy={45} rx={95} ry={50} fill={shadow} />
      <ellipse cx={-95} cy={20} rx={90} ry={62} fill={fill} />
      <ellipse cx={0} cy={-15} rx={120} ry={82} fill={fill} />
      <ellipse cx={95} cy={20} rx={90} ry={65} fill={fill} />
      <ellipse cx={-35} cy={35} rx={95} ry={50} fill={fill} />
      <ellipse cx={55} cy={35} rx={85} ry={45} fill={fill} />
      {eyes ? (
        <>
          <ellipse cx={-35} cy={-10} rx={9} ry={13} fill={INK} />
          <ellipse cx={35} cy={-10} rx={9} ry={13} fill={INK} />
          <circle cx={-32} cy={-15} r={3} fill="#FFF" />
          <circle cx={38} cy={-15} r={3} fill="#FFF" />
          {smile ? (
            <path d="M -25 15 Q 0 35 25 15" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
          ) : null}
          {frown ? (
            <path d="M -25 25 Q 0 5 25 25" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
          ) : null}
        </>
      ) : null}
    </g>
  );
};

// -------------------- DROPLET CHARACTER --------------------
const Droplet: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  wave?: boolean;
  arms?: boolean;
  legs?: boolean;
  bounce?: boolean;
  smile?: boolean;
  rot?: number;
}> = ({
  x,
  y,
  scale = 1,
  opacity = 1,
  wave = false,
  arms = false,
  legs = false,
  bounce = false,
  smile = true,
  rot = 0,
}) => {
  const frame = useCurrentFrame();
  const b = bounce ? Math.sin(frame / 5) * 3 : 0;
  const waveAngle = wave ? Math.sin(frame / 4) * 25 : 0;
  return (
    <g transform={`translate(${x} ${y + b}) scale(${scale}) rotate(${rot})`} opacity={opacity}>
      <path
        d="M 0 -55 C 32 -12, 45 22, 0 45 C -45 22, -32 -12, 0 -55 Z"
        fill={RAIN}
        stroke={RAIN_STROKE}
        strokeWidth={4}
      />
      <ellipse cx={-10} cy={-10} rx={7} ry={12} fill="#FFF" opacity={0.75} />
      <ellipse cx={-12} cy={7} rx={5} ry={7} fill={INK} />
      <ellipse cx={12} cy={7} rx={5} ry={7} fill={INK} />
      <circle cx={-11} cy={5} r={2} fill="#FFF" />
      <circle cx={13} cy={5} r={2} fill="#FFF" />
      {smile ? (
        <path
          d="M -10 22 Q 0 32 10 22"
          stroke={INK}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path d="M -6 24 Q 0 20 6 24" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      )}
      <ellipse cx={-16} cy={18} rx={5} ry={3} fill={CHEEK} opacity={0.75} />
      <ellipse cx={16} cy={18} rx={5} ry={3} fill={CHEEK} opacity={0.75} />
      {arms ? (
        <>
          <g transform={`translate(-25 5) rotate(${-30 + waveAngle})`}>
            <path
              d="M 0 0 Q -8 12 -14 22"
              stroke={RAIN_STROKE}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={-14} cy={22} r={5} fill={RAIN} stroke={RAIN_STROKE} strokeWidth={3} />
          </g>
          <g transform={`translate(25 5) rotate(${30 - waveAngle})`}>
            <path
              d="M 0 0 Q 8 12 14 22"
              stroke={RAIN_STROKE}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={14} cy={22} r={5} fill={RAIN} stroke={RAIN_STROKE} strokeWidth={3} />
          </g>
        </>
      ) : null}
      {legs ? (
        <>
          <path d="M -10 40 L -10 55" stroke={RAIN_STROKE} strokeWidth={5} strokeLinecap="round" />
          <path d="M 10 40 L 10 55" stroke={RAIN_STROKE} strokeWidth={5} strokeLinecap="round" />
          <ellipse cx={-10} cy={57} rx={7} ry={4} fill={RAIN_STROKE} />
          <ellipse cx={10} cy={57} rx={7} ry={4} fill={RAIN_STROKE} />
        </>
      ) : null}
    </g>
  );
};

// -------------------- OCEAN --------------------
const Ocean: React.FC<{ y: number; withFish?: boolean }> = ({ y, withFish = true }) => {
  const frame = useCurrentFrame();
  const w1 = Math.sin(frame / 10) * 10;
  const w2 = Math.sin(frame / 8 + 1) * 8;
  const w3 = Math.sin(frame / 12 + 2) * 6;
  return (
    <g>
      <rect x={0} y={y} width={1080} height={1920 - y} fill="url(#oceanGrad)" />
      <path
        d={`M 0 ${y} Q 270 ${y - 40 + w1} 540 ${y} T 1080 ${y} L 1080 ${y + 30} L 0 ${y + 30} Z`}
        fill="#C7DFF0"
        opacity={0.8}
      />
      <path
        d={`M 0 ${y + 30} Q 270 ${y + w2} 540 ${y + 30} T 1080 ${y + 30} L 1080 ${y + 70} L 0 ${y + 70} Z`}
        fill="#9BC0DC"
        opacity={0.7}
      />
      <path
        d={`M 0 ${y + 65} Q 270 ${y + 35 + w3} 540 ${y + 65} T 1080 ${y + 65} L 1080 ${y + 110} L 0 ${y + 110} Z`}
        fill="#88ACC6"
        opacity={0.7}
      />
      {[
        { x: 150, py: 45 },
        { x: 400, py: 30 },
        { x: 720, py: 55 },
        { x: 900, py: 40 },
        { x: 550, py: 65 },
      ].map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${y - s.py + Math.sin((frame + i * 5) / 8) * 3})`}>
          <ellipse rx={30} ry={4} fill="#FFF" opacity={0.85} />
        </g>
      ))}
      {withFish
        ? [
            { x0: -60, y: y + 220, phase: 0, flip: 1, color: '#FFB59A' },
            { x0: 1140, y: y + 380, phase: 40, flip: -1, color: '#FFE7A8' },
            { x0: -60, y: y + 320, phase: 80, flip: 1, color: '#D9B8E8' },
          ].map((f, i) => {
            const t = ((frame + f.phase) % 200) / 200;
            const x = f.flip === 1 ? -60 + t * 1200 : 1140 - t * 1200;
            const wob = Math.sin((frame + i * 8) / 6) * 6;
            return (
              <g key={i} transform={`translate(${x} ${f.y + wob}) scale(${f.flip} 1)`}>
                <ellipse rx={28} ry={16} fill={f.color} stroke={INK} strokeWidth={3} />
                <polygon points="28,0 45,-14 45,14" fill={f.color} stroke={INK} strokeWidth={3} />
                <circle cx={-10} cy={-3} r={4} fill="#FFF" />
                <circle cx={-9} cy={-3} r={2} fill={INK} />
                <path d="M 4 4 Q 8 8 4 12" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
              </g>
            );
          })
        : null}
    </g>
  );
};

// -------------------- HILLS / GROUND --------------------
const Hills: React.FC<{ withFlowers?: boolean }> = ({ withFlowers = true }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      <path
        d="M 0 1350 Q 260 1130 500 1300 T 900 1240 T 1080 1330 L 1080 1600 L 0 1600 Z"
        fill={HILL_FAR}
      />
      <path
        d="M 0 1420 Q 220 1230 460 1380 T 820 1340 T 1080 1400 L 1080 1600 L 0 1600 Z"
        fill={HILL_MID}
      />
      <path
        d="M 0 1500 Q 260 1330 560 1470 T 1080 1500 L 1080 1600 L 0 1600 Z"
        fill={HILL_NEAR}
      />
      <path
        d="M 0 1500 Q 260 1330 560 1470 T 1080 1500"
        fill="none"
        stroke={GRASS}
        strokeWidth={6}
        strokeDasharray="10 8"
        opacity={0.6}
      />
      {[100, 260, 420, 610, 760, 920, 1020].map((tx, i) => {
        const swayA = Math.sin((frame + i * 6) / 10) * 4;
        return (
          <g key={i} transform={`translate(${tx} 1480) rotate(${swayA})`}>
            <path
              d="M 0 0 Q -6 -30 -3 -70"
              stroke="#B08A6A"
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={-3} cy={-80} r={38} fill="#A8D8B0" stroke="#7EB88A" strokeWidth={4} />
            <circle cx={-18} cy={-95} r={22} fill="#B8E0BF" stroke="#7EB88A" strokeWidth={3} />
            <circle cx={12} cy={-95} r={22} fill="#B8E0BF" stroke="#7EB88A" strokeWidth={3} />
          </g>
        );
      })}
      {withFlowers
        ? [180, 340, 500, 660, 830, 980].map((fx, i) => {
            const sway = Math.sin((frame + i * 12) / 8) * 3;
            return (
              <g key={i} transform={`translate(${fx + sway} 1520)`}>
                <line x1={0} y1={0} x2={0} y2={-30} stroke={GRASS} strokeWidth={4} />
                <circle cx={0} cy={-30} r={8} fill={i % 2 ? FLOWER_PINK : FLOWER_YELLOW} stroke={INK} strokeWidth={2} />
                <circle cx={0} cy={-30} r={3} fill={INK} />
              </g>
            );
          })
        : null}
    </g>
  );
};

// -------------------- BIRDS --------------------
const Birds: React.FC<{ y?: number }> = ({ y = 600 }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {[
        { xOff: 100, delay: 0 },
        { xOff: 200, delay: 20 },
        { xOff: 60, delay: 40 },
      ].map((b, i) => {
        const t = ((frame + b.delay) % 200) / 200;
        const x = -60 + t * 1200;
        const yy = y + b.xOff + Math.sin(frame / 8 + i) * 20;
        const flap = 8 + Math.sin(frame / 3 + i) * 10;
        return (
          <g key={i} transform={`translate(${x} ${yy})`}>
            <path
              d={`M -22 0 Q -10 -${flap} 0 0 Q 10 -${flap} 22 0`}
              stroke={INK}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </g>
  );
};

// -------------------- LABEL --------------------
const Label: React.FC<{
  text: string;
  y: number;
  frame: number;
  startFrame: number;
  color?: string;
  bg?: string;
}> = ({ text, y, frame, startFrame, color = INK, bg = '#FFFCFB' }) => {
  const local = frame - startFrame;
  const scale = spring({ frame: local, fps: FPS, config: { damping: 8, stiffness: 120 } });
  const opacity = interpolate(local, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const wob = wiggle(frame, 0.6);
  return (
    <g transform={`translate(540 ${y + wob}) scale(${scale})`} opacity={opacity}>
      <rect x={-472} y={-80} width={944} height={160} rx={50} fill={INK} opacity={0.15} transform="translate(0 8)" />
      <rect x={-470} y={-78} width={940} height={156} rx={48} fill={bg} stroke={color} strokeWidth={10} />
      <text
        x={0}
        y={26}
        textAnchor="middle"
        fontFamily="'Comic Sans MS', 'Baloo', sans-serif"
        fontWeight={900}
        fontSize={92}
        fill={color}
      >
        {text}
      </text>
    </g>
  );
};

// -------------------- TRANSITION WIPE --------------------
const FadeOverlay: React.FC<{ localFrame: number; totalFrames: number; color?: string }> = ({
  localFrame,
  totalFrames,
  color = '#FFF',
}) => {
  const fadeIn = interpolate(localFrame, [0, 10], [1, 0], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(localFrame, [totalFrames - 10, totalFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const op = Math.max(fadeIn, fadeOut);
  if (op <= 0) return null;
  return <rect x={0} y={0} width={1080} height={1920} fill={color} opacity={op} />;
};

// -------------------- SCENES --------------------

const TitleScene: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const sunY = interpolate(frame, [0, 45], [520, 340], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const titleScale = spring({ frame: frame - 15, fps: FPS, config: { damping: 8 } });
  const subScale = spring({ frame: frame - 40, fps: FPS, config: { damping: 10 } });
  const subY = interpolate(frame, [40, 60], [1240, 1200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const w = wiggle(frame, 1.2);
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Sky />
      <Star x={200} y={200} delay={0} />
      <Star x={880} y={180} delay={10} />
      <Star x={140} y={400} delay={20} scale={0.7} />
      <Sun x={540} y={sunY} scale={1.15} />
      <Birds y={500} />
      <Cloud x={220} y={720} scale={0.7} />
      <Cloud x={860} y={800} scale={0.8} />
      <Hills />
      <Ocean y={1500} />
      <g transform={`translate(${540 + w} 950) scale(${titleScale})`}>
        <rect x={-500} y={-160} width={1000} height={320} rx={60} fill={INK} opacity={0.2} transform="translate(0 12)" />
        <rect x={-500} y={-160} width={1000} height={320} rx={60} fill="#FFF" stroke={INK} strokeWidth={12} />
        <text
          x={0}
          y={-20}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={140}
          fill={INK}
        >
          The Water
        </text>
        <text
          x={0}
          y={130}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={140}
          fill="#8FB7DA"
        >
          Cycle!
        </text>
      </g>
      <g transform={`translate(540 ${subY}) scale(${subScale})`}>
        <rect x={-440} y={-50} width={880} height={100} rx={30} fill={HIGHLIGHT_YELLOW} stroke={INK} strokeWidth={6} />
        <text
          x={0}
          y={22}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={800}
          fontSize={54}
          fill={INK}
        >
          How water travels around Earth!
        </text>
      </g>
      <Droplet x={220} y={1360} scale={0.75} arms wave bounce />
      <Droplet x={860} y={1340} scale={0.7} arms wave bounce rot={5} />
      <FadeOverlay localFrame={frame} totalFrames={len} />
    </svg>
  );
};

const EvaporationScene: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const drops = [
    { x: 230, delay: 0, rot: -8 },
    { x: 430, delay: 15, rot: 5 },
    { x: 660, delay: 30, rot: -4 },
    { x: 850, delay: 8, rot: 8 },
    { x: 340, delay: 45, rot: -6 },
    { x: 780, delay: 60, rot: 3 },
    { x: 540, delay: 22, rot: 0 },
  ];
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Sky />
      <Sun x={860} y={320} scale={0.95} wink />
      <Birds y={520} />
      <Cloud x={200} y={550} scale={0.55} />
      <Hills />
      <Ocean y={1400} withFish />
      {drops.map((d, i) => {
        const local = Math.max(0, frame - d.delay);
        const y = interpolate(local, [0, 110], [1400, 460], { extrapolateRight: 'clamp' });
        const opacity = interpolate(local, [0, 10, 90, 110], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
        const scale = interpolate(local, [0, 110], [0.75, 0.25], { extrapolateRight: 'clamp' });
        const wob = Math.sin((frame + i * 10) / 6) * 30;
        const bouncing = local < 60;
        return (
          <Droplet
            key={i}
            x={d.x + wob}
            y={y}
            scale={scale}
            opacity={opacity}
            arms={local < 40}
            wave={local < 40}
            bounce={bouncing}
            rot={d.rot}
          />
        );
      })}
      <path
        d="M 220 1300 Q 300 900 400 500"
        stroke="#FFF"
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="24 18"
        opacity={interpolate(frame, [10, 30], [0, 0.85], { extrapolateRight: 'clamp' })}
      />
      <path
        d="M 800 1300 Q 750 900 700 500"
        stroke="#FFF"
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="24 18"
        opacity={interpolate(frame, [30, 50], [0, 0.85], { extrapolateRight: 'clamp' })}
      />
      <Label text="EVAPORATION" y={220} frame={frame} startFrame={8} color="#E8A578" />
      <g
        transform="translate(540 1720)"
        opacity={interpolate(frame, [45, 70], [0, 1], { extrapolateRight: 'clamp' })}
      >
        <rect x={-460} y={-45} width={920} height={90} rx={25} fill="#FFF" stroke={INK} strokeWidth={6} opacity={0.95} />
        <text
          x={0}
          y={20}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={700}
          fontSize={44}
          fill={INK}
        >
          Sun heats water → it rises as vapor!
        </text>
      </g>
      <FadeOverlay localFrame={frame} totalFrames={len} />
    </svg>
  );
};

const CondensationScene: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const cloudScale = spring({ frame, fps: FPS, config: { damping: 12, stiffness: 60 } });
  const drops = [
    { fromX: 200, fromY: 1200, delay: 0 },
    { fromX: 900, fromY: 1300, delay: 10 },
    { fromX: 500, fromY: 1500, delay: 20 },
    { fromX: 750, fromY: 1250, delay: 30 },
    { fromX: 300, fromY: 1400, delay: 15 },
    { fromX: 660, fromY: 1450, delay: 40 },
  ];
  const cloudCenter = { x: 540, y: 720 };
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Sky />
      <Sun x={200} y={320} scale={0.7} />
      <Birds y={880} />
      <Hills />
      <Ocean y={1500} />
      <g transform={`translate(${cloudCenter.x} ${cloudCenter.y}) scale(${cloudScale})`}>
        <Cloud x={0} y={0} scale={1.5} eyes smile />
      </g>
      {drops.map((d, i) => {
        const local = Math.max(0, frame - d.delay);
        const t = interpolate(local, [0, 55], [0, 1], { extrapolateRight: 'clamp' });
        const eased = Easing.inOut(Easing.cubic)(t);
        const x = interpolate(eased, [0, 1], [d.fromX, cloudCenter.x + (i - 2.5) * 30]);
        const y = interpolate(eased, [0, 1], [d.fromY, cloudCenter.y - 20]);
        const opacity = interpolate(local, [50, 65], [1, 0], { extrapolateRight: 'clamp' });
        const scale = interpolate(t, [0, 1], [0.55, 0.35]);
        return <Droplet key={i} x={x} y={y} scale={scale} opacity={opacity} arms wave bounce />;
      })}
      <Label text="CONDENSATION" y={280} frame={frame} startFrame={8} color="#B58ACB" />
      <g
        transform="translate(540 1720)"
        opacity={interpolate(frame, [45, 70], [0, 1], { extrapolateRight: 'clamp' })}
      >
        <rect x={-460} y={-45} width={920} height={90} rx={25} fill="#FFF" stroke={INK} strokeWidth={6} opacity={0.95} />
        <text
          x={0}
          y={20}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={700}
          fontSize={44}
          fill={INK}
        >
          Vapor gathers to form a cloud!
        </text>
      </g>
      <FadeOverlay localFrame={frame} totalFrames={len} />
    </svg>
  );
};

const PrecipitationScene: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const rainCount = 26;
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Sky dark />
      <Cloud x={540} y={640} scale={1.6} dark={0.55} eyes frown />
      <Cloud x={200} y={520} scale={1} dark={0.45} />
      <Cloud x={880} y={580} scale={1.1} dark={0.45} />
      <Hills withFlowers={false} />
      <Ocean y={1500} withFish={false} />
      {Array.from({ length: rainCount }).map((_, i) => {
        const startX = 150 + (i % 13) * 60;
        const delay = (i * 3) % 35;
        const local = Math.max(0, frame - delay);
        const cycle = local % 40;
        const y = interpolate(cycle, [0, 40], [740, 1500], { extrapolateRight: 'clamp' });
        const opacity = interpolate(cycle, [0, 5, 35, 40], [0, 1, 1, 0]);
        return (
          <g key={i} transform={`translate(${startX} ${y})`} opacity={opacity}>
            <path
              d="M 0 -20 C 5 -6, 8 6, 0 14 C -8 6, -5 -6, 0 -20 Z"
              fill={RAIN}
              stroke={RAIN_STROKE}
              strokeWidth={2}
            />
          </g>
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const local = frame - i * 5;
        const cycle = (local % 40 + 40) % 40;
        const x = 100 + (i * 130) % 900;
        const y = 1500 + Math.sin(cycle / 6) * 4;
        const r = interpolate(cycle, [0, 30], [4, 40], { extrapolateRight: 'clamp' });
        const op = interpolate(cycle, [0, 5, 30], [0, 0.7, 0], { extrapolateRight: 'clamp' });
        return <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="#FFF" strokeWidth={3} opacity={op} />;
      })}
      <Label text="PRECIPITATION" y={270} frame={frame} startFrame={8} color="#7A8AA6" />
      {[220, 540, 860].map((x, i) => {
        const bolt = Math.floor(frame / 22) % 3 === i;
        return bolt ? (
          <path
            key={i}
            d={`M ${x - 20} 780 L ${x + 10} 820 L ${x - 10} 850 L ${x + 20} 900`}
            stroke={HIGHLIGHT_YELLOW}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            opacity={0.95}
          />
        ) : null;
      })}
      <g
        transform="translate(540 1750)"
        opacity={interpolate(frame, [40, 65], [0, 1], { extrapolateRight: 'clamp' })}
      >
        <rect x={-460} y={-45} width={920} height={90} rx={25} fill="#FFF" stroke={INK} strokeWidth={6} opacity={0.95} />
        <text
          x={0}
          y={20}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={700}
          fontSize={44}
          fill={INK}
        >
          Water falls as rain, snow, or hail!
        </text>
      </g>
      <FadeOverlay localFrame={frame} totalFrames={len} />
    </svg>
  );
};

const CollectionScene: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const drops = [{ delay: 0 }, { delay: 20 }, { delay: 40 }, { delay: 60 }, { delay: 80 }];
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Sky />
      <Sun x={860} y={340} scale={0.8} />
      <Birds y={700} />
      <Cloud x={280} y={520} scale={0.8} />
      <Hills />
      <path
        d="M 500 1330 Q 470 1360 520 1400 Q 490 1440 550 1470 L 640 1500 L 460 1500 Z"
        fill={RAIN}
        stroke={RAIN_STROKE}
        strokeWidth={5}
      />
      <path
        d="M 300 1420 Q 420 1400 500 1450 Q 600 1420 720 1450 Q 820 1470 740 1500 L 280 1500 Z"
        fill={RAIN}
        stroke={RAIN_STROKE}
        strokeWidth={5}
      />
      <path
        d="M 500 1330 Q 470 1360 520 1400 Q 490 1440 550 1470"
        fill="none"
        stroke="#FFF"
        strokeWidth={4}
        opacity={0.7}
      />
      <Ocean y={1500} withFish />
      {drops.map((d, i) => {
        const local = ((frame - d.delay) % 100 + 100) % 100;
        const t = local / 100;
        const y = interpolate(t, [0, 1], [1340, 1520]);
        const x = 510 + Math.sin(t * Math.PI * 3) * 40;
        const opacity = interpolate(t, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
        return <Droplet key={i} x={x} y={y} scale={0.4} opacity={opacity} arms wave bounce />;
      })}
      <Label text="COLLECTION" y={290} frame={frame} startFrame={8} color="#8FB7DA" />
      <g
        transform="translate(540 1750)"
        opacity={interpolate(frame, [40, 65], [0, 1], { extrapolateRight: 'clamp' })}
      >
        <rect x={-460} y={-45} width={920} height={90} rx={25} fill="#FFF" stroke={INK} strokeWidth={6} opacity={0.95} />
        <text
          x={0}
          y={20}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={700}
          fontSize={44}
          fill={INK}
        >
          Rivers and rain flow back to the sea!
        </text>
      </g>
      <FadeOverlay localFrame={frame} totalFrames={len} />
    </svg>
  );
};

const CycleFinaleScene: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const rot = interpolate(frame, [0, 80], [-40, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const scale = spring({ frame, fps: FPS, config: { damping: 8, stiffness: 60 } });
  const w = wiggle(frame, 0.8);
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Defs />
      <Sky />
      <Star x={140} y={180} delay={0} />
      <Star x={950} y={220} delay={10} />
      <Sun x={220} y={340} scale={0.75} />
      <Cloud x={860} y={420} scale={0.9} />
      <Birds y={700} />
      <Hills />
      <Ocean y={1500} />
      <g transform={`translate(${540 + w} 960) rotate(${rot}) scale(${scale})`}>
        <circle r={410} fill="#FFF" opacity={0.15} />
        <circle r={380} fill="none" stroke="#FFF" strokeWidth={22} strokeDasharray="42 26" opacity={0.95} />
        {[0, 120, 240].map((deg) => (
          <g key={deg} transform={`rotate(${deg + frame * 1.5})`}>
            <polygon points="0,-400 44,-352 -44,-352" fill="#FFF" stroke={INK} strokeWidth={4} />
          </g>
        ))}
        <text
          x={0}
          y={-40}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={110}
          fill="#FFF"
          stroke={INK}
          strokeWidth={7}
        >
          Nature's
        </text>
        <text
          x={0}
          y={90}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={120}
          fill={HIGHLIGHT_YELLOW}
          stroke={INK}
          strokeWidth={7}
        >
          Amazing
        </text>
        <text
          x={0}
          y={220}
          textAnchor="middle"
          fontFamily="'Comic Sans MS', sans-serif"
          fontWeight={900}
          fontSize={110}
          fill="#FFF"
          stroke={INK}
          strokeWidth={7}
        >
          Cycle!
        </text>
      </g>
      <Droplet x={220} y={1370} scale={0.75} arms wave bounce />
      <Droplet x={860} y={1360} scale={0.75} arms wave bounce rot={-5} />
      <FadeOverlay localFrame={frame} totalFrames={len} />
    </svg>
  );
};

// -------------------- ROOT COMPOSITION --------------------

const TITLE_LEN = 130;
const EVAP_LEN = 140;
const COND_LEN = 130;
const PRECIP_LEN = 150;
const COLL_LEN = 110;
const FINALE_LEN = 90;

export const TOTAL_FRAMES =
  TITLE_LEN + EVAP_LEN + COND_LEN + PRECIP_LEN + COLL_LEN + FINALE_LEN; // 750 = 25s

export const WaterCycle: React.FC = () => {
  const { width, height } = useVideoConfig();
  let from = 0;
  const push = (len: number) => {
    const v = from;
    from += len;
    return v;
  };
  return (
    <AbsoluteFill style={{ width, height, background: SKY_TOP }}>
      <Sequence from={push(TITLE_LEN)} durationInFrames={TITLE_LEN} name="Title">
        <TitleScene len={TITLE_LEN} />
      </Sequence>
      <Sequence from={push(EVAP_LEN)} durationInFrames={EVAP_LEN} name="Evaporation">
        <EvaporationScene len={EVAP_LEN} />
      </Sequence>
      <Sequence from={push(COND_LEN)} durationInFrames={COND_LEN} name="Condensation">
        <CondensationScene len={COND_LEN} />
      </Sequence>
      <Sequence from={push(PRECIP_LEN)} durationInFrames={PRECIP_LEN} name="Precipitation">
        <PrecipitationScene len={PRECIP_LEN} />
      </Sequence>
      <Sequence from={push(COLL_LEN)} durationInFrames={COLL_LEN} name="Collection">
        <CollectionScene len={COLL_LEN} />
      </Sequence>
      <Sequence from={push(FINALE_LEN)} durationInFrames={FINALE_LEN} name="Finale">
        <CycleFinaleScene len={FINALE_LEN} />
      </Sequence>
    </AbsoluteFill>
  );
};
