/* dc-lite: a tiny stand-in for the Claude Design animation runtime, so Hanoona's
   exported clips (GLaMM, Video-CoM, Parallel Tube Decoding) run on this site exactly
   as designed, driven by viz.js (play/pause, freeze, reduced motion).

   Provides the subset of animations-v3 the clips use: Easing, clamp,
   useComposition, CompositionStage, useTweaks (+ no-op Tweak* panels), and
   SyncVideo (a <video> kept in step with the clip clock).
   Needs React + ReactDOM (assets/viz/vendor) loaded first.
   Usage: load the compiled clip (which sets window.__mount), then dcMount(). */
(function () {
  var Easing = {
    linear: function (t) { return t; },
    easeInQuad: function (t) { return t * t; },
    easeOutQuad: function (t) { return t * (2 - t); },
    easeInOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    easeInCubic: function (t) { return t * t * t; },
    easeOutCubic: function (t) { t = t - 1; return t * t * t + 1; },
    easeInOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
    easeInSine: function (t) { return 1 - Math.cos((t * Math.PI) / 2); },
    easeOutSine: function (t) { return Math.sin((t * Math.PI) / 2); },
    easeInOutSine: function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
    easeOutBack: function (t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    easeInBack: function (t) { var c1 = 1.70158, c3 = c1 + 1; return c3 * t * t * t - c1 * t * t; }
  };
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  // interpolate / animate: same behaviour as animations-v3.
  function interpolate(input, output, ease) {
    ease = ease || Easing.linear;
    return function (t) {
      if (t <= input[0]) return output[0];
      if (t >= input[input.length - 1]) return output[output.length - 1];
      for (var i = 0; i < input.length - 1; i++) {
        if (t >= input[i] && t <= input[i + 1]) {
          var span = input[i + 1] - input[i];
          var local = span === 0 ? 0 : (t - input[i]) / span;
          var easeFn = Array.isArray(ease) ? (ease[i] || Easing.linear) : ease;
          return output[i] + (output[i + 1] - output[i]) * easeFn(local);
        }
      }
      return output[output.length - 1];
    };
  }
  function animate(o) {
    var from = o.from === undefined ? 0 : o.from, to = o.to === undefined ? 1 : o.to;
    var start = o.start === undefined ? 0 : o.start, end = o.end === undefined ? 1 : o.end;
    var ease = o.ease || Easing.easeInOutCubic;
    return function (t) {
      if (t <= start) return from;
      if (t >= end) return to;
      return from + (to - from) * ease((t - start) / (end - start));
    };
  }

  var Ctx = React.createContext(null);
  var value = { T: 0, CUES: {}, authoredTotal: 0, time: 0, duration: 0, playing: true };
  function useComposition() { return React.useContext(Ctx) || value; }
  function CompositionStage(props) {
    return React.createElement(Ctx.Provider, { value: value },
      React.createElement("div", { style: { position: "absolute", left: 0, top: 0, width: props.width, height: props.height, overflow: "hidden", background: props.bg } }, props.children));
  }
  function useTweaks(defaults) { return [defaults || {}, function () {}]; }
  function Nothing() { return null; }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var frozen = /[#&]t=/.test(window.location.hash);

  // A muted clip that follows the composition clock: it plays while its scene is
  // active and is re-synced if it drifts; otherwise it holds the requested frame.
  function SyncVideo(props) {
    var ref = React.useRef(null);
    React.useLayoutEffect(function () {
      var v = ref.current;
      if (!v) return;
      var t = Math.max(0, props.time || 0);
      v.playbackRate = props.rate || 1;
      if (reduce || frozen || !props.active) {
        if (!v.paused) v.pause();
        if (Math.abs(v.currentTime - t) > 0.04) { try { v.currentTime = t; } catch (e) {} }
        return;
      }
      if (Math.abs(v.currentTime - t) > 0.25) { try { v.currentTime = t; } catch (e) {} }
      if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    });
    return React.createElement("video", { ref: ref, src: props.src, muted: true, playsInline: true, preload: "auto", style: props.style });
  }

  Object.assign(window, {
    Easing: Easing, clamp: clamp, interpolate: interpolate, animate: animate,
    useComposition: useComposition, CompositionStage: CompositionStage,
    useTweaks: useTweaks, TweaksPanel: Nothing, TweakSection: Nothing, TweakToggle: Nothing,
    TweakRadio: Nothing, TweakColor: Nothing, SyncVideo: SyncVideo
  });

  // Mount the clip into .stage and hand viz.js a per-frame render function.
  // Scene timing follows animations-v3: each scene plays for `dur` seconds and may
  // be authored at a different length `nat`; T is the authored time.
  window.dcMount = function () {
    var scenes = JSON.parse(window.OM_SCENES || "[]");
    var sections = [], cues = {}, play = 0, auth = 0;
    scenes.forEach(function (s) {
      var nat = typeof s.nat === "number" && isFinite(s.nat) && s.nat > 0 ? s.nat : s.dur;
      sections.push({ playStart: play, dur: s.dur, authStart: auth, nat: nat });
      if (!Object.prototype.hasOwnProperty.call(cues, s.name)) cues[s.name] = Math.round(auth * 1000) / 1000;
      play += s.dur;
      auth += nat;
    });
    var total = Math.round(play * 1000) / 1000, authoredTotal = Math.round(auth * 1000) / 1000;
    function warp(t) {
      if (!sections.length) return t;
      var s = sections[sections.length - 1];
      for (var i = 0; i < sections.length; i++) { if (t < sections[i].playStart + sections[i].dur) { s = sections[i]; break; } }
      var local = Math.min(Math.max(t - s.playStart, 0), s.dur);
      return Math.min(s.authStart + (s.dur > 0 ? local * (s.nat / s.dur) : 0), authoredTotal);
    }
    var root = ReactDOM.createRoot(document.querySelector(".stage"));
    window.vizFrame = function (t) {
      value = { T: warp(t), CUES: cues, authoredTotal: authoredTotal, time: t, duration: total, playing: true };
      ReactDOM.flushSync(function () { root.render(window.__mount()); });
    };
  };
})();
