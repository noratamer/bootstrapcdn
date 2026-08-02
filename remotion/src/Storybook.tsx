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

// -------------------- STORYBOOK PASTEL PALETTE --------------------
const PAPER_LIGHT = '#FFF6E8';
const PAPER_CREAM = '#FBEBCF';
const INK = '#3F2A15';
const INK_SOFT = '#6B5236';
const GOLD = '#D4A857';
const GOLD_SOFT = '#EFCB8A';
const SKY_PINK = '#FFDCE7';
const SKY_BLUE = '#CFE7F5';
const SKY_LAVENDER = '#E4D6F0';
const SEA_LIGHT = '#B5D5EA';
const SEA_DARK = '#7FA6C5';
const GRASS_LIGHT = '#C6E3C7';
const GRASS_DARK = '#95C6A0';
const CLOUD_DARK_BG = '#B5B0CB';

const STORYBOOK_FONT =
  "'Kalam', 'Patrick Hand', Georgia, 'Book Antiqua', Palatino, 'Comic Sans MS', serif";

// -------------------- HELPERS --------------------
const useLocal = (from = 0) => useCurrentFrame() - from;

const fadeIn = (frame: number, len = 15) =>
  interpolate(frame, [0, len], [0, 1], { extrapolateRight: 'clamp' });

const fadeOut = (frame: number, total: number, len = 15) =>
  interpolate(frame, [total - len, total], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// -------------------- BOOK FRAME (paper page + gold border) --------------------
const BookFrame: React.FC<{
  children: React.ReactNode;
  pageNum: number;
  totalFrames: number;
  bg?: string;
}> = ({ children, pageNum, totalFrames, bg = PAPER_LIGHT }) => {
  const frame = useCurrentFrame();
  const turnIn = interpolate(frame, [0, 18], [1, 0], { extrapolateRight: 'clamp' });
  const turnOut = interpolate(frame, [totalFrames - 18, totalFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pageOverlay = Math.max(turnIn, turnOut);
  const skewOut = interpolate(frame, [totalFrames - 18, totalFrames], [0, -6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        background: '#2E1E10',
        fontFamily: STORYBOOK_FONT,
      }}
    >
      {/* the physical book page */}
      <div
        style={{
          position: 'absolute',
          inset: 40,
          borderRadius: 48,
          background: bg,
          overflow: 'hidden',
          boxShadow:
            '0 40px 80px rgba(0,0,0,0.35), inset 0 0 140px rgba(212,168,87,0.20)',
          transform: `perspective(2400px) rotateY(${skewOut}deg)`,
          transformOrigin: 'left center',
        }}
      >
        {/* gold double border */}
        <div
          style={{
            position: 'absolute',
            inset: 26,
            borderRadius: 32,
            border: `10px double ${GOLD}`,
            pointerEvents: 'none',
            zIndex: 60,
          }}
        />
        {/* subtle paper grain */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(1200px 700px at 20% 15%, rgba(255,255,255,0.35), transparent 55%), radial-gradient(900px 900px at 85% 90%, rgba(212,168,87,0.18), transparent 60%)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
        {/* page number */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 70,
            fontFamily: STORYBOOK_FONT,
            fontSize: 34,
            color: INK_SOFT,
            fontStyle: 'italic',
            zIndex: 55,
          }}
        >
          — {pageNum} —
        </div>
        {children}
        {/* page-turn overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              turnOut > 0
                ? `linear-gradient(90deg, rgba(0,0,0,0.4), rgba(255,255,255,0.15) 60%, transparent)`
                : `linear-gradient(270deg, rgba(0,0,0,0.4), rgba(255,255,255,0.15) 60%, transparent)`,
            opacity: pageOverlay,
            pointerEvents: 'none',
            zIndex: 70,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// -------------------- NARRATION BOX --------------------
const Narration: React.FC<{
  children: React.ReactNode;
  entryFrame?: number;
  fontSize?: number;
  bottom?: number;
  height?: number;
  italic?: boolean;
  align?: 'center' | 'left';
  color?: string;
}> = ({
  children,
  entryFrame = 0,
  fontSize = 46,
  bottom = 130,
  height = 520,
  italic = false,
  align = 'center',
  color = INK,
}) => {
  const local = useLocal(entryFrame);
  const opacity = fadeIn(local, 22);
  const rise = interpolate(local, [0, 22], [30, 0], { extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 90,
        right: 90,
        height,
        padding: '46px 52px',
        background: 'rgba(255, 246, 232, 0.92)',
        border: `4px solid ${GOLD_SOFT}`,
        borderRadius: 36,
        boxShadow: '0 12px 30px rgba(72, 44, 12, 0.2)',
        color,
        fontSize,
        lineHeight: 1.45,
        fontFamily: STORYBOOK_FONT,
        textAlign: align,
        opacity,
        transform: `translateY(${rise}px)`,
        zIndex: 40,
        fontStyle: italic ? 'italic' : 'normal',
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      <div>{children}</div>
    </div>
  );
};

// -------------------- REUSABLE CSS "ILLUSTRATION" BITS --------------------
const Emoji: React.FC<{
  char: string;
  x: number;
  y: number;
  size: number;
  rot?: number;
  bob?: boolean;
  shadow?: boolean;
  opacity?: number;
  extraStyle?: React.CSSProperties;
}> = ({ char, x, y, size, rot = 0, bob = false, shadow = true, opacity = 1, extraStyle }) => {
  const frame = useCurrentFrame();
  const b = bob ? Math.sin(frame / 8) * 8 : 0;
  const wobble = bob ? Math.sin(frame / 10) * 2 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + b,
        fontSize: size,
        transform: `translate(-50%, -50%) rotate(${rot + wobble}deg)`,
        filter: shadow ? 'drop-shadow(0 6px 6px rgba(0,0,0,0.18))' : 'none',
        opacity,
        lineHeight: 1,
        userSelect: 'none',
        ...extraStyle,
      }}
    >
      {char}
    </div>
  );
};

const SoftDisc: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  blur?: number;
  opacity?: number;
}> = ({ x, y, size, color, blur = 40, opacity = 0.9 }) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      background: color,
      borderRadius: '50%',
      filter: `blur(${blur}px)`,
      opacity,
    }}
  />
);

const HillsCSS: React.FC<{ palette?: 'green' | 'muted' | 'sunset' }> = ({ palette = 'green' }) => {
  const g1 =
    palette === 'muted'
      ? ['#B7C4B0', '#94A88E']
      : palette === 'sunset'
        ? ['#E9BFAF', '#C29689']
        : [GRASS_LIGHT, GRASS_DARK];
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: -100,
          right: -100,
          bottom: 240,
          height: 380,
          background: g1[0],
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          filter: 'blur(0.6px)',
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -300,
          right: -100,
          bottom: 180,
          height: 320,
          background: g1[1],
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -100,
          right: -300,
          bottom: 120,
          height: 260,
          background: g1[1],
          filter: 'brightness(0.94)',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          zIndex: 6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 140,
          background: `linear-gradient(180deg, ${g1[1]} 0%, #7DB08A 100%)`,
          zIndex: 7,
        }}
      />
    </>
  );
};

const CloudCSS: React.FC<{
  x: number;
  y: number;
  scale?: number;
  dark?: boolean;
  opacity?: number;
}> = ({ x, y, scale = 1, dark = false, opacity = 1 }) => {
  const c = dark ? CLOUD_DARK_BG : '#FFFCF6';
  const s = dark ? '#8F8AA6' : '#EBE1D0';
  const size = 220 * scale;
  const puff = (dx: number, dy: number, r: number) => (
    <div
      style={{
        position: 'absolute',
        left: x + dx - r / 2,
        top: y + dy - r / 2,
        width: r,
        height: r,
        background: c,
        borderRadius: '50%',
        boxShadow: `inset -14px -8px 0 ${s}`,
        opacity,
      }}
    />
  );
  return (
    <>
      {puff(-size * 0.55, size * 0.15, size * 0.75)}
      {puff(0, -size * 0.15, size)}
      {puff(size * 0.55, size * 0.15, size * 0.75)}
      {puff(-size * 0.25, size * 0.3, size * 0.7)}
      {puff(size * 0.3, size * 0.3, size * 0.7)}
    </>
  );
};

const SunCSS: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
  glow?: string;
}> = ({ x, y, size = 260, color = '#FFE7A3', glow = '#FFF3D0' }) => {
  const frame = useCurrentFrame();
  const rot = frame * 0.5;
  return (
    <>
      <SoftDisc x={x} y={y} size={size * 2.2} color={glow} blur={60} opacity={0.55} />
      <div
        style={{
          position: 'absolute',
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          background: color,
          borderRadius: '50%',
          border: `6px solid ${GOLD_SOFT}`,
          boxShadow: `inset -20px -20px 0 rgba(212,168,87,0.25), 0 12px 30px rgba(212,168,87,0.35)`,
          zIndex: 5,
        }}
      />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * 360 + rot;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 18,
              height: size * 0.55,
              background: color,
              borderRadius: 8,
              transform: `translate(-50%, -100%) rotate(${a}deg) translateY(-${size / 2 + 12}px)`,
              transformOrigin: '50% 100%',
              opacity: 0.85,
              zIndex: 4,
            }}
          />
        );
      })}
    </>
  );
};

const WavesCSS: React.FC<{ bottom: number; color1: string; color2: string }> = ({
  bottom,
  color1,
  color2,
}) => {
  const frame = useCurrentFrame();
  const w1 = Math.sin(frame / 12) * 20;
  const w2 = Math.sin(frame / 10 + 1) * 16;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: bottom + 260,
          background: `linear-gradient(180deg, ${color1} 0%, ${color2} 100%)`,
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -60 + w1,
          right: -60,
          bottom: bottom + 210,
          height: 120,
          background: color1,
          filter: 'brightness(1.08)',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          opacity: 0.85,
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -100 - w2,
          right: -100 + w2,
          bottom: bottom + 160,
          height: 100,
          background: color2,
          filter: 'brightness(1.1)',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          opacity: 0.8,
          zIndex: 4,
        }}
      />
    </>
  );
};

const Sparkles: React.FC<{ count?: number; seed?: number }> = ({ count = 14, seed = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const s = (i * 137 + seed * 37) % 1000;
        const x = 60 + (s % 950);
        const y = 60 + ((s * 3) % 1500);
        const size = 18 + ((s * 7) % 22);
        const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin((frame + i * 8) / 10));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              transform: `translate(-50%,-50%) rotate(${(s * 13) % 360}deg)`,
              opacity: pulse * 0.9,
              filter: 'drop-shadow(0 0 6px rgba(212,168,87,0.6))',
              color: GOLD,
              fontSize: size,
              lineHeight: 1,
              zIndex: 20,
            }}
          >
            ✦
          </div>
        );
      })}
    </>
  );
};

// -------------------- PAGES --------------------

const P1_Title: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const titleScale = spring({ frame: frame - 10, fps: FPS, config: { damping: 8, stiffness: 100 } });
  const subOpacity = fadeIn(frame - 45, 22);
  const bob = Math.sin(frame / 10) * 8;
  return (
    <BookFrame pageNum={1} totalFrames={total} bg={PAPER_LIGHT}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(700px 500px at 50% 30%, ${SKY_PINK}55, transparent 60%), radial-gradient(600px 500px at 50% 75%, ${SKY_BLUE}77, transparent 60%)`,
          zIndex: 1,
        }}
      />
      <Sparkles count={22} seed={1} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 260,
          textAlign: 'center',
          transform: `scale(${titleScale})`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: STORYBOOK_FONT,
            fontSize: 68,
            color: INK_SOFT,
            fontStyle: 'italic',
            marginBottom: 8,
          }}
        >
          Once upon a time...
        </div>
        <div
          style={{
            fontFamily: STORYBOOK_FONT,
            fontSize: 118,
            color: INK,
            fontWeight: 900,
            lineHeight: 1.05,
            textShadow: '4px 6px 0 rgba(212,168,87,0.5)',
          }}
        >
          The Little
          <br />
          Droplet
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: STORYBOOK_FONT,
            fontSize: 56,
            color: '#5A8AB5',
            fontStyle: 'italic',
          }}
        >
          ~ A Water Cycle Story ~
        </div>
      </div>
      <div style={{ position: 'absolute', left: 540, top: 1100 + bob, zIndex: 15 }}>
        <Emoji char="💧" x={0} y={0} size={280} bob />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 52,
          color: INK_SOFT,
          fontStyle: 'italic',
          opacity: subOpacity,
          fontFamily: STORYBOOK_FONT,
          zIndex: 20,
        }}
      >
        ✿ for curious little minds ✿
      </div>
    </BookFrame>
  );
};

const P2_Sea: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <BookFrame pageNum={2} totalFrames={total}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${SKY_PINK} 0%, ${SKY_BLUE} 55%, ${SEA_LIGHT} 55%, ${SEA_DARK} 100%)`,
          zIndex: 1,
        }}
      />
      <SunCSS x={880} y={280} size={180} />
      <CloudCSS x={220} y={340} scale={0.7} />
      <WavesCSS bottom={40} color1={SEA_LIGHT} color2={SEA_DARK} />
      <Emoji char="🐠" x={230 + ((frame * 3) % 900)} y={880} size={72} rot={5} shadow />
      <Emoji char="🐟" x={880 - ((frame * 2) % 900)} y={980} size={64} rot={-6} shadow />
      <Emoji char="🐡" x={720} y={1060} size={70} shadow />
      <Emoji char="🪸" x={200} y={1120} size={82} shadow />
      <Emoji char="🪸" x={880} y={1140} size={78} shadow />
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 880 + Math.sin(frame / 10) * 12,
          transform: 'translate(-50%,-50%)',
          zIndex: 20,
        }}
      >
        <Emoji char="💧" x={0} y={0} size={200} rot={-4} shadow bob />
      </div>
      <Narration entryFrame={12} fontSize={44}>
        Deep in the sparkling blue sea lived a tiny water droplet named{' '}
        <b style={{ color: '#3C7DB8' }}>Drippy</b>. She loved to play with the fish 🐠 and dance
        with the waves. 🌊
      </Narration>
    </BookFrame>
  );
};

const P3_SunWakes: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const sunY = interpolate(frame, [0, 50], [700, 380], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <BookFrame pageNum={3} totalFrames={total}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${SKY_PINK} 0%, #FFE8C4 40%, ${SEA_LIGHT} 55%, ${SEA_DARK} 100%)`,
          zIndex: 1,
        }}
      />
      <SunCSS x={540} y={sunY} size={340} color="#FFDF88" glow="#FFEEB0" />
      <Sparkles count={18} seed={3} />
      <WavesCSS bottom={40} color1={SEA_LIGHT} color2={SEA_DARK} />
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 940 + Math.sin(frame / 8) * 6,
          transform: 'translate(-50%,-50%)',
          zIndex: 20,
        }}
      >
        <Emoji char="💧" x={0} y={0} size={210} bob />
      </div>
      <Narration entryFrame={12} fontSize={44}>
        One warm morning, the friendly sun ☀️ shined so brightly that Drippy felt something{' '}
        <i>magical</i> happening. She was getting lighter... and lighter...
      </Narration>
    </BookFrame>
  );
};

const P4_Evaporation: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const drops = [
    { x: 300, delay: 0 },
    { x: 540, delay: 20 },
    { x: 780, delay: 10 },
    { x: 420, delay: 40 },
    { x: 660, delay: 55 },
    { x: 200, delay: 70 },
    { x: 880, delay: 30 },
  ];
  return (
    <BookFrame pageNum={4} totalFrames={total}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${SKY_PINK} 0%, ${SKY_BLUE} 60%, ${SEA_LIGHT} 75%, ${SEA_DARK} 100%)`,
          zIndex: 1,
        }}
      />
      <SunCSS x={840} y={340} size={220} />
      <WavesCSS bottom={40} color1={SEA_LIGHT} color2={SEA_DARK} />
      {drops.map((d, i) => {
        const local = Math.max(0, frame - d.delay);
        const y = interpolate(local, [0, 130], [1180, 400], { extrapolateRight: 'clamp' });
        const scale = interpolate(local, [0, 130], [1, 0.35]);
        const opacity = interpolate(local, [0, 15, 110, 130], [0, 1, 1, 0]);
        const wob = Math.sin((frame + i * 12) / 7) * 26;
        return (
          <Emoji
            key={i}
            char="💧"
            x={d.x + wob}
            y={y}
            size={130 * scale}
            opacity={opacity}
            bob
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 90,
          right: 90,
          textAlign: 'center',
          fontFamily: STORYBOOK_FONT,
          fontSize: 90,
          color: '#C97545',
          fontWeight: 900,
          letterSpacing: 4,
          textShadow: '3px 4px 0 rgba(255,255,255,0.7)',
          zIndex: 30,
          opacity: fadeIn(frame - 10, 20),
        }}
      >
        ✧ Evaporation ✧
      </div>
      <Narration entryFrame={30} fontSize={42} bottom={90} height={520}>
        <i>"Wheeee!"</i> laughed Drippy as she floated up, up, <b>UP!</b> When water warms up, it
        turns into invisible mist and rises into the sky.
        <br />
        <br />
        This is called <b style={{ color: '#C97545' }}>EVAPORATION</b>.
      </Narration>
    </BookFrame>
  );
};

const P5_Meeting: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const cx = 540;
  const cy = 640;
  const dots = [
    { fromX: 120, fromY: 300, delay: 0 },
    { fromX: 960, fromY: 350, delay: 10 },
    { fromX: 220, fromY: 900, delay: 20 },
    { fromX: 900, fromY: 950, delay: 30 },
    { fromX: 540, fromY: 1080, delay: 40 },
    { fromX: 380, fromY: 200, delay: 50 },
    { fromX: 720, fromY: 220, delay: 60 },
  ];
  return (
    <BookFrame pageNum={5} totalFrames={total}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${SKY_LAVENDER} 0%, ${SKY_BLUE} 70%, ${GRASS_LIGHT} 100%)`,
          zIndex: 1,
        }}
      />
      <SunCSS x={180} y={280} size={170} />
      <Sparkles count={16} seed={5} />
      <HillsCSS palette="muted" />
      {dots.map((d, i) => {
        const local = Math.max(0, frame - d.delay);
        const t = interpolate(local, [0, 65], [0, 1], { extrapolateRight: 'clamp' });
        const eased = Easing.inOut(Easing.cubic)(t);
        const x = interpolate(eased, [0, 1], [d.fromX, cx + (i - 3) * 24]);
        const y = interpolate(eased, [0, 1], [d.fromY, cy - 20]);
        const opacity = interpolate(local, [60, 80], [1, 0], { extrapolateRight: 'clamp' });
        return <Emoji key={i} char="💧" x={x} y={y} size={95} opacity={opacity} shadow bob />;
      })}
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: cy,
          transform: 'translate(-50%,-50%)',
          opacity: interpolate(frame, [55, 95], [0, 1], { extrapolateRight: 'clamp' }),
          zIndex: 15,
        }}
      >
        <CloudCSS x={0} y={0} scale={1.6} />
        <Emoji char="😊" x={-30} y={-10} size={54} shadow={false} />
      </div>
      <Narration entryFrame={95} fontSize={42} bottom={90} height={520}>
        High above the world, Drippy met her old friends. They all hugged each other tightly to
        keep warm.
        <br />
        <br />
        Together, they became a soft, fluffy <b>cloud</b> ☁️
      </Narration>
    </BookFrame>
  );
};

const P6_Condensation: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <BookFrame pageNum={6} totalFrames={total}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${SKY_LAVENDER} 0%, ${SKY_BLUE} 100%)`,
          zIndex: 1,
        }}
      />
      <SunCSS x={880} y={240} size={160} />
      <Sparkles count={20} seed={6} />
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 680 + Math.sin(frame / 12) * 10,
          transform: 'translate(-50%,-50%)',
          zIndex: 12,
        }}
      >
        <CloudCSS x={0} y={0} scale={1.9} />
      </div>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 130 + (i % 3) * 20;
        const x = 540 + Math.cos(angle) * r;
        const y = 680 + Math.sin(angle) * r * 0.6;
        return (
          <Emoji
            key={i}
            char="💧"
            x={x}
            y={y}
            size={60}
            opacity={0.85}
            shadow={false}
            extraStyle={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))' }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 90,
          right: 90,
          textAlign: 'center',
          fontFamily: STORYBOOK_FONT,
          fontSize: 90,
          color: '#7F5EA8',
          fontWeight: 900,
          letterSpacing: 4,
          textShadow: '3px 4px 0 rgba(255,255,255,0.7)',
          zIndex: 30,
          opacity: fadeIn(frame - 10, 20),
        }}
      >
        ✧ Condensation ✧
      </div>
      <Narration entryFrame={30} fontSize={42} bottom={90} height={520}>
        This is called <b style={{ color: '#7F5EA8' }}>CONDENSATION</b>!
        <br />
        <br />
        Millions and millions of tiny droplets holding hands together make the fluffy clouds you
        see up in the sky.
      </Narration>
    </BookFrame>
  );
};

const P7_Heavy: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const darken = interpolate(frame, [0, 90], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <BookFrame pageNum={7} totalFrames={total}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${SKY_LAVENDER} 0%, #C4CBDD ${
            30 + darken * 30
          }%, #A9B4CC 100%)`,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 700 + Math.sin(frame / 12) * 8,
          transform: 'translate(-50%,-50%)',
          zIndex: 10,
        }}
      >
        <CloudCSS x={0} y={0} scale={2.1} dark={darken > 0.4} />
      </div>
      {Array.from({ length: 20 }).map((_, i) => {
        const local = Math.max(0, frame - i * 4);
        const x = 200 + (i * 47) % 700;
        const y = 300 + Math.sin(frame / 8 + i) * 40;
        const t = Math.min(1, local / 60);
        return (
          <Emoji
            key={i}
            char="💧"
            x={x}
            y={y}
            size={30 + t * 20}
            opacity={t * 0.9}
            shadow={false}
          />
        );
      })}
      <Narration entryFrame={20} fontSize={44} bottom={110} height={520}>
        As more and more friends joined, the cloud grew bigger... and darker... and{' '}
        <b>HEAVIER</b>.
        <br />
        <br />
        Drippy could barely hold on any longer...
      </Narration>
    </BookFrame>
  );
};

const P8_Precipitation: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const rainCount = 26;
  return (
    <BookFrame pageNum={8} totalFrames={total}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, #9AA4BE 0%, #B5C0D3 100%)`,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 480,
          transform: 'translate(-50%,-50%)',
          zIndex: 10,
        }}
      >
        <CloudCSS x={0} y={0} scale={2.4} dark />
        <Emoji char="😮" x={-40} y={-30} size={60} shadow={false} />
      </div>
      <CloudCSS x={220} y={360} scale={1.1} dark />
      <CloudCSS x={860} y={420} scale={1.2} dark />
      <HillsCSS palette="muted" />
      {Array.from({ length: rainCount }).map((_, i) => {
        const startX = 160 + (i % 13) * 60;
        const delay = (i * 3) % 30;
        const local = Math.max(0, frame - delay);
        const cycle = local % 38;
        const y = interpolate(cycle, [0, 38], [560, 1300], { extrapolateRight: 'clamp' });
        const opacity = interpolate(cycle, [0, 5, 33, 38], [0, 1, 1, 0]);
        return <Emoji key={i} char="💧" x={startX} y={y} size={38} opacity={opacity} shadow={false} />;
      })}
      {[240, 540, 840].map((x, i) => {
        const local = frame - i * 12;
        const blink = local > 0 && local % 55 < 8;
        return blink ? (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - 20,
              top: 600,
              fontSize: 90,
              filter: 'drop-shadow(0 0 12px #FFF3C4)',
              zIndex: 12,
            }}
          >
            ⚡
          </div>
        ) : null;
      })}
      <div
        style={{
          position: 'absolute',
          top: 190,
          left: 90,
          right: 90,
          textAlign: 'center',
          fontFamily: STORYBOOK_FONT,
          fontSize: 90,
          color: '#455A78',
          fontWeight: 900,
          letterSpacing: 4,
          textShadow: '3px 4px 0 rgba(255,255,255,0.75)',
          zIndex: 30,
          opacity: fadeIn(frame - 10, 20),
        }}
      >
        ✧ Precipitation ✧
      </div>
      <Narration entryFrame={30} fontSize={42} bottom={90} height={520}>
        <i>"Wheeeeee!"</i> shouted the droplets as they tumbled down to Earth as{' '}
        <b style={{ color: '#455A78' }}>RAIN</b>! ☔
        <br />
        <br />
        Some fell as snowflakes ❄️, some as tiny hailstones. This is called{' '}
        <b>PRECIPITATION</b>!
      </Narration>
    </BookFrame>
  );
};

const P9_Landing: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <BookFrame pageNum={9} totalFrames={total}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${SKY_BLUE} 0%, #DBEFEA 40%, ${GRASS_LIGHT} 65%, ${GRASS_DARK} 100%)`,
          zIndex: 1,
        }}
      />
      <SunCSS x={880} y={280} size={180} />
      <CloudCSS x={220} y={340} scale={0.9} />
      <HillsCSS />
      {/* stream */}
      <div
        style={{
          position: 'absolute',
          left: 380,
          top: 900,
          width: 380,
          height: 640,
          background: `linear-gradient(180deg, ${SEA_LIGHT} 0%, ${SEA_DARK} 100%)`,
          borderRadius: 200,
          transform: 'rotate(-6deg) skewX(-4deg)',
          boxShadow: 'inset 0 0 30px rgba(255,255,255,0.35)',
          zIndex: 6,
        }}
      />
      <Emoji char="🌸" x={180} y={1200} size={72} />
      <Emoji char="🌼" x={880} y={1220} size={78} />
      <Emoji char="🌸" x={280} y={1360} size={72} />
      <Emoji char="🌼" x={780} y={1360} size={78} />
      <Emoji char="🌳" x={140} y={1050} size={110} shadow />
      <Emoji char="🌳" x={960} y={1070} size={110} shadow />
      <Emoji char="🦋" x={200 + ((frame * 3) % 700)} y={780 + Math.sin(frame / 5) * 15} size={70} />
      <Emoji char="💧" x={540} y={950 + Math.sin(frame / 6) * 10} size={140} bob />
      <Narration entryFrame={12} fontSize={44} bottom={90} height={520}>
        Drippy landed with a happy <b>splash</b> on a green mountain 🏔️. She rolled down, down,
        into a bubbling stream and joined a rushing river! 🏞️
      </Narration>
    </BookFrame>
  );
};

const P10_Collection: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <BookFrame pageNum={10} totalFrames={total}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${SKY_PINK} 0%, ${SKY_BLUE} 45%, ${SEA_LIGHT} 55%, ${SEA_DARK} 100%)`,
          zIndex: 1,
        }}
      />
      <SunCSS x={880} y={300} size={180} />
      <CloudCSS x={220} y={340} scale={0.9} />
      {/* river ribbons */}
      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 780,
          width: 720,
          height: 100,
          background: `linear-gradient(90deg, ${SEA_LIGHT}, ${SEA_DARK})`,
          borderRadius: 100,
          transform: 'rotate(-8deg)',
          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.35)',
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 900,
          width: 620,
          height: 80,
          background: `linear-gradient(90deg, ${SEA_LIGHT}, ${SEA_DARK})`,
          borderRadius: 100,
          transform: 'rotate(4deg)',
          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.35)',
          zIndex: 5,
        }}
      />
      <WavesCSS bottom={40} color1={SEA_LIGHT} color2={SEA_DARK} />
      <Emoji char="🐟" x={880 - ((frame * 2) % 800)} y={1180} size={64} rot={-6} />
      <Emoji char="🐠" x={200 + ((frame * 3) % 800)} y={1240} size={68} rot={4} />
      <Emoji
        char="💧"
        x={230 + interpolate(frame, [0, 250], [0, 700], { extrapolateRight: 'clamp' })}
        y={870 + Math.sin(frame / 5) * 8}
        size={110}
        rot={-8}
        bob
      />
      <div
        style={{
          position: 'absolute',
          top: 210,
          left: 90,
          right: 90,
          textAlign: 'center',
          fontFamily: STORYBOOK_FONT,
          fontSize: 90,
          color: '#3F79B0',
          fontWeight: 900,
          letterSpacing: 4,
          textShadow: '3px 4px 0 rgba(255,255,255,0.7)',
          zIndex: 30,
          opacity: fadeIn(frame - 10, 20),
        }}
      >
        ✧ Collection ✧
      </div>
      <Narration entryFrame={30} fontSize={42} bottom={90} height={520}>
        The river carried Drippy all the way back to the sparkling blue sea, where her adventure
        first began.
        <br />
        <br />
        This is called <b style={{ color: '#3F79B0' }}>COLLECTION</b>. 🌊
      </Narration>
    </BookFrame>
  );
};

const P11_Cycle: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const rot = interpolate(frame, [0, 200], [0, 360], { extrapolateRight: 'clamp' });
  const items = ['☀️', '💧', '☁️', '🌧️', '🌊'];
  return (
    <BookFrame pageNum={11} totalFrames={total}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(700px 600px at 50% 40%, ${SKY_PINK}88, transparent 65%), linear-gradient(180deg, ${SKY_LAVENDER} 0%, ${SKY_BLUE} 100%)`,
          zIndex: 1,
        }}
      />
      <Sparkles count={30} seed={11} />
      {/* rotating cycle wheel */}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 780,
          width: 700,
          height: 700,
          transform: `translate(-50%, -50%) rotate(${rot}deg)`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 20,
            borderRadius: '50%',
            border: `10px dashed ${GOLD}`,
            opacity: 0.85,
          }}
        />
        {items.map((c, i) => {
          const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
          const x = 350 + Math.cos(a) * 300;
          const y = 350 + Math.sin(a) * 300;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                fontSize: 120,
                transform: `translate(-50%, -50%) rotate(${-rot}deg)`,
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
              }}
            >
              {c}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: STORYBOOK_FONT,
          fontSize: 76,
          color: INK,
          fontStyle: 'italic',
          textShadow: '3px 4px 0 rgba(212,168,87,0.4)',
          zIndex: 30,
        }}
      >
        But this isn't really <br />
        <b>THE END...</b>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 260,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: STORYBOOK_FONT,
          fontSize: 54,
          color: INK,
          padding: '0 90px',
          opacity: fadeIn(frame - 120, 25),
          zIndex: 30,
        }}
      >
        Because tomorrow, when the sun shines again... Drippy will start her magical journey{' '}
        <b>all over again.</b>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: STORYBOOK_FONT,
          fontSize: 88,
          color: GOLD,
          fontWeight: 900,
          letterSpacing: 6,
          textShadow: '3px 4px 0 rgba(255,255,255,0.7)',
          opacity: fadeIn(frame - 260, 30),
          zIndex: 40,
        }}
      >
        🌈 The End 🌈
      </div>
    </BookFrame>
  );
};

// -------------------- COMPOSITION --------------------

const PAGES: Array<{ len: number; C: React.FC<{ total: number }> }> = [
  { len: 240, C: P1_Title },
  { len: 330, C: P2_Sea },
  { len: 300, C: P3_SunWakes },
  { len: 360, C: P4_Evaporation },
  { len: 320, C: P5_Meeting },
  { len: 300, C: P6_Condensation },
  { len: 280, C: P7_Heavy },
  { len: 360, C: P8_Precipitation },
  { len: 300, C: P9_Landing },
  { len: 320, C: P10_Collection },
  { len: 490, C: P11_Cycle },
];

export const STORYBOOK_FRAMES = PAGES.reduce((a, p) => a + p.len, 0); // 3600 = 120s

export const Storybook: React.FC = () => {
  const { width, height } = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill style={{ width, height, background: '#2E1E10' }}>
      {PAGES.map((p, i) => {
        const start = from;
        from += p.len;
        const C = p.C;
        return (
          <Sequence key={i} from={start} durationInFrames={p.len} name={`Page ${i + 1}`}>
            <C total={p.len} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
