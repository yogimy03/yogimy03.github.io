/* ============================================================
   main.js - renders content from DATA, runs the lens toggle,
   the route rail, reveals, filters, and keyboard shortcuts.
   ============================================================ */

(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const email = () => DATA.site.emailUser + "@" + DATA.site.emailDomain;

  /* ---------- link buttons: empty string = no button ---------- */
  const LINK_LABELS = {
    code: "view code", demo: "live demo", paper: "read paper", doi: "doi",
    writeup: "writeup", letter: "view letter", badge: "view badge",
    certificate: "view certificate", verify: "verify credential"
  };
  function linksHTML(links) {
    if (!links) return "";
    const out = Object.entries(links)
      .filter(([, url]) => url && url.trim() !== "")
      .map(([k, url]) =>
        '<a href="' + url + '" target="_blank" rel="noopener">' + (LINK_LABELS[k] || k) + "</a>")
      .join("");
    return out ? '<div class="card-links">' + out + "</div>" : "";
  }

  const chipsHTML = (items) =>
    '<div class="chips">' + items.map(i => '<span class="chip">' + i + "</span>").join("") + "</div>";

  /* ---------- icons ---------- */
  const ICONS = {
    mail: '<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V10.2H5.67v8.14h2.67zM7 8.99a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.35v-4.46c0-2.39-1.28-3.5-2.98-3.5-1.37 0-1.99.76-2.33 1.29v-1.47H10.4c.04.75 0 8.14 0 8.14h2.63v-4.55c0-.24.02-.49.09-.66.19-.47.62-.96 1.35-.96.95 0 1.34.73 1.34 1.79v4.38h2.53z"/></svg>',
    github: '<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>'
  };
  function socialIcons() {
    return (
      '<a href="mailto:' + email() + '" aria-label="email">' + ICONS.mail + "</a>" +
      '<a href="' + DATA.site.linkedin + '" target="_blank" rel="noopener" aria-label="linkedin">' + ICONS.linkedin + "</a>" +
      '<a href="' + DATA.site.github + '" target="_blank" rel="noopener" aria-label="github">' + ICONS.github + "</a>"
    );
  }

  /* ---------- render: hero extras ---------- */
  $("#heroIcons").innerHTML = socialIcons();

  /* ---------- render: experience (both bullet sets, lens shows one) ---------- */
  const bulletList = (items, cls) =>
    '<ul class="' + cls + '">' + items.map(b => "<li>" + b + "</li>").join("") + "</ul>";

  $("#timeline").innerHTML = DATA.experience.map(e =>
    '<div class="t-item reveal">' +
      '<div class="t-when">' + e.period + "<br>" + e.where + "</div>" +
      '<div class="t-card">' +
        '<div class="t-role"><span class="t-co">' + e.company + '</span><span class="t-sep">·</span>' + e.role + "</div>" +
        bulletList(e.bullets.build, "b-build") +
        bulletList(e.bullets.break, "b-break") +
      "</div>" +
    "</div>"
  ).join("");

  /* ---------- render: projects + filters ---------- */
  const TAGS = ["all", "software", "security", "ai", "cloud", "data", "research"];
  $("#filters").innerHTML = TAGS.map((t, i) =>
    '<button class="f-chip' + (i === 0 ? " active" : "") + '" data-tag="' + t + '">' + t + "</button>"
  ).join("");

  $("#projectGrid").innerHTML = DATA.projects.map(p =>
    '<article class="card reveal" data-tags="' + p.tags.join(" ") + '">' +
      '<div class="card-top"><span class="tile">' + p.tile + "</span><h3>" + p.title + "</h3></div>" +
      '<p class="why">' + p.why + "</p>" +
      '<p class="desc">' + p.desc + "</p>" +
      '<div class="dual">' +
        '<p class="dual-line d-build"><span class="d-tag">build</span>' + p.build + "</p>" +
        '<p class="dual-line d-break"><span class="d-tag">break</span>' + p.secure + "</p>" +
      "</div>" +
      chipsHTML(p.stack) +
      linksHTML(p.links) +
    "</article>"
  ).join("");

  $("#earlier").innerHTML =
    "<h3>// earlier work</h3>" +
    DATA.earlierWork.map(w =>
      '<p class="earlier-item"><b>' + w.title + "</b> · " + w.line + "</p>"
    ).join("");

  $("#filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".f-chip");
    if (!btn) return;
    $$(".f-chip").forEach(c => c.classList.toggle("active", c === btn));
    const tag = btn.dataset.tag;
    $$("#projectGrid .card").forEach(card => {
      const show = tag === "all" || card.dataset.tags.split(" ").includes(tag);
      card.classList.toggle("hidden", !show);
    });
    requestAnimationFrame(layoutRail);
  });

  /* ---------- render: skills ---------- */
  $("#skillGroups").innerHTML = DATA.skills.map((g, i) =>
    '<div class="sgroup reveal" data-i="' + i + '">' +
      '<div class="sgroup-name">' + g.group + "</div>" +
      chipsHTML(g.items) +
    "</div>"
  ).join("");

  function orderSkills(lens) {
    $$(".sgroup").forEach(el => {
      const g = DATA.skills[Number(el.dataset.i)];
      el.style.order = lens === "break" ? g.orderBreak : g.orderBuild;
    });
  }

  /* ---------- render: publications ---------- */
  $("#pubList").innerHTML = DATA.publications.map(p =>
    '<div class="pub reveal">' +
      '<span class="pub-tag">' + p.venueTag + "</span>" +
      "<h3>" + p.title + "</h3>" +
      '<p class="pub-authors">' + p.authors.replace("Yogi M.", "<b>Yogi M.</b>") + "</p>" +
      '<p class="pub-cite">' + p.cite + "</p>" +
      (p.abstract
        ? '<details class="pub-abs"><summary>abstract</summary><p>' + p.abstract + "</p></details>"
        : "") +
      linksHTML(p.links) +
    "</div>"
  ).join("");

  /* ---------- render: education ---------- */
  $("#eduList").innerHTML = DATA.education.map(e =>
    '<div class="edu reveal">' +
      "<h3>" + e.school + "</h3>" +
      '<p class="edu-degree">' + e.degree + "</p>" +
      '<div class="edu-meta"><span class="edu-gpa">GPA ' + e.gpa + "</span><span>" + e.period + "</span><span>" + e.where + "</span></div>" +
      (e.note ? '<p class="edu-note">' + e.note + "</p>" : "") +
      "<details><summary>coursework (" + e.coursework.length + ")</summary>" + chipsHTML(e.coursework) + "</details>" +
    "</div>"
  ).join("");

  /* ---------- render: credentials + leadership ---------- */
  $("#credList").innerHTML = DATA.credentials.map(c =>
    '<div class="b-item reveal"><h4>' + c.title + "</h4><p>" + c.line + "</p>" + linksHTML(c.links) + "</div>"
  ).join("");

  $("#leadList").innerHTML = DATA.leadership.map(l =>
    '<div class="b-item reveal"><h4>' + l.title + "</h4><p>" + l.line + "</p></div>"
  ).join("");

  /* ---------- render: contact (icons carry the weight, no address repeated) ---------- */
  $("#contactActions").innerHTML =
    '<div class="hero-icons icons-lg">' + socialIcons() + "</div>";

  /* ---------- lens toggle ---------- */
  const TAGLINES = {
    build: "I build production systems and the pipelines that ship them.",
    break: "I find the failure modes before they find production."
  };
  const SCRAMBLE_CHARS = "!<>-_/[]{}=+*^?#01";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scrambleTimer = null;

  function scrambleTo(el, target) {
    if (reducedMotion) { el.textContent = target; return; }
    clearInterval(scrambleTimer);
    let frame = 0;
    const total = 16;
    scrambleTimer = setInterval(() => {
      frame++;
      const settled = Math.floor((frame / total) * target.length);
      let out = target.slice(0, settled);
      for (let i = settled; i < target.length; i++) {
        out += target[i] === " " ? " "
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      el.textContent = out;
      if (frame >= total) { el.textContent = target; clearInterval(scrambleTimer); }
    }, 28);
  }

  /* ---------- resume artifact: follows the lens, names its edition ---------- */
  const PDF_ICON =
    '<svg viewBox="0 0 24 24" class="ra-icon"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8.5 13.5c0-.83.67-1.5 1.5-1.5h.5a1.5 1.5 0 0 1 0 3H10v1.5H8.5v-3zm5 0V17H15c1.1 0 2-.9 2-2v-1c0-.83-.67-1.5-1.5-1.5h-2zm1.5 2.5v-1h.5v1H15z"/></svg>';

  function renderResume() {
    const lens = document.documentElement.dataset.lens;
    const links = DATA.site.resumeLinks;
    const other = lens === "build" ? "break" : "build";
    $$("[data-resume-slot]").forEach(slot => {
      if (!links.build && !links.break) { slot.innerHTML = ""; slot.style.display = "none"; return; }
      slot.style.display = "";
      // prefer the active lens edition; fall back honestly if it is not posted
      const useLens = links[lens] ? lens : other;
      let note;
      if (links.build && links.break) {
        note = '<button class="ra-flip mono" data-flip="' + other + '">need the ' + other + " edition? flip the lens</button>";
      } else {
        note = '<span class="ra-note mono">the ' + useLens + " edition is the one online right now</span>";
      }
      slot.innerHTML =
        '<button type="button" class="resume-art ra-' + useLens + '" data-open-resume="' + useLens + '">' +
          PDF_ICON +
          '<span class="ra-file">resume_' + useLens + ".pdf</span>" +
          '<span class="ra-tag">' + useLens + " edition</span>" +
          '<span class="ra-dl">preview</span>' +
        "</button>" + note;
    });
  }

  /* ---------- resume preview modal ---------- */
  const modal = $("#resumeModal");

  function openResume(lens) {
    const links = DATA.site.resumeLinks;
    const url = links[lens];
    if (!url) return;
    const other = lens === "build" ? "break" : "build";
    $("#rmFile").textContent = "resume_" + lens + ".pdf";
    const tag = $("#rmTag");
    tag.textContent = lens + " edition";
    tag.className = "ra-tag rt-" + lens;
    $("#rmDownload").href = url;
    const sw = $("#rmSwitch");
    if (links[other]) {
      sw.hidden = false;
      sw.textContent = "view " + other + " edition";
      sw.onclick = () => { setLens(other, true); openResume(other); };
    } else {
      sw.hidden = true;
    }
    $("#rmBody").innerHTML =
      '<iframe src="' + url + '#view=FitH" title="resume preview" loading="lazy"></iframe>';
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $("#rmClose").focus();
  }

  function closeResume() {
    modal.hidden = true;
    $("#rmBody").innerHTML = "";
    document.body.style.overflow = "";
  }

  $("#rmClose").addEventListener("click", closeResume);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeResume(); });

  document.addEventListener("click", (e) => {
    const flip = e.target.closest("[data-flip]");
    if (flip) { setLens(flip.dataset.flip, true); return; }
    const open = e.target.closest("[data-open-resume]");
    if (open) openResume(open.dataset.openResume);
  });

  function setLens(lens, animate) {
    document.documentElement.dataset.lens = lens;
    try { localStorage.setItem("lens", lens); } catch (e) { /* private mode, fine */ }
    // keep the URL shareable: ?lens=build / ?lens=break always reflects the view
    try {
      const u = new URL(location.href);
      u.searchParams.set("lens", lens);
      history.replaceState(null, "", u);
    } catch (e) { /* old browser, fine */ }
    $$(".lens-btn").forEach(b =>
      b.setAttribute("aria-pressed", String(b.dataset.setLens === lens)));
    const tag = $("#tagline");
    if (animate) scrambleTo(tag, TAGLINES[lens]);
    else tag.textContent = TAGLINES[lens];
    orderSkills(lens);
    renderResume();
    // let the ambient field recolor, and run a "recompiling" sweep
    document.dispatchEvent(new CustomEvent("lenschange"));
    if (animate && window.FX) window.FX.sweep();
  }

  $$(".lens-btn").forEach(b =>
    b.addEventListener("click", () => setLens(b.dataset.setLens, true)));

  // lens priority: ?lens= in the URL (shared links) > saved choice > build
  let savedLens = "build";
  try { savedLens = localStorage.getItem("lens") || "build"; } catch (e) { /* fine */ }
  const urlLens = new URLSearchParams(location.search).get("lens");
  if (urlLens === "build" || urlLens === "break") savedLens = urlLens;
  setLens(savedLens === "break" ? "break" : "build", false);

  /* ---------- hero name: hex inspector on hover ----------
     Letters near the cursor light up and a floating readout shows the
     hovered letter's byte value, like running a hexdump under a
     magnifier. Reacts instantly, no timers, nothing to wait out. */
  (() => {
    const nameEl = $(".hero-name");
    if (!nameEl || reducedMotion) return;
    const text = nameEl.textContent;
    nameEl.textContent = "";
    nameEl.setAttribute("aria-label", text);
    const holder = document.createElement("span");
    holder.className = "name-letters";
    holder.setAttribute("aria-hidden", "true");
    nameEl.appendChild(holder);
    const letters = Array.from(text).map(ch => {
      const s = document.createElement("span");
      s.className = "ltr" + (ch === " " ? " sp" : "");
      s.textContent = ch;
      holder.appendChild(s);
      return s;
    });
    // the readout lives OUTSIDE the h1: a positioned element inside a
    // background-clip:text heading would break the gradient painting
    const readout = document.createElement("span");
    readout.className = "hex-readout mono";
    readout.setAttribute("aria-hidden", "true");
    readout.hidden = true;
    nameEl.insertAdjacentElement("afterend", readout);
    const wrap = nameEl.closest(".wrap");

    const R2 = 70 * 70;
    nameEl.addEventListener("pointermove", (e) => {
      let best = null, bestD = Infinity;
      letters.forEach(s => {
        if (s.classList.contains("sp")) return;
        const r = s.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = dx * dx + dy * dy;
        s.classList.toggle("hex", d < R2);
        if (d < bestD) { bestD = d; best = s; }
      });
      if (best && bestD < R2) {
        const r = best.getBoundingClientRect();
        const w = wrap.getBoundingClientRect();
        readout.textContent = best.textContent + " · 0x" +
          best.textContent.codePointAt(0).toString(16).toUpperCase();
        readout.style.left = (r.left + r.width / 2 - w.left) + "px";
        readout.style.top = (r.top - w.top - 30) + "px";
        readout.hidden = false;
      } else {
        readout.hidden = true;
      }
    });
    nameEl.addEventListener("pointerleave", () => {
      letters.forEach(s => s.classList.remove("hex"));
      readout.hidden = true;
    });
  })();

  /* ---------- burger menu ---------- */
  const navLinks = $("#navLinks");
  const burger = $("#burger");
  function setMenu(open) {
    navLinks.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  }
  burger.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") setMenu(false);
  });

  /* ---------- the route HUD ----------
     A fixed pipeline tracker on the left edge. It never scrolls away:
     stages you have passed stay filled, the current stage glows, and
     the packet rides the line with scroll. Click a stage to jump. */
  const rail = $("#rail");
  const packet = rail.querySelector(".rail-packet");
  const fill = rail.querySelector(".rail-fill");
  const progress = $("#progress");
  const sections = $$("[data-stage]");
  let nodes = [];
  let sectionTops = [];

  function buildNodes() {
    nodes = sections.map((sec, i) => {
      const el = document.createElement("div");
      el.className = "rail-node";
      el.style.top = (i / (sections.length - 1) * 100) + "%";
      el.innerHTML = '<span class="rail-label">' +
        String(i + 1).padStart(2, "0") + " " + sec.dataset.stage + "</span>" +
        '<span class="rail-check">✓ pass</span>' +
        '<span class="rail-run">▸ run</span>';
      el.addEventListener("click", () => sec.scrollIntoView({ behavior: "smooth" }));
      rail.appendChild(el);
      return { el, sec };
    });
  }

  function layoutRail() {
    sectionTops = sections.map(sec => sec.getBoundingClientRect().top + window.scrollY);
    updateRail();
  }

  // the packet stretches with scroll velocity, like motion blur
  let lastScrollY = window.scrollY, lastScrollT = performance.now(), settleTimer = null;

  function updateRail() {
    const docH = document.documentElement.scrollHeight;
    const winH = window.innerHeight;
    const max = docH - winH;
    const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    const hudH = rail.clientHeight;
    const last = sectionTops.length - 1;

    // a stage counts as passed once its section crosses mid-viewport
    const marker = window.scrollY + winH * 0.45;
    let current = 0;
    nodes.forEach((n, i) => {
      const passed = marker >= sectionTops[i];
      n.el.classList.toggle("lit", passed);
      if (passed) current = i;
    });
    // completed stages get a test-runner check; the current one shows
    // as running until the next stage takes over (or the page ends)
    const allDone = p >= 0.995;
    nodes.forEach((n, i) => {
      const lit = n.el.classList.contains("lit");
      n.el.classList.toggle("now", i === current);
      n.el.classList.toggle("done", lit && (i !== current || allDone));
    });

    // packet position interpolates between the nodes themselves, so it
    // always sits between the stages that are actually on screen
    const segStart = sectionTops[current];
    const segEnd = current < last ? sectionTops[current + 1] : docH - winH * 0.55;
    let frac = (marker - segStart) / Math.max(segEnd - segStart, 1);
    frac = Math.min(Math.max(frac, 0), 1);
    const packetY = Math.min((current + frac) / last, 1) * hudH;

    let stretch = 1;
    if (!reducedMotion) {
      const now = performance.now();
      const dt = Math.max(now - lastScrollT, 1);
      const velocity = Math.abs(window.scrollY - lastScrollY) / dt; // px per ms
      lastScrollY = window.scrollY;
      lastScrollT = now;
      stretch = 1 + Math.min(velocity * 0.4, 1.8);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        packet.style.transform = "translateY(" + packetY + "px) scaleY(1)";
      }, 130);
    }
    packet.style.transform = "translateY(" + packetY + "px) scaleY(" + stretch.toFixed(2) + ")";
    fill.style.height = packetY + "px";

    progress.style.transform = "scaleX(" + p + ")";
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { updateRail(); ticking = false; });
    }
  }, { passive: true });

  window.addEventListener("resize", layoutRail);
  window.addEventListener("load", layoutRail);
  // re-measure when content height changes (coursework <details>, filters, fonts)
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => layoutRail()).observe(document.body);
  }
  document.addEventListener("toggle", () => layoutRail(), true);

  buildNodes();
  layoutRail();

  /* ---------- reveal on scroll (with a per-group stagger) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => {
    // cascade siblings in the same container by ~55ms each (capped)
    const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains("reveal"));
    const idx = Math.max(sibs.indexOf(el), 0);
    el.style.setProperty("--rd", Math.min(idx, 6) * 55 + "ms");
    io.observe(el);
  });

  /* ---------- keyboard shortcuts ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!modal.hidden) closeResume();
      setMenu(false);
      return;
    }
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
    if (typing) return;
    if (e.key === "l" || e.key === "L") {
      const next = document.documentElement.dataset.lens === "build" ? "break" : "build";
      setLens(next, true);
    }
    if (e.key === "/") {
      e.preventDefault();
      API.focusInput();
    }
  });

  /* ---------- console ---------- */
  API.init();

  /* ============================================================
     EFFECTS ENGINE — amplify / immersive / experimental layers.
     All progressive: guarded by reduced-motion, pointer, and
     screen-size checks, and paused when the tab is hidden.
     ============================================================ */
  (() => {
    const finePointer = window.matchMedia("(pointer:fine)").matches;
    const smallScreen = window.matchMedia("(max-width:760px)").matches;

    /* ---- count-up hero stats ---- */
    function countUp(el) {
      const raw = el.textContent.trim();
      if (reducedMotion || !/^\d+(\.\d+)?$/.test(raw)) return;
      const target = parseFloat(raw);
      const dec = (raw.split(".")[1] || "").length;
      const dur = 1100;
      let startT = null;
      function step(t) {
        if (startT === null) startT = t;
        const p = Math.min((t - startT) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * e).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = raw;
      }
      el.textContent = (0).toFixed(dec);
      requestAnimationFrame(step);
    }
    let statsRan = false;
    function runStats() {
      if (statsRan) return;
      statsRan = true;
      document.querySelectorAll("#heroStats b").forEach(countUp);
    }
    const statsEl = document.getElementById("heroStats");
    if (statsEl) {
      const so = new IntersectionObserver((ents) => {
        ents.forEach(en => { if (en.isIntersecting) { runStats(); so.disconnect(); } });
      }, { threshold: 0.4 });
      so.observe(statsEl);
    }

    /* ---- magnetic buttons + icons ---- */
    function magnetize(el, s) {
      el.classList.add("magnetic");
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - (r.left + r.width / 2)) * s;
        const my = (e.clientY - (r.top + r.height / 2)) * s;
        el.style.transform = "translate(" + mx.toFixed(1) + "px," + my.toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    }

    /* ---- 3D tilt on project cards ---- */
    function tilt(card) {
      card.classList.add("tilt");
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" +
          (px * 7).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    }

    /* ---- soft glow that follows the pointer ---- */
    function initCursor() {
      const cur = document.createElement("div");
      cur.id = "fx-cursor";
      document.body.appendChild(cur);
      let raf = 0, x = 0, y = 0;
      window.addEventListener("pointermove", (e) => {
        x = e.clientX; y = e.clientY;
        cur.style.opacity = "1";
        if (!raf) raf = requestAnimationFrame(() => {
          cur.style.transform = "translate(" + x + "px," + y + "px)";
          raf = 0;
        });
      }, { passive: true });
      window.addEventListener("blur", () => { cur.style.opacity = "0"; });
    }

    /* ---- ambient data field: falling glyphs + packet network ---- */
    function initField() {
      const canvas = document.createElement("canvas");
      canvas.id = "fx-field";
      document.body.insertBefore(canvas, document.body.firstChild);
      const ctx = canvas.getContext("2d");
      const GLYPHS = "01<>{}[]/#x9a3f7c".split("");
      const mouse = { x: -9999, y: -9999 };
      const STEP = 28, ROW = 20, TAIL = 7;
      let W, H, DPR, cols, streams, nodes, packets = [], accRGB = "93,169,255";

      function hexToRGB(h) {
        h = (h || "").trim().replace("#", "");
        if (h.length === 3) h = h.split("").map(c => c + c).join("");
        if (h.length < 6) return accRGB;
        const n = parseInt(h, 16);
        return isNaN(n) ? accRGB : ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255);
      }
      function recolor() {
        accRGB = hexToRGB(getComputedStyle(document.documentElement).getPropertyValue("--acc"));
      }
      recolor();
      document.addEventListener("lenschange", recolor);

      function resize() {
        DPR = Math.min(window.devicePixelRatio || 1, 1.5);
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = Math.floor(W * DPR);
        canvas.height = Math.floor(H * DPR);
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        cols = Math.ceil(W / STEP);
        streams = new Array(cols).fill(0).map(() => {
          const y = -Math.random() * H;
          return {
            y: y, sp: 0.9 + Math.random() * 1.2, lastRow: Math.floor(y / ROW),
            glyphs: Array.from({ length: 2 + (Math.random() * (TAIL - 2) | 0) }, rnd)
          };
        });
        const count = Math.min(56, Math.floor(W * H / 30000));
        nodes = new Array(count).fill(0).map(() => ({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16
        }));
        packets = [];
      }

      const rnd = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

      function frame() {
        ctx.clearRect(0, 0, W, H);
        // slow falling character streams: glyphs stay stable between row-steps
        // so they read as code, not flickering dots. Head is brightest; the
        // tail fades. A stream near the pointer lights up in the lens color.
        ctx.font = "13px 'JetBrains Mono', monospace";
        for (let i = 0; i < cols; i++) {
          const s = streams[i];
          s.y += s.sp;
          const row = Math.floor(s.y / ROW);
          if (row !== s.lastRow) {          // advanced a row: shift in a new head glyph
            s.lastRow = row;
            s.glyphs.unshift(rnd());
            if (s.glyphs.length > TAIL) s.glyphs.pop();
          }
          const x = i * STEP + 5;
          for (let k = 0; k < s.glyphs.length; k++) {
            const gy = s.y - k * ROW;
            if (gy < -ROW || gy > H + ROW) continue;
            const fade = 1 - k / TAIL;
            const near = Math.abs(x - mouse.x) < 110 && Math.abs(gy - mouse.y) < 150;
            if (k === 0) {
              ctx.fillStyle = near ? "rgba(" + accRGB + ",0.98)" : "rgba(200,214,234,0.6)";
            } else {
              const a = ((near ? 0.55 : 0.24) * fade).toFixed(3);
              ctx.fillStyle = near ? "rgba(" + accRGB + "," + a + ")" : "rgba(140,160,188," + a + ")";
            }
            ctx.fillText(s.glyphs[k], x, gy);
          }
          if (s.y - TAIL * ROW > H) {        // whole stream cleared the bottom: respawn
            s.y = -Math.random() * H * 0.6 - ROW;
            s.sp = 0.9 + Math.random() * 1.2;
            s.lastRow = Math.floor(s.y / ROW);
            s.glyphs = Array.from({ length: 2 + (Math.random() * (TAIL - 2) | 0) }, rnd);
          }
        }
        // network
        for (const n of nodes) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
        }
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
            if (d2 < 16900) {
              const al = 0.12 * (1 - Math.sqrt(d2) / 130);
              ctx.strokeStyle = "rgba(" + accRGB + "," + al.toFixed(3) + ")";
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
        for (const n of nodes) {
          const near = Math.abs(n.x - mouse.x) < 150 && Math.abs(n.y - mouse.y) < 150;
          ctx.fillStyle = near ? "rgba(" + accRGB + ",0.9)" : "rgba(120,140,170,0.30)";
          ctx.beginPath(); ctx.arc(n.x, n.y, near ? 2.3 : 1.4, 0, 6.2832); ctx.fill();
        }
        // traveling packets
        if (packets.length < 7 && Math.random() > 0.93 && nodes.length > 2) {
          const a = nodes[(Math.random() * nodes.length) | 0];
          const b = nodes[(Math.random() * nodes.length) | 0];
          if (a !== b) packets.push({ a, b, t: 0, sp: 0.007 + Math.random() * 0.011 });
        }
        ctx.shadowBlur = 8;
        for (let k = packets.length - 1; k >= 0; k--) {
          const p = packets[k]; p.t += p.sp;
          if (p.t >= 1) { packets.splice(k, 1); continue; }
          const x = p.a.x + (p.b.x - p.a.x) * p.t;
          const y = p.a.y + (p.b.y - p.a.y) * p.t;
          ctx.shadowColor = "rgba(" + accRGB + ",0.9)";
          ctx.fillStyle = "rgba(" + accRGB + ",0.95)";
          ctx.beginPath(); ctx.arc(x, y, 1.9, 0, 6.2832); ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      let running = false, rafId = 0, rzTimer = 0;
      function loop() { frame(); rafId = requestAnimationFrame(loop); }
      function start() { if (!running) { running = true; loop(); } }
      function stop() { running = false; cancelAnimationFrame(rafId); }

      window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
      window.addEventListener("resize", () => { clearTimeout(rzTimer); rzTimer = setTimeout(resize, 200); });
      document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });

      resize();
      start();
    }

    /* ---- recompiling sweep on lens change (public hook) ---- */
    const sweepEl = document.createElement("div");
    sweepEl.id = "lens-sweep";
    document.body.appendChild(sweepEl);
    window.FX = {
      sweep() {
        if (reducedMotion) return;
        sweepEl.classList.remove("go");
        void sweepEl.offsetWidth;
        sweepEl.classList.add("go");
      }
    };

    /* ---- skippable route intro (once per tab session) ---- */
    function routeIntro() {
      if (reducedMotion) { runStats(); return; }
      if (location.hash) return;
      try { if (sessionStorage.getItem("introSeen")) return; } catch (e) { /* fine */ }
      const stages = Array.from(document.querySelectorAll("[data-stage]")).map(s => s.dataset.stage);
      const overlay = document.createElement("div");
      overlay.id = "route-intro";
      overlay.setAttribute("role", "status");
      const lines = stages.map((s, i) =>
        '<div class="ri-line"><span class="ri-hop">[' + String(i + 1).padStart(2, "0") +
        ']</span><span class="ri-name">' + s + '</span><span class="ri-ok">ok</span></div>'
      ).join("");
      overlay.innerHTML =
        '<div class="ri-box">' +
          '<div class="ri-title"><span class="ri-dot"></span>trace --route yogi.makadiya</div>' +
          lines +
          '<div class="ri-final">route established · ' + stages.length + ' hops · 0 packets dropped</div>' +
        "</div>" +
        '<button class="ri-skip" type="button">skip ›</button>';
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";

      const lineEls = Array.from(overlay.querySelectorAll(".ri-line"));
      const finalEl = overlay.querySelector(".ri-final");
      let idx = 0, done = false, timer = 0;
      function reveal() {
        if (idx < lineEls.length) {
          lineEls[idx].classList.add("on");
          idx++;
          timer = setTimeout(reveal, 105);
        } else {
          finalEl.classList.add("on");
          timer = setTimeout(finish, 640);
        }
      }
      function finish() {
        if (done) return;
        done = true;
        clearTimeout(timer);
        overlay.classList.add("done");
        document.body.style.overflow = "";
        try { sessionStorage.setItem("introSeen", "1"); } catch (e) { /* fine */ }
        setTimeout(() => overlay.remove(), 700);
        runStats();
      }
      overlay.querySelector(".ri-skip").addEventListener("click", finish);
      overlay.addEventListener("click", (e) => { if (e.target === overlay) finish(); });
      const onKey = () => { finish(); document.removeEventListener("keydown", onKey); };
      document.addEventListener("keydown", onKey);
      setTimeout(reveal, 280);
    }

    /* ---- wire it all up ---- */
    routeIntro();
    if (!reducedMotion) {
      const grain = document.createElement("div");
      grain.id = "fx-grain";
      grain.setAttribute("aria-hidden", "true");
      document.body.appendChild(grain);
    }
    if (finePointer && !reducedMotion) {
      document.querySelectorAll(".hero-actions .btn").forEach(b => magnetize(b, 0.25));
      document.querySelectorAll(".hero-icons a").forEach(a => magnetize(a, 0.3));
      document.querySelectorAll("#projectGrid .card").forEach(tilt);
    }
    if (finePointer && !reducedMotion && !smallScreen) {
      initField();
      initCursor();
    }
  })();

  /* ---------- a note for the curious ---------- */
  console.log(
    "%c<y/> you opened devtools. correct instinct.\n" +
    "the API sandbox is in js/api.js. there is a flag.\n" +
    "GET /v1/contact when you are done.",
    "color:#5da9ff;font-family:monospace;font-size:12px;line-height:1.7"
  );
})();
