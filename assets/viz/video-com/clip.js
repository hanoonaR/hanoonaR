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
  light: {
    bg: '#f4f3ef',
    card: '#ffffff',
    ink: '#17171a',
    muted: '#62615b',
    line: '#dddbd3',
    blue: '#2d5bd0',
    blueBg: '#e6ecfb',
    green: '#24804a',
    greenBg: '#e2f2e7',
    red: '#c23a33',
    redBg: '#fbe6e4'
  },
  dark: {
    bg: '#111215',
    card: '#1b1c20',
    ink: '#eceae4',
    muted: '#9b998f',
    line: '#2f3035',
    blue: '#7f9ff2',
    blueBg: '#1f2a45',
    green: '#5cc283',
    greenBg: '#173324',
    red: '#ee7a72',
    redBg: '#3a1e1d'
  }
};
const SANS = "'Nunito', 'Helvetica Neue', Helvetica, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const SEGS = ['seg1', 'seg2', 'seg3', 'seg4', 'seg5', 'seg7', 'seg8', 'seg10'];
const SEG3 = ['s3a', 's3b', 's3c', 's3d'];
const STRIP = {
  x: 60,
  y: 160,
  w: 178,
  h: 116,
  gap: 8
};
const stripRect = i => ({
  x: STRIP.x + i * (STRIP.w + STRIP.gap),
  y: STRIP.y,
  w: STRIP.w,
  h: STRIP.h
});
const unfoldRect = i => ({
  x: 680 + i * 220,
  y: 372,
  w: 200,
  h: 129
});
const BIG = {
  x: 700,
  y: 300,
  w: 480,
  h: 309
};
const BOX = {
  l: 0.6,
  t: 0.3,
  r: 0.985,
  b: 0.985
};
const BOXRECT = {
  x: BIG.x + BIG.w * BOX.l,
  y: BIG.y + BIG.h * BOX.t,
  w: BIG.w * (BOX.r - BOX.l),
  h: BIG.h * (BOX.b - BOX.t)
};
const CROP = {
  x: 1240,
  y: 300,
  w: 300,
  h: 257
};
const cardRect = i => ({
  x: 60 + i * 376,
  y: 158,
  w: 350,
  h: 262
});
const cardImg = i => {
  const c = cardRect(i);
  return {
    x: c.x + 12,
    y: c.y + 12,
    w: c.w - 24,
    h: 168
  };
};
const lerp = (a, b, p) => a + (b - a) * p;
const lerpRect = (a, b, p) => ({
  x: lerp(a.x, b.x, p),
  y: lerp(a.y, b.y, p),
  w: lerp(a.w, b.w, p),
  h: lerp(a.h, b.h, p)
});
const rectStyle = r => ({
  position: 'absolute',
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h
});
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
  p,
  color
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
function Check({
  size = 34,
  color,
  p
}) {
  return React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: size,
      background: color,
      transform: `scale(${p})`,
      opacity: Math.min(1, p * 2),
      position: 'relative',
      flexShrink: 0
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: size * 0.36,
      top: size * 0.2,
      width: size * 0.26,
      height: size * 0.46,
      borderRight: `${size * 0.1}px solid #fff`,
      borderBottom: `${size * 0.1}px solid #fff`,
      transform: 'rotate(45deg)'
    }
  }));
}
function Cross({
  size = 30,
  color,
  p
}) {
  const bar = r => React.createElement("div", {
    style: {
      position: 'absolute',
      left: size * 0.22,
      top: size * 0.45,
      width: size * 0.56,
      height: size * 0.1,
      background: '#fff',
      borderRadius: 2,
      transform: `rotate(${r}deg)`
    }
  });
  return React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: size,
      background: color,
      transform: `scale(${p})`,
      opacity: Math.min(1, p * 2),
      position: 'relative',
      flexShrink: 0
    }
  }, bar(45), bar(-45));
}
function TopBar({
  th,
  showLabels
}) {
  const {
    T,
    C,
    win
  } = useT();
  const o = win(0.05, 0.5, C.Outro + 3.7, C.Outro + 4.2);
  const chapters = [[0, 'Thinking about → thinking with videos'], [C.Question, 'The question'], [C.ThinkAbout, 'Baseline · thinking about the video'], [C.FindSegment, 'Video-CoM · step 1 of 3 · find segment'], [C.FindFrame, 'Video-CoM · step 2 of 3 · find frame'], [C.SpatialZoom, 'Video-CoM · step 3 of 3 · spatial zoom'], [C.Rewards, 'Training · reasoning-aware GRPO'], [C.Outro, '']];
  let idx = 0;
  chapters.forEach((c, i) => {
    if (T >= c[0]) idx = i;
  });
  const since = T - chapters[idx][0];
  const until = idx < chapters.length - 1 ? chapters[idx + 1][0] - T : 99;
  const co = Math.min(1, since / 0.3, until / 0.25);
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      right: 60,
      top: 22,
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      opacity: o,
      fontFamily: MONO,
      fontSize: 15,
      letterSpacing: '0.04em',
      textTransform: 'uppercase'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: th.ink,
      fontWeight: 700,
      fontFamily: SANS,
      fontSize: 18,
      textTransform: 'none',
      letterSpacing: 0
    }
  }, React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      background: th.blue,
      borderRadius: 2
    }
  }), "Video-CoM"), showLabels && React.createElement("div", {
    style: {
      color: th.muted,
      opacity: co,
      transform: `translateY(${(1 - co) * 6}px)`
    }
  }, chapters[idx][1]));
}
const OPTIONS = [['A', 'M 500, L 700'], ['B', 'M 600, L 800'], ['C', 'M 700, L 1000'], ['D', 'M 700, L 900'], ['E', 'M 800, L 1000']];
const QTEXT = 'What are the prices listed in Korean Won for the medium and large sized cups of ice at the convenience store?';
function Question({
  th
}) {
  const {
    C,
    tw,
    win
  } = useT();
  const q = C.Question;
  const o = win(q + 0.2, q + 0.7, C.Rewards, C.Rewards + 0.4);
  const typed = tw(0, 1, q + 0.4, q + 1.8, Easing.linear);
  const optO = tw(0, 1, q + 1.7, q + 2.1);
  const cWrong = tw(0, 1, C.ThinkAbout + 2.6, C.ThinkAbout + 2.95, MOTION.pop);
  const dRight = tw(0, 1, C.SpatialZoom + 2.7, C.SpatialZoom + 3.05, MOTION.pop);
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      top: 62,
      width: 1480,
      height: 82,
      boxSizing: 'border-box',
      padding: '12px 20px',
      background: th.card,
      border: `1px solid ${th.line}`,
      borderRadius: 12,
      opacity: o,
      transform: `translateY(${(1 - tw(0, 1, q + 0.2, q + 0.7)) * 10}px)`,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 23,
      fontWeight: 500,
      color: th.ink,
      whiteSpace: 'nowrap'
    }
  }, React.createElement("span", {
    style: {
      color: th.muted,
      marginRight: 10
    }
  }, "Q"), QTEXT.slice(0, Math.round(QTEXT.length * typed))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 26,
      fontFamily: MONO,
      fontSize: 16,
      color: th.muted,
      opacity: optO
    }
  }, OPTIONS.map(([k, v]) => {
    const isC = k === 'C',
      isD = k === 'D';
    const p = isC ? cWrong : isD ? dRight : 0;
    const col = isC ? th.red : th.green;
    return React.createElement("div", {
      key: k,
      style: {
        position: 'relative',
        display: 'flex',
        gap: 8,
        padding: '1px 8px',
        borderRadius: 6,
        background: p > 0 ? isC ? th.redBg : th.greenBg : 'transparent',
        color: p > 0.5 ? col : th.muted,
        fontWeight: p > 0.5 ? 600 : 400
      }
    }, React.createElement("span", null, k, "."), React.createElement("span", null, v), isC && React.createElement("div", {
      style: {
        position: 'absolute',
        left: 6,
        right: 6,
        top: '52%',
        height: 2,
        background: th.red,
        transformOrigin: 'left',
        transform: `scaleX(${Math.min(1, cWrong)})`
      }
    }));
  })));
}
function Strip({
  th
}) {
  const {
    T,
    C,
    tw,
    win
  } = useT();
  const dim = Math.min(tw(0, 1, C.ThinkAbout, C.ThinkAbout + 0.4), tw(1, 0, C.FindSegment + 0.1, C.FindSegment + 0.5));
  const focus = tw(0, 1, C.FindSegment + 1.7, C.FindSegment + 2.1, MOTION.move);
  const out = tw(1, 0, C.Rewards, C.Rewards + 0.4);
  const q = C.Question;
  const sweep = tw(0, 1, q + 2.0, q + 3.0, MOTION.move);
  const sweepO = Math.min(tw(0, 1, q + 2.0, q + 2.2), tw(1, 0, q + 2.85, q + 3.05));
  return React.createElement(React.Fragment, null, SEGS.map((s, i) => {
    if (i === 2 && T > C.Rewards) return null;
    const e = tw(0, 1, q + 0.9 + i * 0.08, q + 1.4 + i * 0.08);
    const r = stripRect(i);
    const isSel = i === 2;
    const lift = isSel ? focus : 0;
    const op = e * out * (1 - dim * 0.55) * (isSel ? 1 : 1 - focus * 0.65);
    return React.createElement("div", {
      key: s,
      style: {
        ...rectStyle(r),
        opacity: op,
        transform: `translateY(${(1 - e) * 24 - lift * 6}px) scale(${1 + lift * 0.05})`,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: lift ? `0 0 0 ${3 * lift}px ${th.blue}, 0 10px 24px rgba(20,30,60,${0.25 * lift})` : 'none'
      }
    }, React.createElement("img", {
      src: `img/${s}.jpg`,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        filter: `grayscale(${dim})`
      }
    }));
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      top: STRIP.y - 8,
      height: STRIP.h + 16,
      width: 3,
      borderRadius: 2,
      background: th.blue,
      left: lerp(STRIP.x, STRIP.x + 1480, sweep),
      opacity: sweepO
    }
  }));
}
const R1 = [{
  t: '“Convenience stores typically have standard pricing for different sizes of drinks. '
}, {
  t: 'The larger size usually costs more',
  red: 1
}, {
  t: ' than the medium size … after considering all the options, option A seems reasonable … '
}, {
  t: 'fits the typical pricing structure of convenience stores',
  red: 1
}, {
  t: '.”'
}];
function ThinkAbout({
  th
}) {
  const {
    C,
    tw,
    win
  } = useT();
  const s = C.ThinkAbout;
  const o = win(s + 0.2, s + 0.6, C.FindSegment - 0.2, C.FindSegment + 0.2);
  const p = tw(0, 1, s + 0.5, s + 2.4, Easing.linear);
  const ans = tw(0, 1, s + 2.55, s + 2.9, MOTION.pop);
  const prob = tw(0, 1, s + 0.5, s + 0.85, MOTION.pop);
  const h1 = tw(0, 1, s + 0.7, s + 1.1, MOTION.move);
  const h2 = tw(0, 1, s + 1.1, s + 1.5, MOTION.move);
  const hl = (txt, p) => React.createElement("span", {
    style: {
      fontWeight: 700,
      color: p > 0.5 ? th.red : th.ink,
      backgroundImage: `linear-gradient(${th.redBg}, ${th.redBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${p * 100}% 100%`,
      borderRadius: 3,
      padding: '0 2px'
    }
  }, txt);
  const segs = R1.map(x => ({
    t: x.t,
    style: x.red ? {
      color: th.red,
      background: th.redBg,
      borderRadius: 3
    } : null
  }));
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      top: 312,
      width: 1480,
      height: 290,
      opacity: o,
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: 40
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 4
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 38,
      fontWeight: 700,
      color: th.ink
    }
  }, "Video-R1"), React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignSelf: 'flex-start',
      padding: '3px 10px',
      borderRadius: 6,
      background: th.red,
      color: '#fff',
      fontFamily: MONO,
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: '0.06em',
      opacity: prob,
      transform: `scale(${0.9 + 0.1 * prob})`,
      transformOrigin: 'left center'
    }
  }, "THE PROBLEM"), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 27,
      lineHeight: 1.4,
      color: th.ink
    }
  }, hl('Encodes the video once,', h1), " then ", hl('reasons in text only.', h2))), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 24,
      lineHeight: 1.5,
      color: th.ink,
      height: 144,
      textWrap: 'pretty'
    }
  }, React.createElement(Typed, {
    segs: segs,
    p: p
  })), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      opacity: Math.min(1, ans * 2),
      transform: `translateY(${(1 - Math.min(1, ans)) * 8}px)`
    }
  }, React.createElement(Cross, {
    size: 32,
    color: th.red,
    p: ans
  }), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 24,
      fontWeight: 600,
      color: th.red
    }
  }, "Answer: C \xB7 M 700, L 1000"), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 20,
      color: th.muted
    }
  }, "a guess from world knowledge"))));
}
const STEPS = [{
  text: 'I need to rewatch the part of the video where the convenience store is shown.',
  fn: 'FIND-SEGMENT',
  arg: 'person at convenience store',
  res: '3'
}, {
  text: 'Within this segment, I need to find the specific frame where the prices of the cups are displayed.',
  fn: 'FIND-FRAME',
  arg: 'the prices of the cups',
  res: '2475'
}, {
  text: 'There is a price sticker on the glass door. To read the small text, I will zoom in on the label.',
  fn: 'SPATIAL-ZOOM',
  arg: 'the blue and white sticker on the freezer',
  res: '[452, 180, 827, 502]'
}];
function Reasoner({
  th
}) {
  const {
    T,
    C,
    tw,
    win
  } = useT();
  const starts = [C.FindSegment, C.FindFrame, C.SpatialZoom];
  const ends = [C.FindFrame, C.SpatialZoom, C.Rewards];
  const headO = win(C.FindSegment + 0.2, C.FindSegment + 0.6, C.Rewards, C.Rewards + 0.4);
  const k = T < C.FindFrame ? 0 : T < C.SpatialZoom ? 1 : 2;
  const s = starts[k] + (k === 0 ? 0.5 : 0.2);
  const st = STEPS[k];
  const textO = win(s, s + 0.2, ends[k] - 0.25, ends[k] + (k === 2 ? 0.4 : 0));
  const typed = tw(0, 1, s, s + 1.0, Easing.linear);
  const chip = tw(0, 1, s + 1.1, s + 1.45, MOTION.pop);
  const ans = tw(0, 1, C.SpatialZoom + 2.7, C.SpatialZoom + 3.05, MOTION.pop);
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      top: 304,
      width: 580,
      height: 310,
      opacity: headO
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 14
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 38,
      fontWeight: 700,
      color: th.blue
    }
  }, "Video-CoM"), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 26,
      color: th.muted
    }
  }, "thinks with the video")), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 14
    }
  }, [0, 1, 2].map(i => {
    const done = tw(0, 1, starts[i] + 0.2, starts[i] + 0.5);
    return React.createElement("div", {
      key: i,
      style: {
        height: 5,
        flex: 1,
        borderRadius: 3,
        background: th.line,
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        height: '100%',
        width: `${done * 100}%`,
        background: th.blue
      }
    }));
  })), React.createElement("div", {
    style: {
      opacity: textO,
      marginTop: 18
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 23,
      lineHeight: 1.45,
      color: th.ink,
      height: 102,
      textWrap: 'pretty'
    }
  }, st.text.slice(0, Math.round(st.text.length * typed))), React.createElement("div", {
    style: {
      display: 'inline-flex',
      marginTop: 10,
      padding: '9px 14px',
      borderRadius: 8,
      background: th.blueBg,
      fontFamily: MONO,
      fontSize: 20,
      color: th.ink,
      opacity: Math.min(1, chip * 2),
      transform: `scale(${0.9 + 0.1 * chip})`,
      transformOrigin: 'left center',
      maxWidth: 580,
      boxSizing: 'border-box'
    }
  }, React.createElement("span", null, React.createElement("span", {
    style: {
      color: th.blue,
      fontWeight: 600
    }
  }, st.fn), "(", st.arg, ") = ", React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, st.res)))), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 262,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      opacity: Math.min(1, ans * 2)
    }
  }, React.createElement(Check, {
    size: 32,
    color: th.green,
    p: ans
  }), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 24,
      fontWeight: 600,
      color: th.green
    }
  }, "Answer: D \xB7 M 700, L 900")));
}
function Workspace({
  th
}) {
  const {
    T,
    C,
    tw,
    win
  } = useT();
  const fs = C.FindSegment,
    ff = C.FindFrame,
    sz = C.SpatialZoom,
    rw = C.Rewards;
  const scanIdx = animate({
    from: 0,
    to: 2,
    start: ff + 0.4,
    end: ff + 1.3,
    ease: MOTION.move
  })(T);
  const scanO = Math.min(tw(0, 1, ff + 0.3, ff + 0.5), tw(1, 0, ff + 1.35, ff + 1.55));
  const toBig = tw(0, 1, ff + 1.4, ff + 2.2, MOTION.move);
  const toCard = tw(0, 1, rw + 0.1, rw + 0.9, MOTION.move);
  const boxP = tw(0, 1, sz + 1.5, sz + 2.0, MOTION.move);
  const boxO = Math.min(tw(0, 1, sz + 1.5, sz + 1.6), tw(1, 0, rw, rw + 0.3));
  const cropP = tw(0, 1, sz + 2.05, sz + 2.75, MOTION.move);
  const cropO = tw(0, 1, sz + 2.05, sz + 2.2);
  const obsO = win(sz + 2.7, sz + 3.0, rw, rw + 0.3);
  const endO = tw(1, 0, C.Outro, C.Outro + 0.4);
  const scanRect = lerpRect(unfoldRect(Math.floor(scanIdx)), unfoldRect(Math.min(3, Math.floor(scanIdx) + 1)), scanIdx % 1);
  return React.createElement(React.Fragment, null, SEG3.map((s, i) => {
    const e = tw(0, 1, fs + 2.1 + i * 0.09, fs + 2.8 + i * 0.09, MOTION.move);
    if (e <= 0) return null;
    let r = lerpRect(stripRect(2), unfoldRect(i), e);
    let op = Math.min(1, e * 3);
    if (i === 2) {
      r = lerpRect(r, BIG, toBig);
      if (T > rw) r = lerpRect(BIG, cardImg(1), toCard);
    } else op *= tw(1, 0, ff + 1.3, ff + 1.7);
    op *= endO;
    if (op <= 0) return null;
    const hl = i === 2 ? tw(0, 1, ff + 1.2, ff + 1.4) * tw(1, 0, ff + 2.2, ff + 2.5) : 0;
    return React.createElement("div", {
      key: s,
      style: {
        ...rectStyle(r),
        opacity: op,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: `0 0 0 ${3 * hl}px ${th.blue}, 0 8px 20px rgba(20,30,60,0.12)`
      }
    }, React.createElement("img", {
      src: `img/${s}.jpg`,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }
    }));
  }), React.createElement("div", {
    style: {
      ...rectStyle(scanRect),
      opacity: scanO,
      borderRadius: 9,
      boxShadow: `0 0 0 3px ${th.blue}`,
      pointerEvents: 'none'
    }
  }), React.createElement("div", {
    style: {
      ...rectStyle({
        x: BOXRECT.x,
        y: BOXRECT.y,
        w: BOXRECT.w * boxP,
        h: BOXRECT.h * boxP
      }),
      opacity: boxO * (1 - toCard),
      border: `3px dashed ${th.blue}`,
      boxSizing: 'border-box',
      borderRadius: 4,
      background: 'rgba(45,91,208,0.08)'
    }
  }), cropO > 0 && (() => {
    let r = lerpRect(BOXRECT, CROP, cropP);
    if (T > rw) r = lerpRect(CROP, cardImg(2), toCard);
    return React.createElement("div", {
      style: {
        ...rectStyle(r),
        opacity: cropO * endO,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: `0 0 0 ${3 * (1 - toCard)}px ${th.blue}, 0 12px 28px rgba(20,30,60,0.2)`
      }
    }, React.createElement("img", {
      src: "img/zoom.jpg",
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }
    }));
  })(), React.createElement("div", {
    style: {
      position: 'absolute',
      left: CROP.x,
      top: CROP.y + CROP.h + 14,
      width: CROP.w,
      opacity: obsO,
      fontFamily: SANS,
      fontSize: 18,
      color: th.ink,
      display: 'flex',
      justifyContent: 'center',
      gap: 22
    }
  }, React.createElement("span", null, "M (\uBBF8\uB514\uC5C4\uCEF5) ", React.createElement("b", null, "700\uC6D0")), React.createElement("span", null, "L (\uB77C\uC9C0\uCEF5) ", React.createElement("b", null, "900\uC6D0"))));
}
const CARDS = [{
  fn: 'FIND-SEGMENT',
  res: '= 3'
}, {
  fn: 'FIND-FRAME',
  res: '= 2475'
}, {
  fn: 'SPATIAL-ZOOM',
  res: '= [452, 180, 827, 502]'
}, {
  fn: 'FINAL ANSWER',
  res: 'D · M 700, L 900'
}];
function Rewards({
  th
}) {
  const {
    T,
    C,
    tw,
    win
  } = useT();
  const rw = C.Rewards;
  const o = win(rw + 0.3, rw + 0.7, C.Outro, C.Outro + 0.4);
  const headO = tw(0, 1, rw + 0.2, rw + 0.6);
  const segFly = tw(0, 1, rw + 0.1, rw + 0.9, MOTION.move);
  const brR = tw(0, 1, rw + 2.3, rw + 2.7, MOTION.move);
  const brA = tw(0, 1, rw + 2.5, rw + 2.9, MOTION.move);
  const tot = tw(0, 1, rw + 2.9, rw + 3.3, MOTION.pop);
  const outO = tw(1, 0, C.Outro, C.Outro + 0.4);
  const segR = lerpRect(stripRect(2), cardImg(0), segFly);
  const bracket = (x0, x1, p, label, val) => React.createElement("div", {
    style: {
      position: 'absolute',
      left: x0,
      top: 440,
      width: x1 - x0,
      opacity: p
    }
  }, React.createElement("div", {
    style: {
      height: 12,
      borderLeft: `2px solid ${th.ink}`,
      borderRight: `2px solid ${th.ink}`,
      borderBottom: `2px solid ${th.ink}`,
      transformOrigin: 'center',
      transform: `scaleX(${p})`
    }
  }), React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 12,
      fontFamily: SANS,
      fontSize: 27,
      color: th.ink
    }
  }, label, " ", React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontWeight: 600,
      color: th.green,
      marginLeft: 8
    }
  }, val)));
  return React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      top: 80,
      opacity: headO * outO,
      fontFamily: SANS,
      fontSize: 40,
      fontWeight: 600,
      color: th.ink,
      transform: `translateY(${(1 - headO) * 8}px)`
    }
  }, "RA-GRPO rewards each manipulation, not only the final answer."), CARDS.map((c, i) => {
    const r = cardRect(i);
    const ck = tw(0, 1, rw + 1.2 + i * 0.3, rw + 1.55 + i * 0.3, MOTION.pop);
    return React.createElement("div", {
      key: i,
      style: {
        ...rectStyle(r),
        opacity: o,
        background: th.card,
        border: `1px solid ${th.line}`,
        borderRadius: 14,
        boxSizing: 'border-box'
      }
    }, i === 3 && React.createElement("div", {
      style: {
        position: 'absolute',
        left: 12,
        top: 12,
        right: 12,
        height: 168,
        borderRadius: 8,
        background: th.greenBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontSize: 84,
        fontWeight: 600,
        color: th.green
      }
    }, "D"), React.createElement("div", {
      style: {
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
      }
    }, React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 19,
        lineHeight: 1.35,
        color: th.ink
      }
    }, React.createElement("div", {
      style: {
        color: i === 3 ? th.green : th.blue,
        fontWeight: 600
      }
    }, c.fn), React.createElement("div", null, c.res)), React.createElement(Check, {
      size: 34,
      color: th.green,
      p: ck
    })));
  }), T > rw && T < C.Outro + 0.5 && React.createElement("div", {
    style: {
      ...rectStyle(segR),
      opacity: outO,
      borderRadius: 8,
      overflow: 'hidden'
    }
  }, React.createElement("img", {
    src: "img/seg3.jpg",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: outO
    }
  }, bracket(60, 1162, brR, 'Step-level reasoning reward', 'R_reason = 1'), bracket(1188, 1540, brA, 'Accuracy reward', 'R_acc = 1'), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 548,
      textAlign: 'center',
      fontFamily: MONO,
      fontSize: 32,
      color: th.ink,
      opacity: Math.min(1, tot * 2),
      transform: `scale(${0.9 + 0.1 * tot})`
    }
  }, "R_total = R_reason + R_acc = ", React.createElement("span", {
    style: {
      color: th.green,
      fontWeight: 600
    }
  }, "2"))));
}
function Intro({
  th
}) {
  const {
    C,
    tw
  } = useT();
  const end = C.Question;
  const out = tw(1, 0, end - 0.5, end - 0.1);
  const a = tw(0, 1, 0.3, 0.8);
  const strike = tw(0, 1, 1.2, 1.6, MOTION.move);
  const shift = tw(0, 1, 1.6, 2.3, MOTION.move);
  const b = tw(0, 1, 1.8, 2.4, MOTION.pop);
  const pts = ['Rewatch segments', 'Pause on frames', 'Zoom into details'];
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: out,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement("div", {
    style: {
      position: 'relative',
      fontFamily: SANS,
      fontSize: 52 + 24 * (1 - shift),
      fontWeight: 700,
      color: shift > 0.5 ? th.muted : th.ink,
      opacity: a * (1 - 0.4 * shift),
      whiteSpace: 'nowrap',
      transform: `translateY(${(1 - a) * 14 - shift * 10}px)`
    }
  }, "Thinking ", React.createElement("span", {
    style: {
      color: th.red
    }
  }, "about"), " videos", React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: '54%',
      height: 3,
      background: th.muted,
      transformOrigin: 'left',
      transform: `scaleX(${strike})`
    }
  })), React.createElement("div", {
    style: {
      height: 96 * shift,
      marginTop: 10 * shift,
      overflow: 'visible',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 86,
      fontWeight: 800,
      color: th.ink,
      opacity: Math.min(1, b * 2),
      transform: `translateY(${(1 - Math.min(1, b)) * 20}px) scale(${0.92 + 0.08 * b})`,
      whiteSpace: 'nowrap'
    }
  }, "Thinking ", React.createElement("span", {
    style: {
      color: th.blue
    }
  }, "with"), " videos")), React.createElement("div", {
    style: {
      marginTop: 34,
      display: 'flex',
      gap: 18
    }
  }, pts.map((p, i) => {
    const c = tw(0, 1, 2.6 + i * 0.3, 3.0 + i * 0.3, MOTION.pop);
    return React.createElement("div", {
      key: p,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 22px',
        borderRadius: 40,
        background: th.blueBg,
        fontFamily: SANS,
        fontSize: 32,
        fontWeight: 700,
        color: th.blue,
        opacity: Math.min(1, c * 2),
        transform: `translateY(${(1 - Math.min(1, c)) * 12}px) scale(${0.9 + 0.1 * c})`
      }
    }, React.createElement("span", {
      style: {
        fontFamily: MONO,
        fontSize: 22,
        opacity: 0.7
      }
    }, i + 1), p);
  })));
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
  const a = win(s + 0.4, s + 0.9, s + 3.7, s + 4.2);
  const b = win(s + 0.6, s + 1.1, s + 3.7, s + 4.2);
  const items = ['Interactive video reasoning through a Chain of Manipulations', 'A manipulation-driven instruction-tuning dataset', 'Reasoning-aware GRPO with step-level rewards'];
  const rise = p => `translateY(${(1 - p) * 14}px)`;
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18
    }
  }, React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 112,
      fontWeight: 900,
      letterSpacing: '-0.02em',
      color: th.ink,
      opacity: a,
      transform: rise(a)
    }
  }, "Video-", React.createElement("span", {
    style: {
      color: th.blue
    }
  }, "CoM")), React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 40,
      color: th.ink,
      opacity: b,
      transform: rise(b)
    }
  }, "Interactive Video Reasoning via Chain of Manipulations"), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 14
    }
  }, items.map((t, i) => {
    const c = win(s + 1.2 + i * 0.25, s + 1.7 + i * 0.25, s + 3.7, s + 4.2);
    return React.createElement("div", {
      key: i,
      style: {
        width: 470,
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        padding: '16px 20px',
        borderRadius: 14,
        background: th.card,
        border: `1px solid ${th.line}`,
        opacity: c,
        transform: rise(c),
        boxSizing: 'border-box'
      }
    }, React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 26,
        fontWeight: 600,
        color: th.blue
      }
    }, i + 1), React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 28,
        fontWeight: 600,
        lineHeight: 1.3,
        color: th.ink,
        textWrap: 'pretty'
      }
    }, t));
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
  }, React.createElement(TopBar, {
    th: th,
    showLabels: showLabels
  }), React.createElement(Intro, {
    th: th
  }), React.createElement(Question, {
    th: th
  }), React.createElement(Strip, {
    th: th
  }), React.createElement(ThinkAbout, {
    th: th
  }), React.createElement(Reasoner, {
    th: th
  }), React.createElement(Rewards, {
    th: th
  }), React.createElement(Workspace, {
    th: th
  }), React.createElement(Outro, {
    th: th
  })));
}
function VideoCoMClip() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const th = THEMES[t.theme] || THEMES.light;
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
    options: ['light', 'dark'],
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
window.VideoCoMClip = VideoCoMClip;
window.__mount = function () {
  return React.createElement(VideoCoMClip);
};