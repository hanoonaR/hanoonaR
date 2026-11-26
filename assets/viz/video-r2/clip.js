const {
  useComposition,
  CompositionStage,
  animate,
  Easing,
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakToggle,
  TweakRadio
} = window;
const MOTION = {
  enter: Easing.easeOutCubic,
  move: Easing.easeInOutCubic,
  pop: Easing.easeOutBack
};
const THEMES = {
  dark: {
    bg: '#121417',
    card: '#1b1e23',
    card2: '#23272d',
    ink: '#eef0f2',
    muted: '#9aa1ab',
    line: '#2e333a',
    dot: '#5d636c',
    amber: '#e9a43c',
    amberBg: '#3a2c15',
    good: '#3cc4ae',
    goodBg: '#123630',
    bad: '#ef6b5b',
    badBg: '#3d1e1b'
  },
  light: {
    bg: '#f3f2ee',
    card: '#ffffff',
    card2: '#f7f6f2',
    ink: '#16181b',
    muted: '#5f646b',
    line: '#dcdad4',
    dot: '#a7aab0',
    amber: '#b86f00',
    amberBg: '#f8ead3',
    good: '#0f8a76',
    goodBg: '#d9f1ec',
    bad: '#c63d2f',
    badBg: '#fbe3df'
  }
};
const SANS = "'Nunito', 'Helvetica Neue', Helvetica, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const FRAMES = ['f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6'];
const TIMES = [5, 24, 49, 103, 105, 163, 247];
const STAMP = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const VLEN = 270;
const KEY = 4;
const PLAYER = {
  x: 60,
  y: 100,
  w: 590,
  h: 390
};
const TRACK = {
  x: 60,
  y: 512,
  w: 590
};
const KEYBOX = {
  l: 0.02,
  t: 0.66,
  r: 0.95,
  b: 0.87
};
const RX = 700,
  RW = 840;
const OPT_Y = 160,
  OPT_H = 40,
  OPT_G = 6;
const lerp = (a, b, p) => a + (b - a) * p;
function useT() {
  const {
    T,
    CUES
  } = useComposition();
  const tw = (a, b, s, e, ease = MOTION.enter) => animate({
    from: a,
    to: b,
    start: s,
    end: e,
    ease
  })(T);
  const win = (inS, inE, outS, outE) => Math.min(tw(0, 1, inS, inE), outS == null ? 1 : tw(1, 0, outS, outE));
  return {
    T,
    C: CUES,
    tw,
    win
  };
}
function Typed({
  segs,
  p
}) {
  const total = segs.reduce((n, s) => n + s.t.length, 0);
  let left = Math.round(total * p);
  return segs.map((s, i) => {
    const n = Math.max(0, Math.min(s.t.length, left));
    left -= s.t.length;
    if (!n) return null;
    return React.createElement("span", {
      key: i,
      style: s.style
    }, s.t.slice(0, n));
  });
}
function Footer({
  th,
  showLabels
}) {
  const {
    T,
    C,
    win
  } = useT();
  const {
    authoredTotal
  } = useComposition();
  const o = win(0.05, 0.5, C.Outro + 4.0, C.Outro + 4.5);
  const chapters = [[0, 'Two questions'], [C.Example, 'An example'], [C.Baseline, 'Video-R1'], [C.Grounded, 'Video-R2 · finding the evidence'], [C.Answer, 'Video-R2 · reasoning to the answer'], [C.Metrics, 'Measuring it'], [C.Outro, '']];
  let idx = 0;
  chapters.forEach((c, i) => {
    if (T >= c[0]) idx = i;
  });
  const since = T - chapters[idx][0];
  const until = idx < chapters.length - 1 ? chapters[idx + 1][0] - T : 99;
  const co = Math.min(1, since / 0.3, until / 0.25);
  const prog = Math.min(1, T / (authoredTotal || 1));
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 30,
      opacity: o
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: 3,
      width: `${prog * 100}%`,
      background: th.amber
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      bottom: 10,
      display: 'flex',
      gap: 12,
      alignItems: 'baseline'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 15,
      color: th.amber
    }
  }, "Video-R2"), showLabels && React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 13,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: th.muted,
      opacity: co
    }
  }, chapters[idx][1])));
}
function Hook({
  th
}) {
  const {
    C,
    tw
  } = useT();
  const end = C.Example;
  const out = tw(1, 0, end - 0.5, end - 0.1);
  const q1 = tw(0, 1, 0.3, 0.8);
  const line = tw(0, 1, 1.0, 2.0, Easing.linear);
  const mis = tw(0, 1, 2.2, 2.6, MOTION.pop);
  const no = tw(0, 1, 2.6, 3.0);
  const q2 = tw(0, 1, 3.3, 3.8);
  const pre = '<think> … the most plausible option is indeed ';
  const shown = pre.slice(0, Math.round(pre.length * Math.min(1, line / 0.7)));
  const showA = line > 0.72,
    showE = line > 0.95;
  const chip = (v, on) => React.createElement("span", {
    style: {
      display: 'inline-block',
      padding: '0 10px',
      margin: '0 4px',
      borderRadius: 6,
      background: mis > 0.3 ? th.badBg : th.card2,
      color: mis > 0.3 ? th.bad : th.ink,
      fontWeight: 600,
      opacity: on ? 1 : 0
    }
  }, v);
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: out,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 26
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 56,
      fontWeight: 800,
      color: th.ink,
      opacity: q1,
      transform: `translateY(${(1 - q1) * 14}px)`
    }
  }, "Does the ", React.createElement("span", {
    style: {
      color: th.amber
    }
  }, "thinking"), " match the ", React.createElement("span", {
    style: {
      color: th.amber
    }
  }, "answer"), "?"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      fontFamily: MONO,
      fontSize: 24,
      color: th.muted,
      opacity: Math.min(1, line * 4),
      height: 44
    }
  }, React.createElement("span", null, shown, chip('A', showA), showA ? ' </think>  <answer>' : '', chip('E', showE), showE ? '</answer>' : ''), React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 40,
      background: th.bad,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: SANS,
      fontSize: 28,
      fontWeight: 900,
      opacity: Math.min(1, mis * 2),
      transform: `scale(${mis})`
    }
  }, "\u2260")), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 28,
      fontWeight: 700,
      color: th.bad,
      opacity: no,
      height: 36
    }
  }, "Often, it doesn\u2019t."), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 38,
      fontWeight: 700,
      color: th.ink,
      whiteSpace: 'nowrap',
      opacity: q2,
      transform: `translateY(${(1 - q2) * 12}px)`,
      marginTop: 6
    }
  }, "And is the thinking ", React.createElement("span", {
    style: {
      color: th.amber
    }
  }, "grounded in the video"), "?"));
}
function usePlayhead() {
  const {
    T,
    CUES: C
  } = useComposition();
  const e = C.Example,
    g = C.Grounded;
  if (T < C.Baseline) return animate({
    from: 0,
    to: VLEN,
    start: e + 0.6,
    end: e + 3.0,
    ease: Easing.linear
  })(T);
  if (T < g) return VLEN;
  if (T < g + 0.5) return animate({
    from: VLEN,
    to: 0,
    start: g,
    end: g + 0.5,
    ease: MOTION.move
  })(T);
  return animate({
    from: 0,
    to: TIMES[KEY],
    start: g + 0.5,
    end: g + 2.0,
    ease: MOTION.move
  })(T);
}
function Player({
  th
}) {
  const {
    T,
    C,
    tw,
    win
  } = useT();
  const e = C.Example,
    b = C.Baseline,
    g = C.Grounded;
  const ph = usePlayhead();
  const o = win(e + 0.1, e + 0.6, C.Metrics, C.Metrics + 0.4);
  let fi = 0;
  TIMES.forEach((t, i) => {
    if (ph >= t) fi = i;
  });
  const grey = Math.min(tw(0, 1, b + 0.2, b + 0.7), tw(1, 0, g + 0.1, g + 0.5));
  const box = tw(0, 1, g + 2.2, g + 2.7, MOTION.move);
  const boxO = Math.min(tw(0, 1, g + 2.2, g + 2.3), tw(1, 0, C.Metrics, C.Metrics + 0.3));
  const att = T < g ? lerp(0, 0.24, tw(0, 1, b + 0.6, b + 1.4)) : lerp(0.24, 0.78, tw(0, 1, g + 0.4, g + 2.4, MOTION.move));
  const attO = tw(0, 1, b + 0.5, b + 0.9);
  const attCol = T < g + 1.2 ? th.bad : th.good;
  const keyPulse = tw(0, 1, g + 2.0, g + 2.4, MOTION.pop);
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: o
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: PLAYER.x,
      top: PLAYER.y,
      width: PLAYER.w,
      height: PLAYER.h,
      borderRadius: 14,
      overflow: 'hidden',
      background: '#000',
      transform: `scale(${0.97 + 0.03 * tw(0, 1, e + 0.1, e + 0.7)})`
    }
  }, FRAMES.map((f, i) => React.createElement("img", {
    key: f,
    src: `r2/img/${f}.jpg`,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: i === fi ? 1 : 0,
      filter: `grayscale(${grey}) brightness(${1 - grey * 0.35})`
    }
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      padding: '10px 16px 8px 14px',
      borderRadius: '0 0 8px 0',
      background: 'rgb(16,16,18)',
      color: '#fff',
      fontFamily: MONO,
      fontSize: 17
    }
  }, STAMP(Math.round(ph))), React.createElement("div", {
    style: {
      position: 'absolute',
      left: `${KEYBOX.l * 100}%`,
      top: `${KEYBOX.t * 100}%`,
      width: `${(KEYBOX.r - KEYBOX.l) * 100 * box}%`,
      height: `${(KEYBOX.b - KEYBOX.t) * 100}%`,
      border: `3px solid ${th.amber}`,
      borderRadius: 6,
      boxSizing: 'border-box',
      opacity: boxO,
      boxShadow: `0 0 0 9999px rgba(0,0,0,${0.35 * box})`
    }
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      left: TRACK.x,
      top: TRACK.y,
      width: TRACK.w,
      height: 4,
      borderRadius: 2,
      background: th.line
    }
  }, React.createElement("div", {
    style: {
      height: '100%',
      width: `${ph / VLEN * 100}%`,
      borderRadius: 2,
      background: th.amber
    }
  }), TIMES.map((t, i) => {
    const isKey = i === KEY;
    return React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: `${t / VLEN * 100}%`,
        top: -4,
        width: 2,
        height: 12,
        marginLeft: -1,
        background: isKey && keyPulse > 0 ? th.amber : th.muted,
        transform: `scaleY(${isKey ? 1 + keyPulse * 0.8 : 1})`
      }
    });
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      left: `${ph / VLEN * 100}%`,
      top: -7,
      width: 18,
      height: 18,
      marginLeft: -9,
      borderRadius: 18,
      background: th.amber,
      boxShadow: `0 0 0 4px ${th.bg}`
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      left: `${TIMES[KEY] / VLEN * 100}%`,
      top: 16,
      transform: 'translateX(-50%)',
      fontFamily: MONO,
      fontSize: 15,
      fontWeight: 600,
      color: th.amber,
      opacity: Math.min(1, keyPulse)
    }
  }, "01:45")), React.createElement("div", {
    style: {
      position: 'absolute',
      left: TRACK.x,
      top: 560,
      width: TRACK.w,
      display: 'grid',
      gridTemplateColumns: '170px 1fr',
      gap: 14,
      alignItems: 'center',
      opacity: attO
    }
  }, React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 13,
      letterSpacing: '0.06em',
      color: th.muted
    }
  }, "ATTENTION TO VIDEO"), React.createElement("div", {
    style: {
      height: 10,
      borderRadius: 5,
      background: th.line,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      height: '100%',
      width: `${att * 100}%`,
      background: attCol,
      borderRadius: 5
    }
  }))));
}
const OPTIONS = [['A', '2,044,742,400'], ['B', '14,313,196,800'], ['C', '744,286,233,600'], ['D', '85,197,600'], ['E', '23,666']];
const QTEXT = 'How many transactions does Visa have in one day?';
const rowY = i => OPT_Y + i * (OPT_H + OPT_G);
function Options({
  th
}) {
  const {
    T,
    C,
    tw,
    win
  } = useT();
  const e = C.Example,
    b = C.Baseline,
    a = C.Answer;
  const o = win(e + 0.3, e + 0.7, C.Metrics, C.Metrics + 0.4);
  const typed = tw(0, 1, e + 0.4, e + 1.3, Easing.linear);
  const r2 = T >= C.Grounded;
  const thinkP = r2 ? tw(0, 1, a + 1.6, a + 2.0, MOTION.pop) : tw(0, 1, b + 2.6, b + 3.0, MOTION.pop);
  const ansP = r2 ? tw(0, 1, a + 2.0, a + 2.4, MOTION.pop) : tw(0, 1, b + 3.0, b + 3.4, MOTION.pop);
  const bracket = r2 ? 0 : tw(0, 1, b + 3.4, b + 3.9, MOTION.move);
  const tagsO = r2 ? 1 : tw(1, 0, C.Grounded, C.Grounded + 0.3);
  const ansRow = r2 ? 0 : 4;
  const col = r2 ? th.good : th.bad,
    bg = r2 ? th.goodBg : th.badBg;
  const tag = (label, row, p, x) => React.createElement("div", {
    style: {
      position: 'absolute',
      left: x,
      top: rowY(row) + 6,
      height: OPT_H - 12,
      padding: '0 10px',
      display: 'flex',
      alignItems: 'center',
      borderRadius: 6,
      background: col,
      color: '#fff',
      fontFamily: MONO,
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: '0.05em',
      opacity: Math.min(1, p * 2) * tagsO,
      transform: `translateX(${(1 - Math.min(1, p)) * 24}px) scale(${0.85 + 0.15 * p})`
    }
  }, label);
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: RX,
      top: 0,
      width: RW,
      height: 640,
      opacity: o
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 100,
      fontFamily: SANS,
      fontSize: 30,
      fontWeight: 800,
      color: th.ink,
      whiteSpace: 'nowrap'
    }
  }, QTEXT.slice(0, Math.round(QTEXT.length * typed))), OPTIONS.map(([k, v], i) => {
    const p = tw(0, 1, e + 1.2 + i * 0.1, e + 1.6 + i * 0.1);
    const hit = r2 && i === 0 && ansP > 0.5 ? 'good' : !r2 && (i === 0 || i === 4) && bracket > 0.3 ? 'bad' : null;
    return React.createElement("div", {
      key: k,
      style: {
        position: 'absolute',
        left: 0,
        top: rowY(i),
        width: 560,
        height: OPT_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 16px',
        borderRadius: 8,
        background: hit === 'good' ? th.goodBg : hit === 'bad' ? th.badBg : th.card,
        border: `1px solid ${hit === 'good' ? th.good : hit === 'bad' ? th.bad : th.line}`,
        opacity: p,
        transform: `translateX(${(1 - p) * 16}px)`
      }
    }, React.createElement("span", {
      style: {
        fontFamily: SANS,
        fontSize: 20,
        fontWeight: 800,
        color: th.muted,
        width: 18
      }
    }, k), React.createElement("span", {
      style: {
        fontFamily: MONO,
        fontSize: 19,
        color: th.ink
      }
    }, v));
  }), tag('THINK', 0, thinkP, 580), tag('ANSWER', ansRow, ansP, r2 ? 672 : 580), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 690,
      top: rowY(0) + OPT_H / 2,
      width: 18,
      height: (rowY(4) - rowY(0)) * bracket,
      borderTop: `3px solid ${th.bad}`,
      borderRight: `3px solid ${th.bad}`,
      borderBottom: bracket > 0.98 ? `3px solid ${th.bad}` : 'none',
      borderRadius: '0 8px 8px 0',
      opacity: bracket > 0.02 ? tagsO * (r2 ? 0 : 1) : 0
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 722,
      top: (rowY(0) + rowY(4)) / 2 + 2,
      fontFamily: SANS,
      fontSize: 20,
      fontWeight: 800,
      color: th.bad,
      opacity: Math.max(0, bracket - 0.6) * 2.5 * tagsO * (r2 ? 0 : 1)
    }
  }, "mismatch"), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 790,
      top: rowY(0) + 4,
      width: 32,
      height: 32,
      borderRadius: 32,
      background: th.good,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: SANS,
      fontSize: 24,
      fontWeight: 900,
      opacity: r2 ? Math.min(1, tw(0, 1, a + 2.4, a + 2.7) * 2) : 0,
      transform: `scale(${r2 ? tw(0, 1, a + 2.4, a + 2.8, MOTION.pop) : 0})`
    }
  }, "="));
}
const SPEAK = {
  base: [{
    t: '“… First, I need to '
  }, {
    t: 'recall what I know about Visa',
    bad: 1
  }, {
    t: ' … Wait, I remember '
  }, {
    t: 'from my previous knowledge',
    bad: 1
  }, {
    t: ' … The most plausible option is indeed A.”'
  }],
  ground: [{
    t: '“First, I’ll scan through the video. '
  }, {
    t: 'At around 01:45',
    hi: 1
  }, {
    t: ' there’s a comparison shown between Solana and Visa. The video shows '
  }, {
    t: '“23,666 transactions/sec”',
    hi: 1
  }, {
    t: '.”'
  }],
  answer: [{
    t: '“Now I need to convert this rate into a daily figure: '
  }, {
    t: '23,666 × 86,400 = 2,044,742,400',
    hi: 1
  }, {
    t: '. This matches option A.”'
  }]
};
function Speech({
  th
}) {
  const {
    T,
    C,
    tw,
    win
  } = useT();
  const b = C.Baseline,
    g = C.Grounded,
    a = C.Answer;
  const k = T < g ? 'base' : T < a ? 'ground' : 'answer';
  const s = k === 'base' ? b + 0.4 : k === 'ground' ? g + 0.4 : a + 0.2;
  const end = k === 'base' ? g : k === 'ground' ? a : C.Metrics;
  const o = win(s - 0.2, s + 0.1, end - 0.25, end + (k === 'answer' ? 0.3 : 0));
  const typed = tw(0, 1, s, s + (k === 'answer' ? 1.2 : 1.8), Easing.linear);
  const isR2 = k !== 'base';
  const note = k === 'base' ? win(b + 4.0, b + 4.4, g - 0.25, g) : 0;
  const segs = SPEAK[k].map(x => ({
    t: x.t,
    style: x.bad ? {
      color: th.bad,
      background: th.badBg,
      borderRadius: 3,
      fontWeight: 700
    } : x.hi ? {
      color: th.amber,
      fontWeight: 800
    } : null
  }));
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: RX,
      top: 420,
      width: RW,
      height: 190,
      opacity: o,
      boxSizing: 'border-box',
      padding: '16px 20px',
      borderRadius: 12,
      background: th.card,
      border: `1px solid ${isR2 ? th.amber : th.line}`
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 20,
      fontWeight: 900,
      color: isR2 ? th.amber : th.ink
    }
  }, isR2 ? 'Video-R2' : 'Video-R1'), React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 14,
      color: th.muted
    }
  }, "<think>")), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 22,
      lineHeight: 1.45,
      color: th.ink,
      textWrap: 'pretty'
    }
  }, React.createElement(Typed, {
    segs: segs,
    p: typed
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 20,
      bottom: 14,
      fontFamily: SANS,
      fontSize: 17,
      color: th.muted,
      opacity: note
    }
  }, "VideoChat-R1 shows the same mismatch: it reasons toward A, then answers E."));
}
const TAC = [['Video-R1', 73.6], ['VideoChat-R1', 76.8], ['VideoChat-R1.5', 78.2], ['VideoRFT', 79.5], ['Video-R2', 81.6]];
const VAS = [['Video-R1', 45.9], ['VideoChat-R1', 48.9], ['VideoChat-R1.5', 48.9], ['VideoRFT', 60.8], ['Video-R2', 69.4]];
function Metrics({
  th
}) {
  const {
    C,
    tw,
    win
  } = useT();
  const s = C.Metrics;
  const o = win(s + 0.3, s + 0.7, C.Outro, C.Outro + 0.4);
  const panel = (x, title, def, rows, t0) => React.createElement("div", {
    style: {
      position: 'absolute',
      left: x,
      top: 150,
      width: 720,
      height: 420,
      boxSizing: 'border-box',
      padding: '22px 26px',
      borderRadius: 14,
      background: th.card,
      border: `1px solid ${th.line}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      opacity: tw(0, 1, t0 - 0.3, t0)
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 28,
      fontWeight: 800,
      color: th.ink
    }
  }, title), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 20,
      color: th.muted,
      height: 30
    }
  }, def), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 8
    }
  }, rows.map(([n, v], i) => {
    const me = n === 'Video-R2';
    const p = tw(0, 1, t0 + 0.2 + i * 0.12, t0 + 1.0 + i * 0.12, MOTION.move);
    const w = (v - 40) / 50 * 420 * p;
    return React.createElement("div", {
      key: n,
      style: {
        display: 'grid',
        gridTemplateColumns: '170px 1fr',
        alignItems: 'center',
        gap: 14
      }
    }, React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 19,
        fontWeight: me ? 800 : 500,
        color: me ? th.amber : th.ink
      }
    }, n), React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, React.createElement("div", {
      style: {
        width: w,
        height: 28,
        borderRadius: 5,
        background: me ? th.amber : th.dot
      }
    }), React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 19,
        fontWeight: me ? 600 : 400,
        color: me ? th.amber : th.ink,
        opacity: p
      }
    }, (v * p).toFixed(1))));
  })));
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: o
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      top: 80,
      fontFamily: SANS,
      fontSize: 32,
      fontWeight: 700,
      color: th.ink,
      opacity: tw(0, 1, s + 0.3, s + 0.7)
    }
  }, "Two diagnostic metrics"), panel(60, 'Think–Answer Consistency (TAC)', 'Does the final answer follow from the reasoning?', TAC, s + 0.6), panel(820, 'Video Attention Score (VAS)', 'Does the reasoning rely on the video?', VAS, s + 1.4), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      top: 584,
      fontFamily: MONO,
      fontSize: 15,
      color: th.muted,
      opacity: tw(0, 1, s + 2.2, s + 2.6)
    }
  }, "Average over 11 benchmarks \xB7 bars start at 40"));
}
function Outro({
  th
}) {
  const {
    C,
    tw,
    win
  } = useT();
  const s = C.Outro;
  const a = win(s + 0.4, s + 0.9, s + 4.0, s + 4.5);
  const b = win(s + 0.6, s + 1.1, s + 4.0, s + 4.5);
  const items = [['Timestamp-aware SFT', 'reasoning tied to when the evidence appears'], ['GRPO + Temporal Alignment Reward', 'rewards temporally aligned, causally coherent reasoning'], ['TAC and VAS', 'two diagnostic metrics for consistency and visual reliance']];
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      top: 170,
      width: 640
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 120,
      fontWeight: 900,
      letterSpacing: '-0.03em',
      lineHeight: 1,
      color: th.ink,
      opacity: a,
      transform: `translateX(${(1 - a) * -20}px)`
    }
  }, "Video-", React.createElement("span", {
    style: {
      color: th.amber
    }
  }, "R2")), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 28,
      lineHeight: 1.35,
      color: th.muted,
      marginTop: 22,
      opacity: b,
      textWrap: 'pretty'
    }
  }, "Reinforcing Consistent and Grounded Reasoning in Multimodal Language Models")), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 800,
      top: 150,
      width: 740,
      display: 'flex',
      flexDirection: 'column'
    }
  }, items.map(([t, d], i) => {
    const c = win(s + 1.2 + i * 0.3, s + 1.7 + i * 0.3, s + 4.0, s + 4.5);
    return React.createElement("div", {
      key: i,
      style: {
        display: 'grid',
        gridTemplateColumns: '48px 1fr',
        gap: 12,
        padding: '20px 0',
        borderTop: `1px solid ${th.line}`,
        opacity: c,
        transform: `translateX(${(1 - c) * 24}px)`
      }
    }, React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 22,
        fontWeight: 600,
        color: th.amber
      }
    }, "0", i + 1), React.createElement("div", null, React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 28,
        fontWeight: 800,
        color: th.ink
      }
    }, t), React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 20,
        color: th.muted,
        marginTop: 4
      }
    }, d)));
  })));
}
function Piece({
  th,
  showLabels
}) {
  const {
    T
  } = useComposition();
  const drift = 1 + 0.006 * Math.sin(T * 0.45);
  return React.createElement("div", {
    "data-screen-label": `t=${Math.floor(T)}s`,
    style: {
      position: 'absolute',
      inset: 0,
      background: th.bg,
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      transform: `scale(${drift})`,
      transformOrigin: '50% 50%'
    }
  }, React.createElement(Hook, {
    th: th
  }), React.createElement(Player, {
    th: th
  }), React.createElement(Options, {
    th: th
  }), React.createElement(Speech, {
    th: th
  }), React.createElement(Metrics, {
    th: th
  }), React.createElement(Outro, {
    th: th
  })), React.createElement(Footer, {
    th: th,
    showLabels: showLabels
  }));
}
function VideoR2ClipB() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const th = THEMES[t.theme] || THEMES.dark;
  return React.createElement(React.Fragment, null, React.createElement(CompositionStage, {
    width: 1600,
    height: 640,
    scenes: window.OM_SCENES,
    playback: window.OM_PLAYBACK,
    bg: th.bg
  }, React.createElement(Piece, {
    th: th,
    showLabels: t.chapterLabels
  })), React.createElement(TweaksPanel, null, React.createElement(TweakSection, {
    label: "Video"
  }), React.createElement(TweakRadio, {
    label: "Theme",
    value: t.theme,
    options: ['dark', 'light'],
    onChange: v => setTweak('theme', v)
  }), React.createElement(TweakToggle, {
    label: "Chapter labels",
    value: t.chapterLabels,
    onChange: v => setTweak('chapterLabels', v)
  }), React.createElement(TweakToggle, {
    label: "Motion editor",
    value: t.motionEditor,
    onChange: v => setTweak('motionEditor', v)
  })));
}
window.VideoR2ClipB = VideoR2ClipB;
window.__mount = function () {
  return React.createElement(VideoR2ClipB);
};