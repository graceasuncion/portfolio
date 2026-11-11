# Case studies

Every case study uses one shared layout plus one content file in this folder.

| Page | Content file |
| --- | --- |
| `thread-it.html` | `content/thread-it.js` |
| `automail.html` | `content/automail.js` |
| `paul-hom.html` | `content/paul-hom.js` |
| `case-study.html?p=<slug>` | any `content/<slug>.js` (for previewing) |

## Edit an existing case study

Open its content file and change the text. The `.html` page files hold no content.

## Add a new case study

1. Copy `content/example.js` to `content/<slug>.js`. Use lowercase letters, numbers and dashes, e.g. `forest-brawl`.
2. Fill in the fields. The comments at the top of `example.js` list every block type.
3. Set `showGuides: false` to hide the dashed authoring hints.
4. Preview it at `case-study.html?p=<slug>`.
5. To give it its own URL, copy `thread-it.html` to `<slug>.html`. Then change three things in the copy: `data-case-study="<slug>"`, the `<title>` and the description. That file is only ~30 lines and contains no content.
6. Link to it from `work.html` and `index.html`, and point the previous project's `next.href` at it.

## Quick reference

- `==phrase==` gives the accent highlighter, and `**phrase**` makes it bold.
- Any `text` can be an array of strings, one per paragraph.
- Every image or video needs `alt`. Use `decorative: true` only for purely decorative media.
- Add `width` and `height` (the image's pixel size) to every image. Otherwise the page jumps as images load, and side-menu links land in the wrong place.
- Leaving `src: ''` empty shows a labelled placeholder box.
- Sections are numbered automatically, and the side menu is built from `sections`.
- Usability markers are optional: `x`/`y` are percentages of the screen, measured to the marker's centre. Each marker's screen-reader label comes from the note with the same `kind` and `n`.
- Feature panels use `layout: 'wide'` for desktop screenshots. The default is a phone frame beside the text.
- Accent swatches from the mockup: `#2F5F7C`, `#6B52AE`, `#B5603F`, `#3F7A50`.
- Planet styles: `ring`, `moon`, `bands`, `spots`.

## Where things live

| File | What it's for |
| --- | --- |
| `case-study-assets/case-study.js` | Header and footer markup (copied from `index.html`), the nav links, "Now designing" status, email and LinkedIn, plus planet art and scroll behaviour |
| `case-study-assets/components.js` | Section components (KeyInsight, DecisionCards, UsabilityFinding, …) |
| `case-study-assets/case-study.css` | Case study styles. Header and footer styles come from the site's `styles.css` |

If you change the landing page's nav, status line or contact links, update `SITE` at the top of `case-study.js` too. The styles update by themselves, because both pages use `styles.css`.
