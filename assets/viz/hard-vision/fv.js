const C = {
  paper: '#f5f7fa',
  ink: '#12283f',
  ink2: '#3d5470',
  muted: '#6b7f95',
  faint: '#a9b6c4',
  line: 'rgba(18,40,63,0.12)',
  tide: '#1a6599',
  pink: '#e0508a',
  green: '#2fb37a',
  abyss: '#0a1a2f',
  exceeds: '#127c8a',
  at: '#3fa592',
  near: '#d89a3a',
  gap: '#e0705f',
  refS: '#e8914a',
  refH: '#4f9fd8'
};
const SANS = '"Optimistic Web", "Helvetica Neue", Arial, sans-serif';
const DISPLAY = '"Optimistic Display", "Optimistic Web", "Helvetica Neue", Arial, sans-serif';
const MOTION = {
  enter: (a, b, s, e) => animate({
    from: a,
    to: b,
    start: s,
    end: e,
    ease: Easing.easeOutCubic
  }),
  draw: (a, b, s, e) => animate({
    from: a,
    to: b,
    start: s,
    end: e,
    ease: Easing.easeInOutCubic
  }),
  pop: (a, b, s, e) => animate({
    from: a,
    to: b,
    start: s,
    end: e,
    ease: Easing.easeOutBack
  })
};
const ORDER = ['Title', 'Study', 'Coverage', 'Detection', 'Segmentation', 'Depth', 'VideoSeg', 'Tiers', 'Finding', 'Outro'];
const MEDIA_OF = {
  Title: 'none',
  Study: 'none',
  Coverage: 'cov',
  Tiers: 'tiers',
  Finding: 'finding',
  Detection: 'cars',
  Segmentation: 'rabbit',
  Depth: 'depth',
  VideoSeg: 'fish',
  Outro: 'none'
};
const GEO = {
  none: [920 / 552, 1100, 920],
  cov: [920 / 552, 1100, 920],
  tiers: [1472 / 552, 800, 1472],
  finding: [1472 / 552, 800, 1472],
  cars: [1.5, 1100, 920],
  rabbit: [760 / 560, 1100, 920],
  depth: [920 / 342, 1100, 920],
  fish: [4 / 3, 1100, 920]
};
const AREAS = [['Recognition & visual reading', [['g1_recognition', 'Recognition'], ['g1_finegrained', 'Fine-grained'], ['g1_counting', 'Counting'], ['g1_ocr', 'OCR'], ['g1_documents', 'Doc & charts']], ['Visual recognition', 'Fine-grained discrimination', 'Counting', 'OCR', 'Documents & charts']], ['Spatial reasoning', [['g3_spatial2d', '2D spatial'], ['g3_spatial3d', '3D & multiview']], ['2D spatial reasoning', '3D & multiview reasoning']], ['Visual reasoning', [['g2_logical', 'Logical reasoning'], ['g2_math', 'Math reasoning'], ['g2_scientific', 'Scientific reasoning']], ['Logical', 'Mathematical', 'Scientific']], ['2D grounding & segmentation', [['g4_detection', '2D detection'], ['g4_grounding', 'Grounding'], ['g4_segmentation', 'Segmentation'], ['g4_pose2d', 'Pose estimation']], ['2D detection', 'Visual grounding', 'Segmentation', 'Pose estimation']], ['3D perception & geometry', [['g5_depth', 'Monocular depth'], ['g5_detection3d', '3D detection'], ['g5_grounding3d', '3D grounding'], ['g5_reconstruction', 'Reconstruction']], ['Depth estimation', '3D detection', '3D grounding', '3D reconstruction']], ['Generation, editing & restoration', [['g7_t2i', 'Text-to-image'], ['g7_editing', 'Instruction editing'], ['g7_restoration', 'Restoration']], ['Text-to-image', 'Instruction editing', 'Restoration', 'Quality assessment']], ['Video understanding', [['g6_video', 'Temporal reasoning'], ['g6_videoseg', 'Video segmentation']], ['Video understanding', 'Temporal localization', 'Video segmentation']], ['Robotics & driving', [['g8_driving', 'Driving scenes'], ['g8_embodied', 'Embodied']], ['Driving scenes', 'Embodied understanding', 'Robotic navigation']], ['Expert domains', [['g9_medical', 'Medical'], ['g9_pathology', 'Pathology'], ['g9_remote', 'Remote sensing']], ['Medical understanding', '2D & 3D medical grounding', 'Pathology', 'Remote sensing']]];
const AREA_COUNTS = [5, 2, 3, 4, 4, 4, 3, 3, 6];
const TIERS = [['Exceeds reference', '> 110%', C.exceeds, [['Visual Recognition', 126, 'S'], ['3D Medical Grounding', 124, 'S'], ['Visual Math Reasoning', 118, 'H'], ['2D Object Detection', 114, 'S'], ['Remote-Sensing Reasoning', 114, 'S']]], ['At reference', '100–110%', C.at, [['Temporal Localization', 108, 'S'], ['Segmentation', 106, 'S'], ['Medical Understanding', 106, 'S'], ['Embodied Understanding', 105, 'S'], ['Doc & Chart Understanding', 104, 'H'], ['Text-to-Image Generation', 104, 'S'], ['3D Object Detection', 103, 'S'], ['Instruction-Guided Editing', 103, 'S'], ['Image Quality Assessment', 102, 'S'], ['OCR & Text Recognition', 100, 'H'], ['2D Spatial Reasoning', 100, 'H']]], ['Approaching', '85–100%', C.near, [['Scientific Reasoning', 98, 'H'], ['2D Visual Grounding', 97, 'H'], ['3D & Multiview Reasoning', 95, 'H'], ['Visual Logical Reasoning', 93, 'H'], ['Video Segmentation', 93, 'S'], ['Video Understanding', 92, 'H'], ['Driving-Scene Reasoning', 92, 'H'], ['2D Pose Estimation', 90, 'S'], ['Fine-Grained Discrimination', 89, 'H'], ['Visual Counting', 88, 'H']]], ['Substantial gap', '< 85%', C.gap, [['3D Visual Grounding', 78, 'H'], ['2D Medical Grounding', 75, 'S'], ['Depth Estimation', 70, 'S'], ['Image Restoration', 58, 'S'], ['3D Reconstruction', 44, 'S'], ['Remote-Sensing Grounding', 35, 'S'], ['Microscopy & Pathology', 29, 'H']]]];
const SEQ = {
  cars: {
    sheet: 'dense200-101_car_sequential',
    n: 42,
    cols: 7,
    rows: 6,
    steps: []
  },
  rabbit: {
    sheet: 'seg_rabbit_progression_sam3',
    n: 64,
    cols: 8,
    rows: 8,
    steps: [[0, 'Input', 'Referring expression and RGB image'], [10, 'Rough polygon', '81 vertices typed by Astra'], [22, 'Curved outline', 'Bézier curves, 3,234 points'], [31, 'Edge refinement', 'Hem snapped to the shirt edge'], [43, 'Predicted mask', 'Rasterised final polygon']]
  },
  depth: {
    sheet: 'depth_progression',
    n: 84,
    cols: 7,
    rows: 12,
    steps: [[0, 'Input', 'Metric depth from a single RGB image'], [7, 'Find seat backs by colour', 'Python call 1: 23 blue regions'], [17, 'Room layout', 'Floor plane and back wall'], [26, 'Add fixtures', 'Booth, barrier and rail placed by hand'], [34, 'Candidate depth', 'Call 2: 41 chairs from detections'], [44, 'Revision', 'Chairs placed row by row, far to near'], [61, 'Final depth', 'Rendered program output']]
  },
  fish: {
    sheet: 'vos_gold-fish_progression',
    n: 56,
    cols: 8,
    rows: 7,
    steps: [[0, 'Input video', '78 frames, five gold-fish'], [7, 'First-frame mask', 'The only annotation Astra receives'], [16, 'Propagated prediction', 'Every instance tracked through the clip']]
  }
};
const seqFrame = (k, T, from, to) => Math.round(clamp((T - from) / Math.max(0.5, to - from), 0, 1) * (SEQ[k].n - 1));
const stepOf = (k, f) => {
  const st = SEQ[k].steps;
  let s = 0;
  st.forEach((x, i) => {
    if (f >= x[0]) s = i;
  });
  return s;
};
function useBounds(CUES, end) {
  return ORDER.map((n, i) => ({
    name: n,
    s: CUES[n],
    e: i < ORDER.length - 1 ? CUES[ORDER[i + 1]] : end
  }));
}
function win(T, s, e, {
  fin = 0.6,
  fout = 0.45,
  delay = 0.15,
  holdStart = false,
  holdEnd = false
} = {}) {
  const a = holdStart ? 1 : MOTION.enter(0, 1, s + delay, s + delay + fin)(T);
  const b = holdEnd ? 1 : MOTION.draw(1, 0, e - fout, e)(T);
  return T < s - 0.01 || T > e + 0.01 ? 0 : Math.min(a, b);
}
const playWin = b => [b.s + 0.4, b.e - 0.9];
function coverageTimes(b) {
  const D = (b.e - b.s - 1.0) / AREAS.length;
  return AREAS.map((_, i) => b.s + 0.5 + i * D);
}
function activeArea(T, b) {
  const ts = coverageTimes(b);
  let a = -1;
  ts.forEach((t, i) => {
    if (T >= t - 0.25) a = i;
  });
  return T > b.e - 0.6 ? -1 : a;
}
function CoveragePanel({
  b,
  T,
  o,
  w,
  h
}) {
  const ts = coverageTimes(b);
  let pos = 0;
  ts.forEach((t, i) => {
    if (i > 0) pos += MOTION.draw(0, 1, t - 0.45, t + 0.05)(T);
  });
  const PW = 920,
    PH = 552;
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      opacity: o,
      background: '#fff'
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: (w - PW) / 2,
      top: (h - PH) / 2,
      width: PW,
      height: PH
    }
  }, AREAS.map(([name, tiles], i) => {
    const n = tiles.length,
      cols = n <= 3 ? n : n === 4 ? i === 3 || i === 4 ? 2 : 4 : 3,
      rows = Math.ceil(n / cols);
    const grid2 = i === 3 || i === 4,
      ar = grid2 ? 0.6 : 0.75;
    const gap = grid2 ? 20 : 16,
      availW = PW - 72,
      availH = grid2 ? PH - 118 : PH - 150;
    let tw = (availW - gap * (cols - 1)) / cols,
      th = tw * ar;
    const maxTh = (availH - (rows - 1) * (grid2 ? 40 : 44)) / rows - (grid2 ? 28 : 0);
    if (th > maxTh) {
      th = maxTh;
      tw = th / ar;
    }
    const x = (i - pos) * PW;
    if (Math.abs(i - pos) > 1.2) return null;
    const t0 = i === 0 ? b.s + 0.1 : ts[i] - 0.95;
    return React.createElement("div", {
      key: name,
      style: {
        position: 'absolute',
        left: x,
        top: 0,
        width: PW,
        height: PH,
        padding: '34px 36px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 22
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between'
      }
    }, React.createElement("span", {
      style: {
        font: `700 32px/1.1 ${DISPLAY}`,
        color: C.ink,
        letterSpacing: '-0.012em'
      }
    }, name), React.createElement("span", {
      style: {
        font: `600 18px/1 ${SANS}`,
        color: C.tide,
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }
    }, String(i + 1).padStart(2, '0'), " / 09 \xB7 ", AREA_COUNTS[i], " capabilities")), React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'center',
        gap: `${grid2 ? 12 : 28}px ${gap}px`
      }
    }, tiles.map(([img, label], j) => {
      const at = t0 + j * 0.08;
      return React.createElement("div", {
        key: img,
        style: {
          width: tw,
          display: 'flex',
          flexDirection: 'column',
          gap: grid2 ? 6 : 10,
          opacity: MOTION.enter(0, 1, at, at + 0.35)(T),
          transform: `translateY(${MOTION.enter(14, 0, at, at + 0.45)(T)}px)`
        }
      }, React.createElement("img", {
        src: `assets/tiles/${img}.jpg`,
        style: {
          width: tw,
          height: th,
          objectFit: 'cover',
          borderRadius: 10,
          display: 'block'
        }
      }), React.createElement("span", {
        style: {
          font: `600 21px/1.1 ${SANS}`,
          color: C.ink2,
          textAlign: 'center'
        }
      }, label));
    })));
  })));
}
const TIER_ROWS = TIERS;
function TierMap({
  b,
  T,
  o
}) {
  const LO = 20,
    HI = 145,
    X = p => (clamp(p, LO, HI) - LO) / (HI - LO) * 100;
  const colsDef = [[0, 1], [2, 3]];
  let idx = 0;
  const t0 = b.s + 0.6;
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: '26px 36px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      opacity: o,
      background: '#fff'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 18
    }
  }, React.createElement("span", {
    style: {
      font: `700 30px/1.1 ${DISPLAY}`,
      color: C.ink,
      letterSpacing: '-0.012em'
    }
  }, "Four maturity tiers"), React.createElement("span", {
    style: {
      font: `500 18px/1.2 ${SANS}`,
      color: C.muted,
      flex: 1
    }
  }, "Best generalist as a percentage of the best available reference"), React.createElement("span", {
    style: {
      display: 'flex',
      gap: 16,
      font: `500 15px/1 ${SANS}`,
      color: C.muted
    }
  }, React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, React.createElement(RefTag, {
    k: "S",
    small: true
  }), "Specialist"), React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, React.createElement(RefTag, {
    k: "H",
    small: true
  }), "Human"))), React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 44,
      minHeight: 0
    }
  }, colsDef.map((tiersIdx, ci) => React.createElement("div", {
    key: ci,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, tiersIdx.map(ti => {
    const [name, range, color, items] = TIER_ROWS[ti];
    return React.createElement("div", {
      key: name,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        marginBottom: 6
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        font: `700 16px/1 ${SANS}`,
        color,
        padding: '4px 0 3px'
      }
    }, React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: 5,
        background: color
      }
    }), name, React.createElement("span", {
      style: {
        font: `500 14px/1 ${SANS}`,
        color: C.muted
      }
    }, range)), items.map(([cap, pct, ref]) => {
      const at = t0 + idx++ * 0.07;
      const g = MOTION.draw(0, 1, at, at + 0.6)(T);
      const cur = 100 + (pct - 100) * g;
      const pos = pct >= 100;
      const left = pos ? X(100) : X(cur),
        width = Math.max(0.5, Math.abs(X(cur) - X(100)));
      return React.createElement("div", {
        key: cap,
        style: {
          display: 'grid',
          gridTemplateColumns: '228px 1fr 22px',
          alignItems: 'center',
          gap: 10,
          height: 21.5
        }
      }, React.createElement("span", {
        style: {
          font: `500 15.5px/1 ${SANS}`,
          color: C.ink,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, cap), React.createElement("div", {
        style: {
          position: 'relative',
          height: '100%'
        }
      }, [25, 50, 75, 125].map(v => React.createElement("span", {
        key: v,
        style: {
          position: 'absolute',
          left: `${X(v)}%`,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'rgba(18,40,63,0.07)'
        }
      })), React.createElement("span", {
        style: {
          position: 'absolute',
          left: `${X(100)}%`,
          top: -2,
          bottom: -2,
          width: 2,
          background: C.ink,
          opacity: 0.55
        }
      }), React.createElement("span", {
        style: {
          position: 'absolute',
          left: `${left}%`,
          width: `${width}%`,
          top: 4,
          bottom: 4,
          background: color,
          borderRadius: 3
        }
      }), React.createElement("span", {
        style: {
          position: 'absolute',
          left: `calc(${X(cur)}% ${pos ? '+ 7px' : '- 7px'})`,
          transform: pos ? 'none' : 'translateX(-100%)',
          top: '50%',
          marginTop: -7,
          font: `700 14px/1 ${SANS}`,
          color,
          opacity: g,
          fontVariantNumeric: 'tabular-nums'
        }
      }, pct, "%")), React.createElement(RefTag, {
        k: ref,
        small: true
      }));
    }));
  }), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '228px 1fr 22px',
      gap: 10,
      marginTop: 'auto'
    }
  }, React.createElement("span", null), React.createElement("div", {
    style: {
      position: 'relative',
      height: 16
    }
  }, [25, 50, 75, 100, 125].map(v => React.createElement("span", {
    key: v,
    style: {
      position: 'absolute',
      left: `${X(v)}%`,
      transform: 'translateX(-50%)',
      font: `${v === 100 ? 700 : 500} 13px/1 ${SANS}`,
      color: v === 100 ? C.ink : C.muted
    }
  }, v, "%"))), React.createElement("span", null))))));
}
const FIND = [['Semantic competence', 'Interpreting visual content and reasoning about it', C.exceeds, [['Consistent across all six models', 'Recognition, visual reading and knowledge-based reasoning'], ['Above the human reference', 'Document, chart and infographic understanding, and visual math'], ['Above the specialist reference', 'Object detection and image segmentation (GPT-6 Astra)']]], ['Perceptual precision', 'Measuring and reconstructing faithfully', C.gap, [['Accurate geometry', 'Depth estimation and 3D reconstruction'], ['Faithful fine detail', 'Image restoration'], ['Consistency across frames', 'Boundaries and small parts in video segmentation'], ['Fine-grained expertise', 'Telling nucleus types apart in pathology']]]];
function FindingPanel({
  b,
  T,
  o
}) {
  let k = 0;
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: '34px 44px',
      display: 'flex',
      flexDirection: 'column',
      gap: 26,
      opacity: o,
      background: '#fff'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, React.createElement("span", {
    style: kickerS
  }, "Main finding"), React.createElement("span", {
    style: {
      font: `700 38px/1.1 ${DISPLAY}`,
      color: C.ink,
      letterSpacing: '-0.015em'
    }
  }, "Semantic competence is ahead of perceptual precision")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      flex: 1
    }
  }, FIND.map(([title, sub, color, pts], ci) => {
    const cs = b.s + 0.6 + ci * 1.4;
    return React.createElement("div", {
      key: title,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        opacity: MOTION.enter(0, 1, cs, cs + 0.4)(T)
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        borderTop: `4px solid ${color}`,
        paddingTop: 14,
        marginBottom: 4
      }
    }, React.createElement("span", {
      style: {
        font: `700 28px/1.1 ${SANS}`,
        color
      }
    }, title), React.createElement("span", {
      style: {
        font: `500 21px/1.2 ${SANS}`,
        color: C.muted
      }
    }, sub)), pts.map(([lead, det], i) => {
      const at = cs + 0.3 + i * 0.25;
      return React.createElement("div", {
        key: lead,
        style: {
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
          opacity: MOTION.enter(0, 1, at, at + 0.35)(T),
          transform: `translateX(${MOTION.enter(-12, 0, at, at + 0.45)(T)}px)`
        }
      }, React.createElement("span", {
        style: {
          width: 8,
          height: 8,
          borderRadius: 4,
          background: color,
          marginTop: 10,
          flex: '0 0 auto'
        }
      }), React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }
      }, React.createElement("span", {
        style: {
          font: `700 24px/1.25 ${SANS}`,
          color: C.ink
        }
      }, lead), React.createElement("span", {
        style: {
          font: `400 21px/1.3 ${SANS}`,
          color: C.ink2
        }
      }, det)));
    }));
  })));
}
function Seq({
  k,
  from,
  to,
  style,
  boxW,
  boxH
}) {
  const {
    T
  } = useComposition();
  const {
    sheet,
    n,
    cols,
    rows
  } = SEQ[k];
  const i = seqFrame(k, T, from, to);
  const a = GEO[k][0];
  let fw = boxW,
    fh = boxW / a;
  if (fh < boxH) {
    fh = boxH;
    fw = boxH * a;
  }
  return React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      ...style
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: (boxW - fw) / 2,
      top: (boxH - fh) / 2,
      width: fw,
      height: fh,
      overflow: 'hidden'
    }
  }, React.createElement("img", {
    src: `sheets/${sheet}.jpg`,
    style: {
      position: 'absolute',
      maxWidth: 'none',
      width: fw * cols,
      height: fh * rows,
      left: -(i % cols) * fw,
      top: -Math.floor(i / cols) * fh
    }
  })));
}
function RefTag({
  k,
  small
}) {
  const s = small ? 18 : 20;
  return React.createElement("span", {
    style: {
      width: s,
      height: s,
      borderRadius: 4,
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: `700 ${small ? 11 : 12}px/1 ${SANS}`,
      color: '#fff',
      background: k === 'S' ? C.refS : C.refH
    }
  }, k);
}
function MediaCard({
  B,
  end
}) {
  const {
    T
  } = useComposition();
  let g = GEO[MEDIA_OF[B[0].name]].slice();
  for (let i = 1; i < B.length; i++) {
    const prev = GEO[MEDIA_OF[B[i - 1].name]],
      next = GEO[MEDIA_OF[B[i].name]];
    if (T >= B[i].s - 0.4) g = prev.map((v, j) => MOTION.draw(v, next[j], B[i].s - 0.4, B[i].s + 0.4)(T));
  }
  const [aspect, cx, maxW] = g,
    maxH = 552,
    cy = 320;
  let w = maxW,
    h = maxW / aspect;
  if (h > maxH) {
    h = maxH;
    w = maxH * aspect;
  }
  const media = key => {
    let o = 0;
    B.forEach((b, idx) => {
      if (MEDIA_OF[b.name] !== key || T < b.s - 0.4 || T > b.e + 0.4) return;
      const prevSame = idx > 0 && MEDIA_OF[B[idx - 1].name] === key;
      const nextSame = !B[idx + 1] || MEDIA_OF[B[idx + 1].name] === key;
      const fi = idx === 0 || prevSame ? 1 : MOTION.draw(0, 1, b.s - 0.4, b.s + 0.4)(T);
      const fo = nextSame ? 1 : MOTION.draw(1, 0, b.e - 0.4, b.e + 0.4)(T);
      o = Math.max(o, Math.min(fi, fo));
    });
    return o;
  };
  const b = Object.fromEntries(B.map(x => [x.name, x]));
  const show = 1 - media('none');
  const push = (s, e) => `scale(${1 + 0.015 * clamp((T - s) / (e - s), 0, 1)})`;
  const seqs = [['cars', 'Detection'], ['rabbit', 'Segmentation'], ['depth', 'Depth'], ['fish', 'VideoSeg']];
  const dark = Math.max(...seqs.map(([s]) => media(s)));
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: cx - w / 2,
      top: cy - h / 2,
      width: w,
      height: h,
      opacity: show,
      transform: `translateX(${(1 - show) * 60}px)`,
      borderRadius: 18,
      overflow: 'hidden',
      background: '#fff',
      boxShadow: '0 30px 70px rgba(10,26,47,0.16), 0 2px 6px rgba(10,26,47,0.06)'
    }
  }, React.createElement(CoveragePanel, {
    b: b.Coverage,
    T: T,
    o: media('cov'),
    w: w,
    h: h
  }), React.createElement(TierMap, {
    b: b.Tiers,
    T: T,
    o: media('tiers')
  }), React.createElement(FindingPanel, {
    b: b.Finding,
    T: T,
    o: media('finding')
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: C.abyss,
      opacity: dark
    }
  }), seqs.map(([s, sec]) => {
    const [f, t] = playWin(b[sec]);
    return React.createElement(Seq, {
      key: s,
      k: s,
      from: f,
      to: t,
      boxW: w,
      boxH: h,
      style: {
        opacity: media(s),
        transform: push(b[sec].s, b[sec].e)
      }
    });
  }));
}
const kickerS = {
  font: `600 18px/1 ${SANS}`,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: C.tide
};
const headS = {
  font: `700 40px/1.08 ${DISPLAY}`,
  letterSpacing: '-0.015em',
  color: C.ink,
  margin: 0,
  textWrap: 'pretty'
};
const bodyS = {
  font: `400 22px/1.4 ${SANS}`,
  color: C.ink2,
  margin: 0,
  textWrap: 'pretty'
};
const subS = {
  font: `500 24px/1.3 ${SANS}`,
  color: C.ink2,
  margin: 0
};
function Block({
  o,
  children,
  T,
  s,
  center,
  wide
}) {
  const y = MOTION.enter(18, 0, s + 0.15, s + 0.85)(T);
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: wide ? 200 : 64,
      top: 44,
      bottom: 44,
      width: wide ? 1200 : 540,
      alignItems: wide ? 'center' : 'stretch',
      textAlign: wide ? 'center' : 'left',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: center ? 'center' : 'flex-start',
      gap: wide ? 18 : 14,
      opacity: o,
      transform: `translateY(${o > 0.999 ? 0 : y}px)`,
      pointerEvents: 'none'
    }
  }, children);
}
function Steps({
  k,
  b,
  T
}) {
  const [from, to] = playWin(b);
  const f = seqFrame(k, T, from, to);
  const cur = T < from ? -1 : stepOf(k, f);
  const st = SEQ[k].steps;
  const dense = st.length > 3;
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: dense ? 4 : 8,
      borderLeft: `2px solid ${C.line}`,
      marginLeft: 13,
      marginTop: 6
    }
  }, st.map(([sf, title, detail], i) => {
    const state = i < cur ? 'done' : i === cur ? 'now' : 'next';
    const nxt = i + 1 < st.length ? st[i + 1][0] : SEQ[k].n - 1;
    const prog = state === 'now' ? clamp((f - sf) / Math.max(1, nxt - sf), 0, 1) : state === 'done' ? 1 : 0;
    return React.createElement("div", {
      key: i,
      style: {
        position: 'relative',
        display: 'flex',
        gap: 14,
        padding: dense ? '3px 0' : '6px 0',
        alignItems: 'center',
        marginLeft: -15,
        opacity: state === 'next' ? 0.42 : 1
      }
    }, React.createElement("span", {
      style: {
        flex: '0 0 auto',
        width: 28,
        height: 28,
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        font: `700 14px/1 ${SANS}`,
        background: state === 'now' ? C.tide : state === 'done' ? '#dbe6f0' : C.paper,
        color: state === 'now' ? '#fff' : C.tide,
        border: `2px solid ${state === 'next' ? C.faint : C.tide}`,
        boxSizing: 'border-box'
      }
    }, i + 1), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        font: `${state === 'now' ? 700 : 600} ${dense ? 20 : 22}px/1.2 ${SANS}`,
        color: C.ink
      }
    }, title), (state === 'now' || !dense) && React.createElement("span", {
      style: {
        font: `400 ${dense ? 17 : 18}px/1.25 ${SANS}`,
        color: C.muted
      }
    }, detail), state === 'now' && React.createElement("span", {
      style: {
        height: 2,
        width: `${prog * 100}%`,
        background: C.tide,
        marginTop: 3,
        borderRadius: 1
      }
    })));
  }));
}
function Metric({
  items,
  T,
  at,
  tight
}) {
  const op = MOTION.enter(0, 1, at, at + 0.4)(T),
    sc = MOTION.pop(0.9, 1, at, at + 0.5)(T);
  return React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      opacity: op,
      transform: `scale(${sc})`,
      transformOrigin: 'left center',
      marginTop: tight ? 10 : 'auto',
      paddingTop: 14,
      borderTop: `1px solid ${C.line}`
    }
  }, items.map(([v, l, c]) => React.createElement("div", {
    key: l,
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, React.createElement("span", {
    style: {
      font: `700 44px/1 ${DISPLAY}`,
      color: c || C.pink,
      letterSpacing: '-0.02em'
    }
  }, v), React.createElement("span", {
    style: {
      font: `600 17px/1 ${SANS}`,
      color: C.muted,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  }, l))));
}
function Legend() {
  const dot = c => React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: c
    }
  });
  return React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      font: `500 19px/1 ${SANS}`,
      color: C.muted
    }
  }, React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, dot(C.pink), "GPT-6 Astra prediction"), React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, dot(C.green), "Ground truth"));
}
function Stat({
  n,
  label,
  T,
  at,
  big
}) {
  const v = Math.round(MOTION.draw(0, n, at, at + 1.1)(T));
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      opacity: MOTION.enter(0, 1, at, at + 0.4)(T),
      padding: '14px 0',
      borderTop: `1px solid ${C.line}`
    }
  }, React.createElement("span", {
    style: {
      font: `700 ${big ? 80 : 52}px/1 ${DISPLAY}`,
      color: C.ink,
      letterSpacing: '-0.02em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, v), React.createElement("span", {
    style: {
      font: `500 ${big ? 24 : 18}px/1.2 ${SANS}`,
      color: C.ink2
    }
  }, label));
}
const QUESTION = [['How much of '], ['computer vision', C.ink], [' is now accessible through a '], ['general-purpose interface', C.tide], [', and where do '], ['dedicated models', C.pink], [' remain necessary?']];
function TitleSlide({
  T,
  b
}) {
  const out = MOTION.draw(1, 0, b.e - 0.45, b.e)(T);
  const words = [];
  QUESTION.forEach(([txt, col]) => txt.split(/(?<= )/).forEach(w => words.push([w, col])));
  const qs = 1.0;
  const rule = MOTION.draw(0, 1, 0.5, 1.3)(T);
  const up = (a, d = 0.6) => ({
    opacity: MOTION.enter(0, 1, a, a + d)(T),
    transform: `translateY(${MOTION.enter(16, 0, a, a + d)(T)}px)`
  });
  return React.createElement("div", {
    style: {
      position: 'absolute',
      left: 120,
      right: 120,
      top: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 0,
      opacity: out
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 22,
      ...up(0.1)
    }
  }, React.createElement("span", {
    style: {
      font: `700 40px/1 ${DISPLAY}`,
      letterSpacing: '-0.02em',
      color: C.ink,
      whiteSpace: 'nowrap',
      flex: '0 0 auto'
    }
  }, React.createElement("span", {
    style: {
      color: C.tide
    }
  }, "Hard Vision,"), " Easy Vision"), React.createElement("span", {
    style: {
      font: `500 22px/1 ${SANS}`,
      color: C.muted,
      whiteSpace: 'nowrap'
    }
  }, "What GPT-6 Astra Reveals Across Computer Vision")), React.createElement("div", {
    style: {
      height: 2,
      width: `${rule * 100}%`,
      background: C.line,
      margin: '28px 0 36px'
    }
  }), React.createElement("span", {
    style: {
      ...kickerS,
      ...up(0.7, 0.4),
      marginBottom: 18
    }
  }, "Research question"), React.createElement("p", {
    style: {
      margin: 0,
      font: `700 56px/1.14 ${DISPLAY}`,
      letterSpacing: '-0.018em',
      color: C.ink2,
      maxWidth: 1240,
      textWrap: 'balance'
    }
  }, words.map(([w, col], i) => {
    const a = qs + i * 0.045;
    return React.createElement("span", {
      key: i,
      style: {
        display: 'inline-block',
        whiteSpace: 'pre',
        color: col || C.ink2,
        opacity: MOTION.enter(0, 1, a, a + 0.35)(T),
        transform: `translateY(${MOTION.enter(10, 0, a, a + 0.45)(T)}px)`
      }
    }, w);
  })));
}
function CoverageList({
  b,
  T
}) {
  const act = activeArea(T, b);
  return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      marginTop: 8
    }
  }, AREAS.map(([name,, caps], i) => {
    const on = i === act;
    const seen = act === -1 ? T > b.e - 0.6 : i <= act;
    return React.createElement("div", {
      key: name,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        padding: on ? '9px 14px' : '4px 14px',
        marginLeft: -14,
        borderRadius: 10,
        background: on ? '#e3edf6' : 'transparent',
        boxShadow: on ? `inset 4px 0 0 ${C.tide}` : 'none',
        opacity: on ? 1 : seen ? 0.8 : 0.45
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 12
      }
    }, React.createElement("span", {
      style: {
        width: 28,
        font: `700 18px/1 ${SANS}`,
        color: on ? C.tide : C.faint,
        fontVariantNumeric: 'tabular-nums'
      }
    }, String(i + 1).padStart(2, '0')), React.createElement("span", {
      style: {
        flex: 1,
        font: `${on ? 700 : 500} ${on ? 24 : 21}px/1.2 ${SANS}`,
        color: on ? C.tide : C.ink2
      }
    }, name)), on && React.createElement("span", {
      style: {
        marginLeft: 40,
        font: `500 18px/1.35 ${SANS}`,
        color: C.ink2
      }
    }, caps.join(' · ')));
  }));
}
function Piece() {
  const {
    T,
    CUES,
    authoredTotal
  } = useComposition();
  const end = authoredTotal;
  const B = useBounds(CUES, end);
  const b = Object.fromEntries(B.map(x => [x.name, x]));
  const o = n => win(T, b[n].s, b[n].e);
  const frameAt = (n, k, fi) => {
    const [f, t] = playWin(b[n]);
    return f + fi / (SEQ[k].n - 1) * (t - f);
  };
  return React.createElement("div", {
    "data-screen-label": `t=${Math.floor(T)}s`,
    style: {
      position: 'absolute',
      inset: 0,
      background: C.paper,
      overflow: 'hidden',
      fontFamily: SANS
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      left: 620,
      top: -200,
      width: 1100,
      height: 1100,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(42,161,179,0.10), rgba(42,161,179,0) 60%)',
      transform: `translateX(${-30 * Math.sin(T * 0.25)}px)`
    }
  }), React.createElement(MediaCard, {
    B: B,
    end: end
  }), React.createElement(TitleSlide, {
    T: T,
    b: b.Title
  }), React.createElement(Block, {
    o: o('Study'),
    T: T,
    s: b.Study.s,
    center: true,
    wide: true
  }, React.createElement("div", {
    style: kickerS
  }, "What we do"), React.createElement("h2", {
    style: {
      ...headS,
      fontSize: 52
    }
  }, "A systematic study of six frontier", React.createElement("br", null), "general-purpose models"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 250px)',
      columnGap: 44,
      marginTop: 14,
      textAlign: 'left'
    }
  }, React.createElement(Stat, {
    n: 6,
    label: "frontier models",
    big: true,
    T: T,
    at: b.Study.s + 0.4
  }), React.createElement(Stat, {
    n: 34,
    label: "capabilities",
    big: true,
    T: T,
    at: b.Study.s + 0.6
  }), React.createElement(Stat, {
    n: 55,
    label: "benchmarks",
    big: true,
    T: T,
    at: b.Study.s + 0.8
  }), React.createElement(Stat, {
    n: 9,
    label: "areas of vision",
    big: true,
    T: T,
    at: b.Study.s + 1.0
  })), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 8,
      opacity: MOTION.enter(0, 1, b.Study.s + 1.6, b.Study.s + 2.1)(T)
    }
  }, React.createElement("span", {
    style: {
      font: `600 22px/1.2 ${SANS}`,
      color: C.muted
    }
  }, "Compared with"), ['one another', 'specialist models', 'human performance'].map(t => React.createElement("span", {
    key: t,
    style: {
      font: `600 22px/1 ${SANS}`,
      color: C.tide,
      background: '#e3edf6',
      padding: '10px 16px',
      borderRadius: 8
    }
  }, t)))), React.createElement(Block, {
    o: o('Coverage'),
    T: T,
    s: b.Coverage.s,
    center: true
  }, React.createElement("div", {
    style: kickerS
  }, "Coverage"), React.createElement("h2", {
    style: {
      ...headS,
      fontSize: 34
    }
  }, "34 capabilities across nine areas of computer vision"), React.createElement(CoverageList, {
    b: b.Coverage,
    T: T
  })), React.createElement(Block, {
    o: o('Detection'),
    T: T,
    s: b.Detection.s,
    center: true
  }, React.createElement("div", {
    style: kickerS
  }, "2D grounding & segmentation"), React.createElement("h2", {
    style: headS
  }, "Dense Object Detection"), React.createElement("p", {
    style: subS
  }, "146 densely packed cars in one aerial image"), React.createElement("p", {
    style: bodyS
  }, "Boxes appear in the order GPT-6 Astra outputs them; the ground truth is overlaid at the end."), React.createElement(Legend, null), React.createElement(Metric, {
    items: [['89.1', 'Astra F1@0.5'], ['78.4', 'Specialist', C.muted]],
    T: T,
    at: b.Detection.s + 1.6,
    tight: true
  })), React.createElement(Block, {
    o: o('Segmentation'),
    T: T,
    s: b.Segmentation.s
  }, React.createElement("div", {
    style: kickerS
  }, "2D grounding & segmentation"), React.createElement("h2", {
    style: headS
  }, "Referring Segmentation"), React.createElement("p", {
    style: subS
  }, "\u201CThe rabbit on the woman's back\u201D"), React.createElement(Steps, {
    k: "rabbit",
    b: b.Segmentation,
    T: T
  }), React.createElement(Metric, {
    items: [['0.979', 'IoU vs. ground truth']],
    T: T,
    at: frameAt('Segmentation', 'rabbit', 53)
  })), React.createElement(Block, {
    o: o('Depth'),
    T: T,
    s: b.Depth.s
  }, React.createElement("div", {
    style: kickerS
  }, "3D perception & geometry"), React.createElement("h2", {
    style: headS
  }, "Monocular Depth Estimation"), React.createElement("p", {
    style: subS
  }, "The depth map is written as a program"), React.createElement(Steps, {
    k: "depth",
    b: b.Depth,
    T: T
  }), React.createElement(Metric, {
    items: [['0.111', 'AbsRel'], ['0.910', 'δ1']],
    T: T,
    at: frameAt('Depth', 'depth', 69)
  })), React.createElement(Block, {
    o: o('VideoSeg'),
    T: T,
    s: b.VideoSeg.s
  }, React.createElement("div", {
    style: kickerS
  }, "Video understanding"), React.createElement("h2", {
    style: headS
  }, "Video Object Segmentation"), React.createElement("p", {
    style: subS
  }, "Five instances tracked from a first-frame mask"), React.createElement(Steps, {
    k: "fish",
    b: b.VideoSeg,
    T: T
  }), React.createElement("p", {
    style: {
      ...bodyS,
      fontSize: 18
    }
  }, "Instance identities hold; precise boundaries and small parts drift across frames."), React.createElement(Metric, {
    items: [['85.5', 'J&F'], ['+26.6', 'vs. next-best model', C.tide]],
    T: T,
    at: frameAt('VideoSeg', 'fish', 40)
  })));
}
function FVVideo() {
  return React.createElement(CompositionStage, {
    width: 1600,
    height: 640,
    scenes: window.OM_SCENES,
    playback: window.OM_PLAYBACK,
    bg: C.paper
  }, React.createElement(Piece, null));
}
window.FVVideo = FVVideo;
window.__mount = function () {
  return React.createElement(FVVideo);
};