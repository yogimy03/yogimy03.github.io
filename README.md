# trace the route · a portfolio for people who build and break software

A single-page portfolio with a story: the visitor is a packet traveling through a pipeline.
A glowing packet rides a rail down the page as you scroll, lighting up nine "hops"
(init, build, ship, link, sign, train, verify, probe, connect). A **lens toggle** reframes
the whole site for software audiences (`build`) or security audiences (`break`), and a
**career API console** lets visitors query the resume like an HTTP API, complete with a
WAF, honeypot routes, and a hidden flag.

No frameworks, no build step, no trackers. Plain HTML, CSS, and JavaScript.

## Live demo

[yogimy03.github.io](https://yogimy03.github.io) (your fork will live at `https://USERNAME.github.io`)

## Host it on GitHub Pages (3 steps)

1. Create a **public** repository named exactly `USERNAME.github.io`
   (replace `USERNAME` with your GitHub username).
2. Put these files in the repository root and push:

   ```bash
   git init
   git add .
   git commit -m "portfolio"
   git branch -M main
   git remote add origin https://github.com/USERNAME/USERNAME.github.io.git
   git push -u origin main
   ```

3. Open the repo on GitHub: **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**.

That is it. The site goes live at `https://USERNAME.github.io` within a minute or two.
There is no build step: what you push is what gets served.

## Preview locally

```bash
# from the project folder, either:
python3 -m http.server 8000     # then open http://localhost:8000
# or just double-click index.html
```

## Editing content

Almost everything lives in **`js/data.js`**. You should rarely need to touch anything else.

| What | Where |
|---|---|
| Name, email, socials, location | `DATA.site` |
| Resume PDFs (one per lens) | `DATA.site.resumeLinks` |
| Jobs and bullets (one set per lens) | `DATA.experience` |
| Project cards | `DATA.projects` |
| Smaller one-line projects | `DATA.earlierWork` |
| Skill groups and lens ordering | `DATA.skills` |
| Publications | `DATA.publications` |
| Degrees and coursework | `DATA.education` |
| Certificates and scholarships | `DATA.credentials` |
| Leadership roles | `DATA.leadership` |
| Hero name/tagline/intro text | `index.html` (hero section) and `TAGLINES` in `js/main.js` |

### Adding links (the auto-hide trick)

Every project, publication, and credential has a `links` object:

```js
links: { code: "", demo: "", paper: "" }
```

Leave a value as `""` and that button **does not render at all**, so cards without
links never look like something is missing. Paste a URL and the button appears.
No other change needed.

### The lens toggle

The `<html data-lens>` attribute switches between `build` and `break`. It swaps the
accent colors (CSS variables in `css/style.css`), the hero tagline, the experience
bullets (each job has a `build` set and a `break` set in `js/data.js`), the
highlighted line on each project card, the resume edition, and the ordering of
skill groups. Visitors can also press `L`.

**Shareable lenses:** the URL always carries the current lens as `?lens=build` or
`?lens=break`. Send someone `https://USERNAME.github.io/?lens=break` and the site
opens in security mode, with the break resume front and center. A link with
`?lens=build` does the same for the software side.

### The resume artifact

Set one or both URLs in `DATA.site.resumeLinks`. The easiest option: drop your
PDFs into `assets/` and point the links at `assets/resume_build.pdf` and
`assets/resume_break.pdf` (same-origin files preview most reliably).

The row renders as a file named `resume_build.pdf` or `resume_break.pdf` with a
colored edition tag, so nobody ever wonders which version they grabbed. It
follows the active lens. Clicking it opens an in-page preview of the PDF with a
download button and a one-click switch to the other edition. If only one
edition is filled in, the row says so honestly. If both are empty, it hides
completely.

### The API console

All routes live in `js/api.js`. It is a pure client-side sandbox: nothing leaves the
browser. Things worth knowing:

- Documented routes are listed in `docsBody()`.
- Honeypot paths (`/admin`, `/.env`, ...) and the WAF rules are near the top.
- The flag lives at `/v1/flag`. Change the flag string before you ship,
  otherwise everyone gets the same one.
- `POST /v1/hire` is the only allowed write. As it should be.

### The route rail

Sections are tagged with `data-stage` in `index.html`. Add or remove a section and
the rail re-numbers its hops automatically. The rail shows on screens 1280px and
wider; smaller screens get a slim gradient progress bar instead.

### Motion and effects

There is an ambient layer behind the content that stays out of the way: a slow
"data field" of falling characters plus a drifting node-and-packet network, a
pointer-following glow, magnetic buttons, a subtle 3D tilt on project cards,
count-up hero stats, and a one-time-per-tab **route intro** that traces the nine
hops before revealing the page (press any key or hit **skip** to dismiss). The
lens switch runs a quick "recompiling" sweep.

All of it is progressive: it needs JavaScript, pauses when the tab is hidden,
turns off on small screens and coarse-pointer (touch) devices, and is fully
disabled for anyone with `prefers-reduced-motion`. Type is **Chakra Petch**
(display), **Space Grotesk** (body), and **JetBrains Mono** (terminal/readouts),
all loaded from Google Fonts.

## File map

```
index.html        page structure and hero copy
404.html          themed "packet dropped" page (GitHub Pages serves it automatically)
css/style.css     all styling, both lens palettes
js/data.js        ALL content. edit this one.
js/api.js         the career API sandbox
js/main.js        rendering, lens, rail, shortcuts
assets/favicon.svg
```

## A note on privacy

The site is static and client-side only. The email address is stored split in
`data.js` and assembled at runtime, which filters out the laziest scrapers. If you
fork this, remember that anything in a public repo is public, even if a button for
it is hidden.

## License

Take it, fork it, make it yours. A link back is appreciated but not required.
