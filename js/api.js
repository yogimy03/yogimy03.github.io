/* ============================================================
   api.js - the career API sandbox.
   Runs entirely in the browser. No network calls, no telemetry.
   Routes are generated from DATA (see data.js).
   ============================================================ */

const API = (() => {

  const email = () => DATA.site.emailUser + "@" + DATA.site.emailDomain;
  const randHex = (n) => Array.from({ length: n }, () =>
    "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");

  /* ---------- rate limiting (for the over-enthusiastic) ---------- */
  let hits = [];
  function rateLimited() {
    const now = Date.now();
    hits = hits.filter(t => now - t < 30000);
    hits.push(now);
    return hits.length > 12;
  }

  /* ---------- WAF: greatest hits collection ---------- */
  const WAF_RULES = [
    { re: /<\s*script|onerror\s*=|javascript:/i, rule: "941100", kind: "XSS probe" },
    { re: /union\s+select|'\s*or\s*'?1'?\s*=\s*'?1|;\s*--|sleep\s*\(/i, rule: "942100", kind: "SQLi probe" },
    { re: /\.\.\/|\.\.%2f|%00|\/etc\/shadow/i, rule: "930100", kind: "path traversal" },
    { re: /\$\{jndi:/i, rule: "944150", kind: "log4shell. in 2026. respect." }
  ];

  /* ---------- route table ---------- */

  function docsBody() {
    return {
      service: "yogi-api/3.0",
      documented_routes: [
        "GET /v1/profile", "GET /v1/experience", "GET /v1/projects?tag={tag}",
        "GET /v1/skills", "GET /v1/publications", "GET /v1/education",
        "GET /v1/credentials", "GET /v1/leadership", "GET /v1/resume", "GET /v1/contact",
        "GET /v1/status", "POST /v1/hire"
      ],
      undocumented_routes: "[redacted]",
      note: "every section of this page maps to one of these."
    };
  }

  const ROUTES = {
    "/v1/profile": () => ({
      name: DATA.site.name,
      titles: ["Software Engineer", "Security Engineer"],
      stance: "refuses to pick one",
      location: DATA.site.location,
      status: "open_to_work",
      education: "M.Eng Cybersecurity, University of Maryland (GPA 3.93)",
      lens_active: document.documentElement.dataset.lens,
      see_also: ["GET /v1/experience", "GET /v1/contact"]
    }),

    "/v1/experience": () => {
      const lens = document.documentElement.dataset.lens;
      return {
        lens: lens,
        note: "highlights follow the active lens. flip it for the other story.",
        roles: DATA.experience.map(e => ({
          company: e.company,
          role: e.role,
          period: e.period,
          highlights: e.bullets[lens]
        }))
      };
    },

    "/v1/projects": (query) => {
      let list = DATA.projects;
      const tag = (query.tag || "").toLowerCase();
      if (tag) list = list.filter(p => p.tags.includes(tag));
      if (tag && list.length === 0) {
        return { results: [], hint: "valid tags: software, security, ai, cloud, data, research" };
      }
      return list.map(p => ({
        name: p.title,
        tags: p.tags,
        stack: p.stack,
        tldr: p.why
      }));
    },

    "/v1/skills": () => Object.fromEntries(
      DATA.skills.map(g => [g.group, g.items])
    ),

    "/v1/publications": () => DATA.publications.map(p => ({
      venue: p.venueTag,
      title: p.title,
      citation: p.cite
    })),

    "/v1/education": () => DATA.education.map(e => ({
      school: e.school,
      degree: e.degree,
      gpa: e.gpa,
      period: e.period
    })),

    "/v1/credentials": () => DATA.credentials.map(c => {
      const out = { title: c.title, detail: c.line };
      const links = Object.entries(c.links || {})
        .filter(([, url]) => url && url.trim() !== "");
      if (links.length) out.links = Object.fromEntries(links);
      return out;
    }),

    "/v1/leadership": () => DATA.leadership.map(l => l.title),

    "/v1/resume": () => {
      const L = DATA.site.resumeLinks;
      return {
        editions: {
          build: L.build || "not published yet",
          break: L.break || "not published yet"
        },
        note: "two editions, one person. the download button on the page follows your lens.",
        tip: "open this site with ?lens=build or ?lens=break to preselect one"
      };
    },

    "/v1/contact": () => ({
      email: email(),
      linkedin: DATA.site.linkedin,
      github: DATA.site.github,
      phone: "disabled in prod. email works.",
      response_time: "faster than most health checks"
    }),

    "/v1/status": () => ({
      status: "operational",
      open_to_offers: true,
      incidents_open: 0,
      coffee_level: "nominal",
      current_focus: "building things, then trying to break them",
      uptime: "since 1999"
    }),

    "/v1/docs": docsBody,
    "/docs": docsBody,
    "/": () => ({ service: "yogi-api/3.0", docs: "GET /v1/docs", hint: "or just scroll. the UI is decent." }),

    "/v1/flag": () => ({
      flag: "flag{tr4c3d_th3_r0ut3_f0und_th3_fl4g}",
      note: "mention this flag when you email me. instant credibility.",
      contact: "GET /v1/contact"
    })
  };

  const HONEYPOTS = {
    "/admin":          "an admin panel. on a static site. the optimism is admirable.",
    "/wp-admin":       "not wordpress. the 2000s called, they want their attack surface back.",
    "/.env":           "no secrets here. the whole site is client-side, you are already reading the source.",
    "/.git":           "the repo is literally public on github. front door is open, no need for the window.",
    "/.git/config":    "the repo is literally public on github. front door is open, no need for the window.",
    "/etc/passwd":     "path traversal against a browser sandbox. bold strategy.",
    "/phpmyadmin":     "no php, no mysql, no admin. three strikes.",
    "/v1/secrets":     "the only secret here is /v1/flag, and now you know it exists."
  };

  /* ---------- request handling ---------- */

  function parsePath(raw) {
    const [path, qs] = raw.split("?");
    const query = {};
    (qs || "").split("&").forEach(kv => {
      const [k, v] = kv.split("=");
      if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
    return { path: path.replace(/\/+$/, "") || "/", query };
  }

  function handle(method, rawPath) {
    const input = method + " " + rawPath;

    // WAF first, like in real life
    for (const w of WAF_RULES) {
      if (w.re.test(rawPath)) {
        return resp(403, "Forbidden", {
          error: "request blocked by WAF",
          rule: "OWASP CRS " + w.rule,
          matched: w.kind,
          note: "good instinct. wrong target."
        });
      }
    }

    if (rateLimited()) {
      return resp(429, "Too Many Requests", {
        error: "rate limited",
        note: "easy there, scanner. a human reads slower than this.",
        retry_after: "30s"
      });
    }

    const { path, query } = parsePath(rawPath.trim());

    // honeypots respond regardless of method
    if (HONEYPOTS[path] !== undefined) {
      return resp(403, "Forbidden", {
        error: "forbidden",
        path: path,
        note: HONEYPOTS[path],
        logged: true,
        siem: "just kidding. it is a static site. but I respect the initiative."
      });
    }

    if (path === "/v1/coffee") {
      return resp(418, "I'm a teapot", { error: "i am a teapot", rfc: "RFC 2324", short: "and stout" });
    }

    if (path === "/robots.txt") {
      return resp(200, "OK",
        "User-agent: *\nDisallow: /admin\nDisallow: /v1/flag\n\n# telling crawlers where not to look has never once worked",
        "text/plain");
    }

    // method gates
    if (method === "POST" && path === "/v1/hire") {
      return resp(201, "Created", {
        message: "interest registered. resource is available for allocation.",
        next_step: "email " + email(),
        response_sla: "under 24 hours",
        note: "yes, this endpoint exists purely so someone can say they hired me over an API."
      });
    }
    if (method === "DELETE" && (path === "/v1/career" || path === "/v1/experience")) {
      return resp(403, "Forbidden", { error: "career is append-only", note: "like a good audit log." });
    }
    if (method !== "GET") {
      return resp(405, "Method Not Allowed", {
        error: "method not allowed",
        allow: "GET",
        exception: "POST /v1/hire",
        note: "read-only API. like prod on a friday afternoon."
      });
    }

    const handler = ROUTES[path];
    if (handler) return resp(200, "OK", handler(query));

    return resp(404, "Not Found", {
      error: "route not found",
      path: path,
      hint: "GET /v1/docs lists everything. well, almost everything."
    });
  }

  function resp(status, statusText, body, type) {
    return { status, statusText, body, type: type || "application/json" };
  }

  /* ---------- rendering ---------- */

  const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function colorize(json) {
    return escapeHtml(json).replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|\bnull\b|-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)/g,
      (m) => {
        let cls = "j-num";
        if (/^"/.test(m)) cls = /:$/.test(m) ? "j-key" : "j-str";
        else if (/^(true|false)$/.test(m)) cls = "j-bool";
        else if (/^null$/.test(m)) cls = "j-null";
        return '<span class="' + cls + '">' + m + "</span>";
      }
    );
  }

  function statusClass(code) {
    if (code < 300) return "r-status-ok";
    if (code === 418 || code === 429) return "r-status-warn";
    return "r-status-err";
  }

  let form, methodSel, pathInput, pane, statusEl;

  function send(method, rawPath) {
    if (!pane) return;
    methodSel.value = method;
    pathInput.value = rawPath;
    statusEl.textContent = "sending...";
    pane.innerHTML = '<span class="resp-dim"># resolving ' + escapeHtml(rawPath) + " ...</span>";

    const latency = 70 + Math.floor(Math.random() * 220);
    setTimeout(() => {
      const r = handle(method, rawPath);
      const reqId = randHex(12);
      const isText = r.type === "text/plain";
      const bodyStr = isText ? r.body : JSON.stringify(r.body, null, 2);

      const lines = [
        '<span class="r-head">$ ' + escapeHtml(method + " " + rawPath) + "</span>",
        "",
        'HTTP/1.1 <span class="' + statusClass(r.status) + '">' + r.status + " " + r.statusText + "</span>",
        '<span class="r-head">content-type: ' + r.type + "</span>",
        '<span class="r-head">server: yogi-api/3.0</span>',
        '<span class="r-head">x-request-id: ' + reqId + "</span>",
        '<span class="r-head">x-response-time: ' + latency + "ms</span>",
        '<span class="r-head">x-powered-by: caffeine and threat models</span>',
        "",
        isText ? escapeHtml(bodyStr) : colorize(bodyStr)
      ];
      pane.innerHTML = lines.join("\n");
      statusEl.textContent = r.status + " " + r.statusText.toUpperCase() + " · " + latency + "ms";
      pane.scrollTop = 0;
    }, latency);
  }

  const HINTS = [
    ["GET", "/v1/docs"],
    ["GET", "/v1/projects?tag=security"],
    ["GET", "/v1/contact"],
    ["GET", "/robots.txt"],
    ["POST", "/v1/hire"]
  ];

  function init() {
    form = document.getElementById("reqForm");
    methodSel = document.getElementById("reqMethod");
    pathInput = document.getElementById("reqPath");
    pane = document.getElementById("respPane");
    statusEl = document.getElementById("consoleStatus");
    const chips = document.getElementById("hintChips");

    HINTS.forEach(([m, p]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hint-chip";
      b.textContent = m + " " + p;
      b.addEventListener("click", () => send(m, p));
      chips.appendChild(b);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const p = pathInput.value.trim() || "/";
      send(methodSel.value, p.startsWith("/") ? p : "/" + p);
    });

    const hireBtn = document.getElementById("hireShortcut");
    if (hireBtn) {
      hireBtn.addEventListener("click", () => {
        document.getElementById("console").scrollIntoView({ behavior: "smooth" });
        setTimeout(() => send("POST", "/v1/hire"), 600);
      });
    }
  }

  function focusInput() {
    document.getElementById("console").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => pathInput && pathInput.focus(), 500);
  }

  return { init, send, focusInput };
})();
