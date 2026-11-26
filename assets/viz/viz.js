/* Shared runtime for the project visualizations.
   - Scales the fixed-size .stage to fit the frame (size comes from the stage's CSS).
   - Plays a storyboard: elements with data-cue="S" get class "on" from second S of
     the loop (until data-off, or until the loop's closing fade). Loop length comes
     from <div class="stage" data-loop="SECONDS">.
   - Hover to play: at rest the visual shows a still, complete frame (data-rest, or
     loop - 1.5) with a small play icon. When embedded in the site, the page plays it
     while the pointer is anywhere over the project's row (postMessage {viz: "play"},
     {viz: "pause"}, {viz: "toggle"}). Opened on its own, hovering the frame plays it.
     On touch screens a tap toggles.
   - With reduced motion it never plays: it shows the still frame only.
   - Add #t=SECONDS to the URL to freeze the storyboard at that moment (for checking).
   - Frame-driven pieces: define window.vizFrame = function (t) {...} before this script;
     it is called with the loop time every frame while playing, and with the rest time
     for the still. */
(function () {
  var root = document.documentElement;
  var stage = document.querySelector(".stage");
  if (!stage) return;
  var W = stage.offsetWidth || 800, H = stage.offsetHeight || 400;

  function fit() {
    var s = Math.min(window.innerWidth / W, window.innerHeight / H);
    var x = (window.innerWidth - W * s) / 2, y = (window.innerHeight - H * s) / 2;
    stage.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")";
  }
  fit();
  window.addEventListener("resize", fit);

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover)").matches;
  var embedded = window.parent !== window;
  var T = parseFloat(stage.getAttribute("data-loop") || "12");
  var REST = parseFloat(stage.getAttribute("data-rest") || String(T - 1.5));
  var frameFn = typeof window.vizFrame === "function" ? window.vizFrame : null;
  var playing = false;

  function syncVideos() {
    document.querySelectorAll("video").forEach(function (v) {
      if (playing && !reduce) v.play().catch(function () {});
      else v.pause();
    });
  }

  if (reduce) {
    root.classList.add("idle");
    syncVideos();
    if (frameFn) frameFn(REST);
    return;
  }

  var fadeOut = T - 0.9;
  var cues = Array.prototype.map.call(document.querySelectorAll("[data-cue]"), function (el) {
    return {
      el: el,
      on: parseFloat(el.getAttribute("data-cue")),
      off: el.hasAttribute("data-off") ? parseFloat(el.getAttribute("data-off")) : fadeOut,
      state: null
    };
  });

  function apply(t) {
    for (var i = 0; i < cues.length; i++) {
      var c = cues[i], v = t >= c.on && t < c.off;
      if (v !== c.state) { c.el.classList.toggle("on", v); c.state = v; }
    }
    stage.style.setProperty("--t", t.toFixed(3));
    if (frameFn) frameFn(t);
  }

  root.classList.add("anim");

  var m = /[#&]t=([\d.]+)/.exec(window.location.hash);
  if (m) { root.classList.add("frozen"); apply(parseFloat(m[1])); return; }

  // Small play icon, shown while the visual is at rest.
  var hint = document.createElement("div");
  hint.className = "viz-hint" + (canHover ? "" : " touch") + (stage.getAttribute("data-hint") === "bottom-right" ? " br" : "");
  hint.setAttribute("aria-hidden", "true");
  document.body.appendChild(hint);

  var t = 0, last = 0;
  function rest() {
    playing = false;
    root.classList.add("idle");
    root.classList.remove("playing");
    apply(REST);
    syncVideos();
  }
  function play() {
    if (playing) return;
    playing = true;
    t = 0;
    last = performance.now();
    root.classList.remove("idle");
    root.classList.add("playing");
    apply(0);
    syncVideos();
  }
  rest();

  if (canHover && !embedded) {
    root.addEventListener("mouseenter", play);
    root.addEventListener("mouseleave", rest);
  }
  if (canHover && embedded) {
    // Tell the page when the pointer is over this frame, so moving between the
    // figure and the rest of its row never stops the animation.
    var tellPage = function (over) { try { window.parent.postMessage({ vizHover: over }, "*"); } catch (e) {} };
    root.addEventListener("mouseenter", function () { tellPage(true); });
    root.addEventListener("mouseleave", function () { tellPage(false); });
  }
  document.addEventListener("pointerup", function (e) {
    if (e.pointerType === "mouse") return;
    if (playing) rest(); else play();
  });
  window.addEventListener("message", function (e) {
    var cmd = e.data && e.data.viz;
    if (cmd === "play") play();
    else if (cmd === "pause") { if (playing) rest(); }
    else if (cmd === "toggle") { if (playing) rest(); else play(); }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && playing) rest();
  });

  function tick(now) {
    if (playing) {
      var dt = Math.max(0, Math.min(0.1, (now - last) / 1000));  // frame clock can trail play()
      last = now;
      t = (t + dt) % T;
      apply(t);
    }
    window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);
})();
