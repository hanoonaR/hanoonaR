const THEMES = {
  dark: {
    bg: '#222d31',
    ink: '#eef2f1',
    mute: '#9fb0b5',
    line: 'rgba(238,242,241,0.14)',
    track: 'rgba(238,242,241,0.08)',
    card: 'rgba(238,242,241,0.045)',
    green: '#43d17a',
    orange: '#f5a524',
    coral: '#f06a57',
    violet: '#a98bf5',
    blue: '#5ea2f5',
    onAccent: '#222d31'
  },
  light: {
    bg: '#f4f5f2',
    ink: '#172024',
    mute: '#56666c',
    line: 'rgba(23,32,36,0.14)',
    track: 'rgba(23,32,36,0.08)',
    card: '#ffffff',
    green: '#17904a',
    orange: '#b87400',
    coral: '#d4472f',
    violet: '#6d4fd6',
    blue: '#2f74d0',
    onAccent: '#ffffff'
  }
};
const C = {
  sans: "'DM Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
  ...THEMES.light,
  light: true
};
function applyTheme(name) {
  Object.assign(C, THEMES[name] || THEMES.light, {
    light: name !== 'dark'
  });
}
const SEQ = {
  teaser: 98,
  race: 75,
  card: 77
};
const FPS = 15;
const MOTION = {
  enter: (T, start, dur = 0.6) => Easing.easeOutCubic(clamp((T - start) / dur, 0, 1)),
  fade: (T, start, dur = 0.5) => Easing.easeInOutSine(clamp((T - start) / dur, 0, 1)),
  pop: (T, start, dur = 0.5) => Easing.easeOutBack(clamp((T - start) / dur, 0, 1))
};
const window01 = (T, a, b, fin = 0.5, fout = 0.5) => MOTION.fade(T, a, fin) * (1 - MOTION.fade(T, b - fout, fout));
const FRAME_CACHE = {};
function useFrames() {
  const [, force] = React.useState(0);
  React.useEffect(() => {
    let alive = true;
    const jobs = [];
    Object.entries(SEQ).forEach(([k, n]) => {
      for (let i = 0; i < n; i++) {
        const p = `seq/${k}/${String(i).padStart(3, '0')}.jpg`;
        if (FRAME_CACHE[p]) continue;
        jobs.push(fetch(p).then(r => r.blob()).then(b => new Promise(res => {
          const fr = new FileReader();
          fr.onload = () => {
            FRAME_CACHE[p] = fr.result;
            res();
          };
          fr.readAsDataURL(b);
        })).catch(() => {}));
      }
    });
    Promise.all(jobs).then(() => alive && force(x => x + 1));
    return () => {
      alive = false;
    };
  }, []);
}
const frameSrc = (k, i) => {
  const p = `seq/${k}/${String(clamp(Math.floor(i), 0, SEQ[k] - 1)).padStart(3, '0')}.jpg`;
  return FRAME_CACHE[p] || p;
};
function Eyebrow({
  children,
  color = C.mute,
  style
}) {
  return React.createElement("div", {
    style: {
      fontFamily: C.mono,
      fontSize: 18,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color,
      ...style
    }
  }, children);
}
function rise(p, d = 18) {
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * d}px)`
  };
}
function TitleBlock({
  T,
  CUES,
  end
}) {
  const out = 1 - MOTION.fade(T, CUES.Strategies - 0.5, 0.5);
  const back = MOTION.fade(T, end - 0.9, 0.9);
  const vis = T < CUES.Results ? out : back;
  const drift = T < CUES.Results ? T * 3 : 0;
  const msg = T < CUES.Results ? MOTION.enter(T, 0.5, 0.8) : 1;
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 34,
      textAlign: 'center',
      opacity: vis,
      transform: `translateY(${-drift}px)`
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14
    }
  }, React.createElement("div", {
    style: {
      fontFamily: C.sans,
      fontWeight: 600,
      fontSize: 84,
      lineHeight: 1.02,
      letterSpacing: '-0.03em',
      color: C.ink,
      whiteSpace: 'nowrap'
    }
  }, "Locate Anything in Videos"), React.createElement("div", {
    style: {
      fontFamily: C.sans,
      fontSize: 30,
      color: C.mute
    }
  }, "Rethinking Efficient Generative Spatio-Temporal Video Grounding")), React.createElement("div", {
    style: {
      width: 56,
      height: 3,
      borderRadius: 2,
      background: C.green,
      opacity: msg,
      transform: `scaleX(${msg})`
    }
  }), React.createElement("div", {
    style: {
      maxWidth: 1100,
      fontFamily: C.sans,
      fontSize: 36,
      lineHeight: 1.35,
      color: C.ink,
      textWrap: 'balance',
      ...rise(msg, 14)
    }
  }, React.createElement("span", {
    style: {
      color: C.green,
      fontWeight: 600
    }
  }, "Parallel Tube Decoding"), " removes sequential dependencies by predicting the full spatio-temporal tube in just two decoding rounds."));
}
function TeaserPanel({
  T,
  CUES
}) {
  const local = T - CUES.Strategies;
  const sLen = CUES.Race - CUES.Strategies;
  const idx = clamp(local / sLen, 0, 1) * (SEQ.teaser - 1);
  const vis = MOTION.fade(T, CUES.Strategies, 0.6) * (1 - MOTION.fade(T, CUES.Race - 0.5, 0.5));
  const p = MOTION.enter(T, CUES.Strategies, 0.9);
  const zoom = 1 + 0.03 * clamp(local / sLen, 0, 1);
  return C.light ? React.createElement("div", {
    style: {
      position: 'absolute',
      left: 600,
      top: 61,
      width: 936,
      height: 518,
      borderRadius: 16,
      overflow: 'hidden',
      opacity: vis,
      boxShadow: '0 2px 6px rgba(23,32,36,0.10), 0 18px 40px rgba(23,32,36,0.12)',
      transform: `translateX(${(1 - p) * 40}px)`
    }
  }, React.createElement("img", {
    src: frameSrc('teaser', idx),
    style: {
      width: 936,
      height: 527,
      marginTop: -5,
      display: 'block',
      transform: `scale(${zoom})`,
      transformOrigin: '60% 45%'
    }
  })) : React.createElement("div", {
    style: {
      position: 'absolute',
      left: 580,
      top: 47,
      width: 1020,
      height: 574,
      overflow: 'hidden',
      opacity: vis,
      transform: `translateX(${(1 - p) * 40}px)`
    }
  }, React.createElement("img", {
    src: frameSrc('teaser', idx),
    style: {
      width: 1020,
      height: 574,
      display: 'block',
      transform: `scale(${zoom})`,
      transformOrigin: '60% 45%'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(90deg, ${C.bg} 0%, rgba(34,45,49,0) 6%)`
    }
  }));
}
function StrategyList({
  T,
  CUES
}) {
  const s = CUES.Strategies;
  const k = (CUES.Race - s) / 6.5;
  const rows = [{
    at: 0.25,
    name: 'Unquantized tokens',
    rounds: 'many',
    color: C.coral
  }, {
    at: 1.75,
    name: 'Quantized tokens',
    rounds: '4 + 7T',
    color: C.blue
  }, {
    at: 3.25,
    name: 'Sequential blocks',
    rounds: '1 + T',
    color: C.violet
  }, {
    at: 4.75,
    name: 'Parallel tubes (PTD)',
    rounds: '2',
    color: C.green,
    hero: true
  }];
  const vis = MOTION.fade(T, s, 0.6) * (1 - MOTION.fade(T, CUES.Race - 0.5, 0.5));
  const ptd = MOTION.enter(T, s + 4.75 * k, 0.6);
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: 64,
      top: 0,
      width: 490,
      height: 640,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 30,
      opacity: vis
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, React.createElement(Eyebrow, null, "Decoding rounds per tube"), React.createElement("div", {
    style: {
      fontFamily: C.sans,
      fontWeight: 600,
      fontSize: 42,
      lineHeight: 1.08,
      letterSpacing: '-0.015em',
      color: C.ink,
      textWrap: 'balance'
    }
  }, "Generative decoders build the tube one step at a time.")), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, rows.map((r, i) => {
    const p = MOTION.enter(T, s + r.at * k, 0.55);
    const muted = r.hero ? 1 : 1 - 0.45 * ptd;
    return React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 16,
        padding: '14px 0',
        borderTop: `1px solid ${C.line}`,
        ...rise(p * muted, 10),
        opacity: p * muted
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: C.sans,
        fontSize: 27,
        color: r.hero ? C.ink : C.mute,
        fontWeight: r.hero ? 600 : 400
      }
    }, React.createElement("span", {
      style: {
        width: 14,
        height: 14,
        borderRadius: 7,
        background: r.color,
        flex: 'none'
      }
    }), r.name), React.createElement("div", {
      style: {
        fontFamily: C.mono,
        fontSize: r.hero ? 36 : 26,
        color: r.hero ? C.green : C.ink,
        fontWeight: r.hero ? 700 : 400
      }
    }, r.rounds));
  })), React.createElement("div", {
    style: {
      fontFamily: C.sans,
      fontSize: 24,
      color: C.ink,
      ...rise(MOTION.enter(T, s + 5.3 * k, 0.6), 10)
    }
  }, "Two rounds, independent of the number of boxes."));
}
function Race({
  T,
  CUES
}) {
  const s = CUES.Race;
  const local = T - s;
  const inP = MOTION.enter(T, s, 0.8);
  const vis = MOTION.fade(T, s, 0.45) * (1 - MOTION.fade(T, CUES.Qualitative - 0.45, 0.45));
  const lanes = [{
    name: 'Parallel Tube Decoding',
    rounds: 2,
    done: 0.67,
    color: C.green,
    hero: true
  }, {
    name: 'Sequential Block Decoding',
    rounds: 7,
    done: 1.53,
    color: C.orange
  }, {
    name: 'Quantized Token Decoding',
    rounds: 46,
    done: 4.53,
    color: C.coral
  }];
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: vis
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 64,
      top: 0,
      width: 680,
      height: 640,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 40
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...rise(inP)
    }
  }, React.createElement(Eyebrow, null, "Decoding speed \xB7 same query"), React.createElement("div", {
    style: {
      fontFamily: C.sans,
      fontWeight: 600,
      fontSize: 48,
      lineHeight: 1.06,
      letterSpacing: '-0.02em',
      color: C.ink,
      textWrap: 'balance'
    }
  }, "PTD predicts all boxes in two rounds.")), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, lanes.map((l, i) => {
    const prog = clamp(local / l.done, 0, 1);
    const finished = MOTION.pop(T, s + l.done, 0.45);
    const rounds = Math.max(0, Math.round(prog * l.rounds));
    return React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        ...rise(MOTION.enter(T, s + i * 0.08, 0.6), 10)
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontFamily: C.sans,
        fontSize: 27,
        color: l.hero ? C.ink : C.mute,
        fontWeight: l.hero ? 600 : 400
      }
    }, React.createElement("span", null, l.name), React.createElement("span", {
      style: {
        fontFamily: C.mono,
        fontSize: 23,
        color: prog >= 1 ? l.color : C.mute
      }
    }, rounds, " / ", l.rounds, " rounds")), React.createElement("div", {
      style: {
        position: 'relative',
        height: 12,
        borderRadius: 6,
        background: C.track
      }
    }, React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: `${prog * 100}%`,
        borderRadius: 6,
        background: l.color
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        right: -8,
        top: -10,
        width: 32,
        height: 32,
        borderRadius: 16,
        background: l.color,
        opacity: finished > 0 ? 1 : 0,
        transform: `scale(${finished})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: C.sans,
        fontWeight: 700,
        fontSize: 18,
        color: C.onAccent
      }
    }, "\u2713")));
  }))), React.createElement("div", {
    style: {
      position: 'absolute',
      left: 800,
      top: 20,
      width: 720,
      height: 600,
      borderRadius: 14,
      overflow: 'hidden',
      border: `1px solid ${C.line}`,
      boxShadow: C.light ? '0 2px 6px rgba(23,32,36,0.10), 0 18px 40px rgba(23,32,36,0.12)' : 'none',
      transform: `translateX(${(1 - inP) * 40}px) scale(${1 + 0.02 * clamp(local / 5, 0, 1)})`,
      transformOrigin: '50% 50%'
    }
  }, React.createElement("img", {
    src: frameSrc('race', local * FPS),
    style: {
      position: 'absolute',
      left: -4,
      top: -4,
      width: 728,
      height: 608,
      display: 'block'
    }
  })));
}
function Qualitative({
  T,
  CUES
}) {
  const s = CUES.Qualitative;
  const local = T - s;
  const inP = MOTION.enter(T, s, 0.8);
  const vis = MOTION.fade(T, s, 0.45) * (1 - MOTION.fade(T, CUES.Results - 0.45, 0.45));
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: vis
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 64,
      right: 64,
      top: 34,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 40,
      ...rise(inP)
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, React.createElement(Eyebrow, null, "Qualitative comparison"), React.createElement("div", {
    style: {
      fontFamily: C.sans,
      fontWeight: 600,
      fontSize: 44,
      letterSpacing: '-0.02em',
      color: C.ink
    }
  }, "Sharper temporal boundaries, tighter spatial tubes.")), React.createElement("div", {
    style: {
      fontFamily: C.sans,
      fontSize: 22,
      color: C.mute,
      maxWidth: 480,
      textAlign: 'right',
      textWrap: 'pretty'
    }
  }, "PTD generates the interval and every box directly, with no external detector or tracker.")), React.createElement("div", {
    style: {
      position: 'absolute',
      left: C.light ? 80 : 0,
      top: 160,
      width: C.light ? 1440 : 1600,
      height: C.light ? 438 : 480,
      borderRadius: C.light ? 14 : 0,
      boxShadow: C.light ? '0 2px 6px rgba(23,32,36,0.10), 0 18px 40px rgba(23,32,36,0.12)' : 'none',
      overflow: 'hidden',
      transform: `translateY(${(1 - inP) * 30}px)`
    }
  }, React.createElement("img", {
    src: frameSrc('card', clamp(local / (CUES.Results - s), 0, 1) * (SEQ.card - 1)),
    style: {
      width: C.light ? 1440 : 1600,
      height: C.light ? 438 : 487,
      display: 'block',
      transform: `scale(${1 + 0.025 * clamp(local / (CUES.Results - s), 0, 1)})`,
      transformOrigin: '20% 60%'
    }
  })));
}
function Results({
  T,
  CUES,
  end
}) {
  const s = CUES.Results;
  const vis = MOTION.fade(T, s, 0.45) * (1 - MOTION.fade(T, end - 1.1, 0.5));
  const cards = [{
    k: 'Speed',
    metric: 'Tube latency',
    unit: 's',
    base: 31.6,
    ptd: 0.4,
    mult: 79,
    dir: 'lower',
    baseW: 1,
    ptdW: 0.4 / 31.6
  }, {
    k: 'Efficiency',
    metric: 'Boxes per second',
    unit: '',
    base: 0.5,
    ptd: 45.9,
    mult: 92,
    dir: 'higher',
    baseW: 0.5 / 45.9,
    ptdW: 1
  }];
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 32,
      padding: '0 64px',
      opacity: vis
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      ...rise(MOTION.enter(T, s, 0.6))
    }
  }, React.createElement("div", {
    style: {
      fontFamily: C.sans,
      fontWeight: 600,
      fontSize: 56,
      letterSpacing: '-0.025em',
      color: C.ink
    }
  }, "Faster and more efficient, with better grounding.")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 40
    }
  }, cards.map((c, i) => {
    const st = s + 0.3 + i * 0.35;
    const p = MOTION.enter(T, st, 0.6);
    const bar = MOTION.enter(T, st + 0.3, 0.9);
    const big = MOTION.pop(T, st + 0.9, 0.55);
    const count = Math.round(c.mult * MOTION.enter(T, st + 0.9, 0.8));
    const row = (label, val, w, color, hero) => React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '230px 1fr 104px',
        alignItems: 'center',
        gap: 18
      }
    }, React.createElement("div", {
      style: {
        fontFamily: C.sans,
        fontSize: 28,
        color: hero ? C.ink : C.mute,
        fontWeight: hero ? 600 : 400
      }
    }, label), React.createElement("div", {
      style: {
        height: 22,
        borderRadius: 11,
        background: C.track
      }
    }, React.createElement("div", {
      style: {
        height: 22,
        borderRadius: 11,
        width: `${Math.max(1.2, w * 100 * bar)}%`,
        background: color
      }
    })), React.createElement("div", {
      style: {
        fontFamily: C.mono,
        fontSize: 30,
        color: hero ? C.green : C.mute,
        textAlign: 'right',
        fontWeight: hero ? 700 : 400
      }
    }, val, c.unit));
    return React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        padding: '30px 36px',
        borderRadius: 18,
        background: C.card,
        boxShadow: C.light ? '0 1px 2px rgba(23,32,36,0.06), 0 8px 24px rgba(23,32,36,0.06)' : 'none',
        border: `1px solid ${C.line}`,
        ...rise(p, 16)
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(Eyebrow, {
      color: C.green,
      style: {
        fontSize: 20
      }
    }, c.k), React.createElement("div", {
      style: {
        fontFamily: C.sans,
        fontSize: 34,
        fontWeight: 600,
        color: C.ink
      }
    }, c.metric)), React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
        opacity: clamp(big, 0, 1),
        transform: `scale(${0.85 + 0.15 * big})`,
        transformOrigin: '100% 100%'
      }
    }, React.createElement("span", {
      style: {
        fontFamily: C.sans,
        fontWeight: 600,
        fontSize: 116,
        lineHeight: 0.9,
        letterSpacing: '-0.04em',
        color: C.green,
        fontVariantNumeric: 'tabular-nums'
      }
    }, count, "\xD7"), React.createElement("span", {
      style: {
        fontFamily: C.sans,
        fontSize: 30,
        color: C.ink
      }
    }, c.dir))), row('Token decoding', c.base, c.baseW, C.coral, false), row('PTD (ours)', c.ptd, c.ptdW, C.green, true));
  })), React.createElement("div", {
    style: {
      fontFamily: C.sans,
      fontSize: 28,
      color: C.mute,
      ...rise(MOTION.enter(T, s + 1.8, 0.6), 10)
    }
  }, "Mean vIoU 27.4 \u2192 ", React.createElement("span", {
    style: {
      color: C.ink
    }
  }, "32.9"), " and m_tIoU 42.8 \u2192 ", React.createElement("span", {
    style: {
      color: C.ink
    }
  }, "47.5"), " on VidSTG, with a compact 4B backbone."));
}
function PTDPiece() {
  const {
    T,
    CUES,
    authoredTotal
  } = useComposition();
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  applyTheme(t.theme);
  useFrames();
  const end = authoredTotal;
  return React.createElement("div", {
    "data-screen-label": `t=${Math.floor(T)}s`,
    style: {
      position: 'absolute',
      inset: 0,
      background: C.bg,
      overflow: 'hidden',
      fontFamily: C.sans
    }
  }, React.createElement(TeaserPanel, {
    T: T,
    CUES: CUES
  }), React.createElement(TitleBlock, {
    T: T,
    CUES: CUES,
    end: end
  }), React.createElement(StrategyList, {
    T: T,
    CUES: CUES
  }), React.createElement(Race, {
    T: T,
    CUES: CUES
  }), React.createElement(Qualitative, {
    T: T,
    CUES: CUES
  }), React.createElement(Results, {
    T: T,
    CUES: CUES,
    end: end
  }), React.createElement(TweaksPanel, null, React.createElement(TweakSection, {
    label: "Playback"
  }), React.createElement(TweakRadio, {
    label: "Background",
    value: t.theme || 'light',
    options: ['light', 'dark'],
    onChange: v => setTweak('theme', v)
  }), React.createElement(TweakToggle, {
    label: "Motion editor",
    value: t.motionEditor,
    onChange: v => setTweak('motionEditor', v)
  })));
}
function PTDVideo() {
  const theme = (window.TWEAK_DEFAULTS || {}).theme;
  applyTheme(theme);
  return React.createElement(CompositionStage, {
    width: 1600,
    height: 640,
    scenes: window.OM_SCENES,
    playback: window.OM_PLAYBACK,
    bg: C.bg
  }, React.createElement(PTDPiece, null));
}
window.PTDVideo = PTDVideo;
window.__mount = function () {
  return React.createElement(PTDVideo);
};