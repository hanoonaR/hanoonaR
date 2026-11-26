const {
  useComposition,
  CompositionStage,
  Easing,
  clamp
} = window;
const W = 1600,
  H = 640;
const SANS = '"IBM Plex Sans", system-ui, sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, monospace';
const THEMES = {
  light: {
    bg: '#f4f2ed',
    ink: '#1b1a18',
    muted: '#5c5952',
    accent: '#c4561f',
    panel: '#ffffff',
    bubble: '#e6e2d9',
    line: '#3a3833',
    box: '#d9dcf5',
    box2: '#cfe0ef',
    llm: '#f6c9a6'
  },
  dark: {
    bg: '#141413',
    ink: '#f2f0ea',
    muted: '#b3afa6',
    accent: '#f0915a',
    panel: '#22211f',
    bubble: '#2f2d2a',
    line: '#cfcac0',
    box: '#3a3d5e',
    box2: '#2f4558',
    llm: '#7a4a2a'
  }
};
const MOTION = {
  enter: (T, s, d = 0.6) => Easing.easeOutCubic(clamp((T - s) / d, 0, 1)),
  glide: (T, s, d = 0.9) => Easing.easeInOutCubic(clamp((T - s) / d, 0, 1)),
  pop: (T, s, d = 0.55) => Easing.easeOutBack(clamp((T - s) / d, 0, 1))
};
const lerp = (a, b, p) => a + (b - a) * p;
const win = (T, a, b, fi = 0.5, fo = 0.4) => Math.min(MOTION.enter(T, a, fi), 1 - MOTION.glide(T, b - fo, fo));
function keys(T, times, vals) {
  if (T <= times[0]) return vals[0];
  for (let i = 1; i < times.length; i++) if (T <= times[i]) return lerp(vals[i - 1], vals[i], MOTION.glide(T, times[i - 1], times[i] - times[i - 1]));
  return vals[vals.length - 1];
}
const popStyle = (p, dy = 24) => ({
  opacity: clamp(p, 0, 1),
  transform: `translateY(${(1 - p) * dy}px) scale(${lerp(0.92, 1, p)})`
});
function Pic({
  src,
  w,
  h,
  z = 1,
  pos = 'center',
  radius = 10,
  shadow = true
}) {
  return React.createElement("div", {
    style: {
      position: 'relative',
      width: w,
      height: h,
      overflow: 'hidden',
      borderRadius: radius,
      background: '#ddd',
      boxShadow: shadow ? '0 18px 44px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.08)' : 'none'
    }
  }, React.createElement("img", {
    src: src,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: pos,
      transform: `scale(${z})`,
      display: 'block'
    }
  }));
}
function Wipe({
  a,
  b,
  w,
  h,
  p,
  z = 1,
  P,
  radius = 10
}) {
  const x = p * w;
  return React.createElement("div", {
    style: {
      position: 'relative',
      width: w,
      height: h,
      overflow: 'hidden',
      borderRadius: radius,
      background: '#ddd',
      boxShadow: '0 18px 44px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.08)'
    }
  }, React.createElement("img", {
    src: a,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: `scale(${z})`
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`
    }
  }, React.createElement("img", {
    src: b,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: `scale(${z})`
    }
  })), p > 0 && p < 1 && React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: x - 2,
      width: 4,
      background: P.accent,
      boxShadow: `0 0 24px 6px ${P.accent}`
    }
  }));
}
function typedSegs(segs, n, T, tEnd) {
  let used = 0;
  return segs.map(([txt, col], i) => {
    const show = txt.slice(0, clamp(n - used, 0, txt.length));
    const done = n >= used + txt.length;
    used += txt.length;
    return React.createElement("span", {
      key: i,
      style: {
        whiteSpace: 'pre-wrap',
        borderRadius: 4,
        backgroundImage: col && done ? `linear-gradient(${col}, ${col})` : 'none',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      }
    }, show, React.createElement("span", {
      style: {
        opacity: 0
      }
    }, txt.slice(show.length)));
  });
}
const segLen = segs => segs.reduce((a, s) => a + s[0].length, 0);
const charsAt = (T, start, cps) => Math.max(0, Math.floor((T - start) * cps));
function Header({
  T,
  from,
  to,
  kicker,
  title,
  P
}) {
  const o = win(T, from, to, 0.6, 0.4);
  const y = (1 - MOTION.enter(T, from, 0.7)) * 14;
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: 64,
      top: 32,
      opacity: o,
      transform: `translateY(${y}px)`,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, React.createElement("div", {
    style: {
      font: `500 17px ${MONO}`,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: P.accent
    }
  }, kicker), React.createElement("div", {
    style: {
      font: `500 32px/1.15 ${SANS}`,
      color: P.ink,
      letterSpacing: '-0.01em'
    }
  }, title));
}
function Avatar({
  size = 46
}) {
  return React.createElement("img", {
    src: "cut/robot.jpg",
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      objectFit: 'cover',
      objectPosition: '50% 20%',
      flexShrink: 0
    }
  });
}
const TILES = ['t1', 't2', 't3', 't4', 't5', 't6'];
function OpenScene({
  T,
  C,
  total,
  P
}) {
  const out = 1 - MOTION.glide(T, C.Ask - 0.35, 0.5);
  const inOutro = T >= C.Outro;
  const titleIn = MOTION.enter(T, C.Outro + 0.5, 0.8);
  const to = inOutro ? titleIn : out;
  const tx = inOutro ? -30 * (1 - titleIn) : -50 * (1 - out);
  const gz = inOutro ? 1 : lerp(1, 1.05, clamp(T / C.Ask, 0, 1)) + 0.12 * (1 - out);
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 690,
      top: 118,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 272px)',
      gap: 14,
      transform: `scale(${gz})`,
      transformOrigin: '50% 50%',
      opacity: inOutro ? 1 : out
    }
  }, TILES.map((n, i) => {
    const p = inOutro ? MOTION.pop(T, C.Outro + i * 0.1, 0.55) : 1;
    const z = inOutro ? 1 : lerp(1, 1.12, clamp(T / C.Ask, 0, 1));
    return React.createElement("div", {
      key: n,
      style: popStyle(p, 30)
    }, React.createElement(Pic, {
      src: `cut/${n}.jpg`,
      w: 272,
      h: 190,
      z: z,
      radius: 8
    }));
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 72,
      top: 116,
      width: 600,
      opacity: to,
      transform: `translateX(${tx}px)`,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("img", {
    src: "img/face.png",
    style: {
      width: 88,
      height: 88,
      borderRadius: 18
    }
  }), React.createElement("div", {
    style: {
      font: `600 112px/0.95 ${SANS}`,
      color: P.ink,
      letterSpacing: '-0.035em'
    }
  }, "GLaMM"), React.createElement("div", {
    style: {
      font: `400 32px/1.2 ${SANS}`,
      color: P.ink,
      maxWidth: 560
    }
  }, "Pixel Grounding", React.createElement("br", null), "Large Multimodal Model"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      marginTop: 8
    }
  }, React.createElement("div", {
    style: {
      font: `500 18px ${MONO}`,
      color: P.bg,
      background: P.accent,
      padding: '6px 12px',
      borderRadius: 6
    }
  }, "CVPR 2024"))));
}
const Q_GCG = 'Can you give a detailed description of this image?';
const A_GCG = [['A large, '], ['colorful hot air balloon', 'rgba(232,69,60,0.38)'], [' is flying over the '], ['river', 'rgba(60,80,220,0.32)'], ['. The '], ['sky', 'rgba(90,190,235,0.4)'], [' is overarching the river, '], ['trees', 'rgba(60,160,60,0.36)'], [', and '], ['buildings', 'rgba(220,180,40,0.42)'], ['.']];
function AskScene({
  T,
  C,
  P
}) {
  const A = C.Ask,
    end = C.Model;
  const o = win(T, A + 0.1, end - 0.05, 0.6, 0.45);
  const img = MOTION.enter(T, A + 0.1, 0.8);
  const qStart = A + 0.35,
    aStart = A + 1.35,
    cps = 52;
  const balloonDone = aStart + (9 + 24) / cps;
  const wp = MOTION.glide(T, balloonDone, 0.9);
  const qb = MOTION.enter(T, qStart - 0.1, 0.4);
  const ab = MOTION.enter(T, aStart - 0.15, 0.4);
  const z = lerp(1.0, 1.08, MOTION.glide(T, A, end - A));
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: o
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 64,
      top: 138,
      transform: `translateY(${(1 - img) * 30}px) scale(${lerp(0.94, 1, img)})`,
      transformOrigin: '50% 50%'
    }
  }, React.createElement(Wipe, {
    a: "cut/balloon_in.jpg",
    b: "cut/balloon_out.jpg",
    w: 620,
    h: 450,
    p: wp,
    z: z,
    P: P
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 740,
      top: 150,
      width: 800,
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, React.createElement("div", {
    style: {
      alignSelf: 'flex-end',
      font: `400 24px/1.35 ${SANS}`,
      color: P.ink,
      background: P.bubble,
      padding: '14px 20px',
      borderRadius: '18px 18px 4px 18px',
      opacity: qb,
      transform: `translateY(${(1 - qb) * 12}px)`,
      minHeight: 32
    }
  }, Q_GCG.slice(0, charsAt(T, qStart, 60))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      alignItems: 'flex-start',
      opacity: ab,
      transform: `translateY(${(1 - ab) * 12}px)`
    }
  }, React.createElement(Avatar, {
    size: 52
  }), React.createElement("div", {
    style: {
      font: `400 29px/1.6 ${MONO}`,
      color: P.ink,
      textWrap: 'pretty'
    }
  }, typedSegs(A_GCG, charsAt(T, aStart, cps))))));
}
function Box({
  x,
  y,
  w,
  h,
  p,
  fill,
  label,
  P,
  children
}) {
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      ...popStyle(p, 16)
    }
  }, React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
      background: fill,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      font: `500 22px/1.15 ${SANS}`,
      color: P.ink,
      textAlign: 'center',
      boxShadow: '0 8px 22px rgba(0,0,0,0.10)'
    }
  }, label, children));
}
function Tokens({
  x,
  y,
  T,
  start,
  colors,
  P
}) {
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: x,
      top: y,
      display: 'flex',
      gap: 7
    }
  }, colors.map((c, i) => {
    const p = MOTION.pop(T, start + i * 0.07, 0.4);
    return React.createElement("div", {
      key: i,
      style: {
        width: 18,
        height: 48,
        borderRadius: 4,
        background: c,
        border: '1.5px solid rgba(0,0,0,0.18)',
        ...popStyle(p, 20)
      }
    });
  }));
}
function Wire({
  pts,
  p,
  P,
  w = 2.5
}) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return React.createElement("polyline", {
    points: pts.map(q => q.join(',')).join(' '),
    fill: "none",
    stroke: P.line,
    strokeWidth: w,
    strokeLinejoin: "round",
    strokeDasharray: len,
    strokeDashoffset: len * (1 - p),
    opacity: p > 0 ? 0.75 : 0
  });
}
const IN_TOK = ['#d4d6f7', '#d4d6f7', '#7a4fb0', '#d4d6f7', '#d4d6f7', '#e07a1f', '#d4d6f7'];
const OUT_TOK = ['#f3c7a3', '#f3c7a3', '#9cc3ea', '#f3c7a3', '#f3c7a3', '#f3c7a3', '#9cc3ea'];
const A_MODEL = [['A large, '], ['colorful hot air balloon', 'rgba(232,69,60,0.38)'], [' is flying over the '], ['river', 'rgba(60,80,220,0.32)'], ['.']];
function ModelScene({
  T,
  C,
  P
}) {
  const M = C.Model,
    end = C.Pipeline,
    K = 1.4;
  const o = win(T, M - 0.05, end - 0.05, 0.5, 0.4);
  const t = [M, M + K * 0.9, M + K * 1.9, M + K * 2.6, M + K * 3.6, M + K * 4.3];
  const s = keys(T, t, [1.3, 1.3, 1.3, 1.3, 1.3, 1.0]);
  const cx = keys(T, t, [520, 520, 800, 800, 1100, 800]);
  const cy = keys(T, t, [290, 290, 290, 286, 286, 300]);
  const tx = W / 2 - cx * s,
    ty = H / 2 - cy * s + (1 - s) * 0;
  const e = (a, d) => MOTION.enter(T, M + K * a, (d || 0.5) * K);
  const pp = a => MOTION.pop(T, M + K * a, 0.5);
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: o,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: W,
      height: H,
      transformOrigin: '0 0',
      transform: `translate(${tx}px, ${ty}px) scale(${s})`
    }
  }, React.createElement("svg", {
    width: W,
    height: H,
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'visible'
    }
  }, React.createElement(Wire, {
    P: P,
    p: e(0.45),
    pts: [[250, 330], [270, 330], [270, 222], [300, 222]]
  }), React.createElement(Wire, {
    P: P,
    p: e(0.45),
    pts: [[250, 330], [270, 330], [270, 452], [300, 452]]
  }), React.createElement(Wire, {
    P: P,
    p: e(1.0),
    pts: [[510, 222], [530, 222], [530, 330], [548, 330]]
  }), React.createElement(Wire, {
    P: P,
    p: e(1.0),
    pts: [[510, 452], [530, 452], [530, 330], [548, 330]]
  }), React.createElement(Wire, {
    P: P,
    p: e(1.6),
    pts: [[722, 330], [752, 330]]
  }), React.createElement(Wire, {
    P: P,
    p: e(2.2),
    pts: [[952, 330], [982, 330]]
  }), React.createElement(Wire, {
    P: P,
    p: e(2.5, 0.9),
    pts: [[150, 262], [150, 128], [1080, 128], [1080, 158]]
  }), React.createElement(Wire, {
    P: P,
    p: e(2.9),
    pts: [[1190, 196], [1232, 196]]
  }), React.createElement(Wire, {
    P: P,
    p: e(3.1),
    pts: [[1031, 300], [1031, 280], [1141, 280], [1141, 280], [1310, 280], [1310, 236]]
  }), React.createElement(Wire, {
    P: P,
    p: e(3.3),
    pts: [[1390, 196], [1430, 196], [1430, 300]]
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 50,
      top: 262,
      ...popStyle(pp(0.1))
    }
  }, React.createElement(Pic, {
    src: "cut/balloon_in.jpg",
    w: 200,
    h: 146,
    radius: 8
  })), React.createElement(Box, {
    x: 300,
    y: 184,
    w: 210,
    h: 76,
    p: pp(0.7),
    fill: P.box,
    label: "Global Image Encoder",
    P: P
  }), React.createElement(Box, {
    x: 300,
    y: 414,
    w: 210,
    h: 76,
    p: pp(0.8),
    fill: P.box,
    label: "Region Encoder",
    P: P
  }), React.createElement(Tokens, {
    x: 552,
    y: 306,
    T: T,
    start: M + K * 1.15,
    colors: IN_TOK,
    P: P
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 540,
      top: 366,
      width: 190,
      textAlign: 'center',
      font: `400 16px ${MONO}`,
      color: P.muted,
      opacity: e(1.4)
    }
  }, "image-region prompts"), React.createElement(Box, {
    x: 756,
    y: 268,
    w: 196,
    h: 124,
    p: pp(1.7),
    fill: P.llm,
    label: "LLM",
    P: P
  }, React.createElement(Avatar, {
    size: 50
  })), React.createElement(Tokens, {
    x: 986,
    y: 306,
    T: T,
    start: M + K * 2.3,
    colors: OUT_TOK,
    P: P
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 970,
      top: 366,
      width: 190,
      textAlign: 'center',
      font: `400 16px ${MONO}`,
      color: P.muted,
      opacity: e(2.6)
    }
  }, "output prompts"), React.createElement(Box, {
    x: 970,
    y: 158,
    w: 220,
    h: 76,
    p: pp(2.75),
    fill: P.box2,
    label: "Grounding Image Encoder",
    P: P
  }), React.createElement(Box, {
    x: 1236,
    y: 158,
    w: 154,
    h: 76,
    p: pp(2.95),
    fill: P.box2,
    label: "Pixel Decoder",
    P: P
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 1284,
      top: 300,
      ...popStyle(MOTION.enter(T, M + K * 3.35, 0.4), 10)
    }
  }, React.createElement(Wipe, {
    a: "cut/balloon_in.jpg",
    b: "cut/balloon_out.jpg",
    w: 292,
    h: 200,
    p: MOTION.glide(T, M + K * 3.45, 0.8),
    P: P,
    radius: 8
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 560,
      top: 430,
      width: 620,
      font: `400 22px/1.5 ${MONO}`,
      color: P.ink,
      opacity: e(1.95, 0.3)
    }
  }, typedSegs(A_MODEL, charsAt(T, M + K * 2.0, 30)))));
}
const LEVELS = [{
  n: 'Level-1',
  t: 'Objects & attributes',
  d: 'Tagging, open-vocabulary detection, region attributes'
}, {
  n: 'Level-2',
  t: 'Relationships',
  d: 'Short captions, phrase extraction, grounding, landmarks'
}, {
  n: 'Level-3',
  t: 'Scene graph & dense caption',
  d: 'Hierarchical scene graph, in-context learning with an LLM, verification'
}, {
  n: 'Level-4',
  t: 'Extra context',
  d: 'Landmark details, history and background'
}];
const OBJS = [['1', '#9a9a1a', 'dog, pub dog, a brown and white dog'], ['2', '#2233cc', 'dog collar, black color, chain collar'], ['3', '#d42020', 'bell, cowbell'], ['4', '#1f8a80', 'steps, stairs, the steps of a building'], ['5', '#8a2aa0', 'sack, a large white bag with black writing']];
const MARKS = [['5', 0.288, 0.178], ['2', 0.43, 0.364], ['4', 0.095, 0.498], ['1', 0.41, 0.532], ['3', 0.556, 0.535]];
const RELS = [[['A '], ['dog', '#9a9a1a'], [' sitting on the '], ['steps', '#1f8a80']], [['A '], ['large brown dog', '#9a9a1a'], [' wearing a '], ['chain collar', '#2233cc']], [['Cowbell', '#d42020'], [' attached to '], ['dog collar', '#2233cc']]];
const DENSE = [['A large brown dog', '#9a9a1a'], [' is sitting on the '], ['steps', '#1f8a80'], [' of a building. It is wearing a black chain '], ['dog collar', '#2233cc'], ['. The collar has a '], ['cowbell', '#d42020'], [' attached to it. There is a '], ['bag', '#8a2aa0'], [' in the background with black writings on it.']];
const Colored = ({
  segs
}) => segs.map(([t, c], i) => React.createElement("span", {
  key: i,
  style: {
    color: c || 'inherit',
    fontWeight: c ? 600 : 400
  }
}, t));
function PipelineScene({
  T,
  C,
  P
}) {
  const S = C.Pipeline,
    end = C.Data;
  const o = win(T, S - 0.05, end - 0.05, 0.5, 0.4);
  const st = [S + 0.6, S + 2.4, S + 4.2, S + 6.0];
  const lvl = st.filter(t => T >= t).length - 1;
  const img = MOTION.enter(T, S, 0.7);
  const z = lerp(1, 1.1, MOTION.glide(T, S, end - S));
  const panel = i => win(T, st[i] + 0.1, i < 3 ? st[i + 1] + 0.05 : end, 0.45, 0.3);
  const body = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 880,
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  };
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: o
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 64,
      top: 140,
      opacity: img
    }
  }, React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, React.createElement(Pic, {
    src: "cut/dog.jpg",
    w: 540,
    h: 392,
    z: z
  }), MARKS.map(([n, x, y], i) => {
    const p = MOTION.pop(T, st[0] + 0.3 + i * 0.12, 0.45);
    const pulse = lvl >= 1 ? 1 : 0;
    return React.createElement("div", {
      key: n,
      style: {
        position: 'absolute',
        left: 540 * (0.5 + (x - 0.5) * z) - 17,
        top: 392 * (0.5 + (y - 0.5) * z) - 17,
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: '#fff',
        border: `3px solid ${OBJS.find(q => q[0] === n)[1]}`,
        font: `600 17px ${SANS}`,
        color: '#1b1a18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
        opacity: clamp(p, 0, 1),
        transform: `scale(${p})`
      }
    }, n);
  })), React.createElement("div", {
    style: {
      marginTop: 14,
      font: `400 18px ${MONO}`,
      color: P.muted,
      opacity: MOTION.enter(T, S + 0.8, 0.5)
    }
  }, "model-generated annotations, with verification steps")), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 650,
      top: 140,
      width: 890,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10
    }
  }, LEVELS.map((L, i) => {
    const p = MOTION.pop(T, S + 0.2 + i * 0.1, 0.5);
    const on = lvl >= i,
      cur = lvl === i;
    const ok = MOTION.pop(T, st[i] + 1.3, 0.4);
    return React.createElement("div", {
      key: L.n,
      style: {
        ...popStyle(p, 14),
        padding: '10px 14px',
        borderRadius: 10,
        background: cur ? P.accent : on ? P.panel : 'transparent',
        border: `1.5px solid ${cur ? P.accent : P.bubble}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'relative'
      }
    }, React.createElement("div", {
      style: {
        font: `500 15px ${MONO}`,
        color: cur ? P.bg : P.muted,
        letterSpacing: '0.04em'
      }
    }, L.n), React.createElement("div", {
      style: {
        font: `500 19px/1.2 ${SANS}`,
        color: cur ? P.bg : P.ink
      }
    }, L.t), React.createElement("div", {
      style: {
        position: 'absolute',
        right: 8,
        top: 8,
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: '#2f8f4e',
        color: '#fff',
        font: `600 14px ${SANS}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: clamp(ok, 0, 1),
        transform: `scale(${ok})`
      }
    }, "\u2713"));
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 650,
      top: 248,
      width: 890,
      height: 300
    }
  }, React.createElement("div", {
    style: {
      ...body,
      opacity: panel(0)
    }
  }, React.createElement("div", {
    style: {
      font: `400 17px ${MONO}`,
      color: P.muted
    }
  }, LEVELS[0].d), OBJS.map(([n, c, t], i) => {
    const p = MOTION.enter(T, st[0] + 0.35 + i * 0.14, 0.4);
    return React.createElement("div", {
      key: n,
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        opacity: p,
        transform: `translateX(${(1 - p) * 20}px)`,
        font: `400 25px ${SANS}`,
        color: P.ink
      }
    }, React.createElement("span", {
      style: {
        font: `600 25px ${SANS}`,
        color: c,
        width: 20
      }
    }, n), t);
  })), React.createElement("div", {
    style: {
      ...body,
      opacity: panel(1),
      gap: 16
    }
  }, React.createElement("div", {
    style: {
      font: `400 17px ${MONO}`,
      color: P.muted
    }
  }, LEVELS[1].d), RELS.map((r, i) => {
    const p = MOTION.enter(T, st[1] + 0.35 + i * 0.25, 0.45);
    return React.createElement("div", {
      key: i,
      style: {
        opacity: p,
        transform: `translateX(${(1 - p) * 20}px)`,
        font: `400 28px ${SANS}`,
        color: P.ink
      }
    }, React.createElement(Colored, {
      segs: r
    }));
  }), React.createElement("div", {
    style: {
      font: `400 24px ${SANS}`,
      color: P.muted,
      opacity: MOTION.enter(T, st[1] + 1.2, 0.4)
    }
  }, "Landmarks: Outdoor \u2013 Urban Landscape")), React.createElement("div", {
    style: {
      ...body,
      opacity: panel(2)
    }
  }, React.createElement("div", {
    style: {
      font: `400 17px ${MONO}`,
      color: P.muted
    }
  }, LEVELS[2].d), React.createElement("div", {
    style: {
      font: `400 27px/1.5 ${SANS}`,
      color: P.ink,
      textWrap: 'pretty'
    }
  }, DENSE.map(([t, c], i) => {
    const p = MOTION.enter(T, st[2] + 0.3 + i * 0.1, 0.35);
    return React.createElement("span", {
      key: i,
      style: {
        opacity: p,
        color: c || 'inherit',
        fontWeight: c ? 600 : 400
      }
    }, t);
  }))), React.createElement("div", {
    style: {
      ...body,
      opacity: panel(3)
    }
  }, React.createElement("div", {
    style: {
      font: `400 17px ${MONO}`,
      color: P.muted
    }
  }, LEVELS[3].d), React.createElement("div", {
    style: {
      font: `400 25px/1.5 ${SANS}`,
      color: P.ink,
      textWrap: 'pretty',
      opacity: MOTION.enter(T, st[3] + 0.3, 0.5)
    }
  }, "Dogs, especially pugs and bulldogs, have been a part of human families for thousands of years, serving as loyal companions. Cowbells, once used to signal the arrival of a cow, have been repurposed as dog collars."))));
}
const LABELS = [['Person, Woman', '#ef7a68'], ['Person, Girl', '#e070d0'], ['Flower arrangement', '#a43aa8'], ['Scarf', '#4a7fc0'], ['Cellphone', '#3c9a3c'], ['Bag, Backpack', '#33bdbd'], ['Shopping bag', '#e0963c'], ['Jeans', '#c8b030']];
function Count({
  T,
  at,
  value,
  suffix,
  label,
  P
}) {
  const a = MOTION.enter(T, at, 0.6);
  const n = value * MOTION.glide(T, at, 1.1);
  return React.createElement("div", {
    style: {
      opacity: a,
      transform: `translateY(${(1 - a) * 14}px)`,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, React.createElement("div", {
    style: {
      font: `600 60px/1 ${SANS}`,
      color: P.ink,
      letterSpacing: '-0.02em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value < 10 ? n.toFixed(1) : Math.round(n), suffix), React.createElement("div", {
    style: {
      font: `400 20px/1.3 ${SANS}`,
      color: P.muted
    }
  }, label));
}
function DataScene({
  T,
  C,
  P
}) {
  const D = C.Data,
    end = C.Chat;
  const o = win(T, D - 0.05, end - 0.05, 0.5, 0.4);
  const img = MOTION.enter(T, D, 0.7);
  const z = lerp(1, 1.07, MOTION.glide(T, D, end - D));
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: o
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 64,
      top: 136,
      transform: `translateX(${(1 - img) * -40}px)`,
      opacity: img
    }
  }, React.createElement(Wipe, {
    a: "cut/grand_raw.jpg",
    b: "cut/grand_ann.jpg",
    w: 660,
    h: 440,
    p: MOTION.glide(T, D + 0.8, 1.0),
    z: z,
    P: P
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 780,
      top: 146,
      width: 760,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12
    }
  }, LABELS.map(([l, c], i) => {
    const p = MOTION.pop(T, D + 1.5 + i * 0.11, 0.5);
    return React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 16px 9px 12px',
        borderRadius: 999,
        background: P.panel,
        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
        font: `500 21px ${SANS}`,
        color: P.ink,
        ...popStyle(p, 18)
      }
    }, React.createElement("div", {
      style: {
        width: 16,
        height: 16,
        borderRadius: 4,
        background: c
      }
    }), l);
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 780,
      top: 400,
      display: 'flex',
      gap: 64
    }
  }, React.createElement(Count, {
    T: T,
    at: D + 2.5,
    value: 810,
    suffix: "M",
    label: "regions with masks",
    P: P
  }), React.createElement(Count, {
    T: T,
    at: D + 2.75,
    value: 7.5,
    suffix: "M",
    label: "unique concepts",
    P: P
  })));
}
const CHATS = [{
  a: 'cut/ramos_a.jpg',
  b: 'cut/ramos_b.jpg',
  q1: 'Can you segment Ramos in this image ?',
  q2: 'Now can you segment the football ?'
}, {
  a: 'cut/hair_a.jpg',
  b: 'cut/hair_b.jpg',
  q1: 'Can you segment the woman’s hair in this image',
  q2: 'Now please segment the hat.'
}, {
  a: 'cut/surf_a.jpg',
  b: 'cut/surf_b.jpg',
  q1: 'Can you segment what the person is using to ride ?',
  q2: 'Now can you please segment the sea.'
}];
function ChatScene({
  T,
  C,
  P
}) {
  const S = C.Chat,
    end = C.Outro;
  const o = 1 - MOTION.glide(T, end - 0.4, 0.45);
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: 64,
      top: 134,
      display: 'flex',
      gap: 22,
      opacity: T < S - 0.2 ? 0 : o
    }
  }, CHATS.map((c, i) => {
    const s0 = S + 0.15 + i * 0.3,
      s1 = S + 2.2 + i * 0.3;
    const col = MOTION.pop(T, s0, 0.55);
    const second = T >= s1;
    const q = second ? c.q2 : c.q1;
    const qs = second ? s1 : s0 + 0.15;
    const bubbleIn = second ? MOTION.enter(T, s1, 0.3) : 1;
    const img = MOTION.enter(T, s0 + 0.7, 0.5);
    return React.createElement("div", {
      key: i,
      style: {
        width: 476,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        ...popStyle(col, 30)
      }
    }, React.createElement("div", {
      style: {
        height: 66,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
      }
    }, React.createElement("div", {
      style: {
        font: `400 21px/1.3 ${SANS}`,
        color: P.ink,
        background: P.bubble,
        padding: '10px 16px',
        borderRadius: '16px 16px 4px 16px',
        maxWidth: 440,
        opacity: bubbleIn,
        transform: `translateY(${(1 - bubbleIn) * 8}px)`
      }
    }, q.slice(0, Math.max(1, charsAt(T, qs, 70))))), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start'
      }
    }, React.createElement(Avatar, {
      size: 40
    }), React.createElement("div", {
      style: {
        opacity: img,
        transform: `scale(${lerp(0.96, 1, img)})`,
        transformOrigin: '0 0'
      }
    }, React.createElement(Wipe, {
      a: c.a,
      b: c.b,
      w: 424,
      h: 282,
      p: MOTION.glide(T, s1 + 0.45, 0.8),
      z: lerp(1, 1.04, MOTION.glide(T, S, end - S)),
      P: P
    }))));
  }));
}
function Piece({
  theme
}) {
  const {
    T,
    CUES: C,
    authoredTotal
  } = useComposition();
  const P = THEMES[theme] || THEMES.light;
  return React.createElement("div", {
    "data-screen-label": `t=${Math.floor(T)}s`,
    style: {
      position: 'absolute',
      inset: 0,
      background: P.bg,
      overflow: 'hidden'
    }
  }, React.createElement(OpenScene, {
    T: T,
    C: C,
    total: authoredTotal,
    P: P
  }), React.createElement(AskScene, {
    T: T,
    C: C,
    P: P
  }), React.createElement(ModelScene, {
    T: T,
    C: C,
    P: P
  }), React.createElement(PipelineScene, {
    T: T,
    C: C,
    P: P
  }), React.createElement(DataScene, {
    T: T,
    C: C,
    P: P
  }), React.createElement(ChatScene, {
    T: T,
    C: C,
    P: P
  }), React.createElement(Header, {
    T: T,
    from: C.Ask + 0.2,
    to: C.Model,
    kicker: "01 \xB7 Grounded Conversation Generation",
    title: "Every phrase in the answer is tied to a mask",
    P: P
  }), React.createElement(Header, {
    T: T,
    from: C.Model,
    to: C.Pipeline,
    kicker: "02 \xB7 Model",
    title: "Image and region prompts in, grounded text and pixel masks out",
    P: P
  }), React.createElement(Header, {
    T: T,
    from: C.Pipeline,
    to: C.Data,
    kicker: "03 \xB7 GranD data collection",
    title: "A semi-automatic, four-level annotation pipeline",
    P: P
  }), React.createElement(Header, {
    T: T,
    from: C.Data,
    to: C.Chat,
    kicker: "03 \xB7 GranD dataset",
    title: "Run at scale: dense masks and labels on every image",
    P: P
  }), React.createElement(Header, {
    T: T,
    from: C.Chat,
    to: C.Outro,
    kicker: "04 \xB7 Referring segmentation",
    title: "Segments what you ask for, turn after turn",
    P: P
  }));
}
function GlammVideo() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || {
    motionEditor: true,
    theme: 'light'
  });
  const P = THEMES[t.theme] || THEMES.light;
  return React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: '#0d0d0c'
    }
  }, React.createElement(CompositionStage, {
    width: W,
    height: H,
    scenes: window.OM_SCENES,
    playback: window.OM_PLAYBACK,
    bg: P.bg
  }, React.createElement(Piece, {
    theme: t.theme
  })), React.createElement(TweaksPanel, null, React.createElement(TweakSection, {
    label: "Video"
  }), React.createElement(TweakToggle, {
    label: "Motion editor",
    value: t.motionEditor,
    onChange: v => setTweak('motionEditor', v)
  }), React.createElement(TweakRadio, {
    label: "Theme",
    value: t.theme,
    options: ['light', 'dark'],
    onChange: v => setTweak('theme', v)
  })));
}
window.GlammVideo = GlammVideo;
window.__mount = function () {
  return React.createElement(GlammVideo);
};