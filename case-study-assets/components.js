/* =====================================================================
   Case study template — components
   Each component is a function: (props, ctx) => HTML string.
   All content text is escaped. Inside text fields you can write
     ==phrase==   → Highlight (accent highlighter mark)
     **phrase**   → bold
   Any `text` field can also be an array of strings for several paragraphs.
===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function list(a) { return Array.isArray(a) ? a : []; }
  function many(v) { return Array.isArray(v) ? v : (v ? [v] : []); }

  /* Highlight + bold */
  function rich(v) {
    return esc(v)
      .replace(/==(.+?)==/g, '<strong class="hl">$1</strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
  function Highlight(p) { return '<strong class="hl">' + esc(p.text) + '</strong>'; }

  /* One or more paragraphs with a given class */
  function paras(v, cls) {
    return many(v).map(function (t) { return '<p class="' + cls + '">' + rich(t) + '</p>'; }).join('');
  }

  /* Media: image / gif / video, or a labelled placeholder when src is empty. */
  function Media(m, placeholder) {
    m = m || {};
    if (!m.src) {
      return '<span class="cs-placeholder" aria-hidden="true">[ ' + esc(m.placeholder || placeholder || 'IMAGE') + ' ]</span>';
    }
    if (!m.alt && !m.decorative) {
      console.warn('[case study] Missing alt text for', m.src);
    }
    var alt = m.decorative ? '' : (m.alt || '');
    var isVideo = m.type === 'video' || /\.(mp4|webm|mov)$/i.test(m.src);
    if (isVideo) {
      var auto = reduceMotion ? ' controls' : ' autoplay muted loop playsinline';
      return '<video src="' + esc(m.src) + '"' + auto + (m.poster ? ' poster="' + esc(m.poster) + '"' : '') +
        (alt ? ' aria-label="' + esc(alt) + '"' : ' aria-hidden="true"') + ' preload="metadata"></video>';
    }
    /* width/height let the browser reserve space before a lazy image loads,
       so the page (and side-menu jumps) don't shift around. */
    var size = m.width && m.height ? ' width="' + (+m.width) + '" height="' + (+m.height) + '"' : '';
    return '<img src="' + esc(m.src) + '" alt="' + esc(alt) + '"' + size + ' loading="lazy" decoding="async">';
  }
  function hasMedia(m) { return m && m.src ? ' has-media' : ''; }

  function Guide(text, ctx) {
    return text && ctx.showGuides ? '<p class="cs-guide">' + esc(text) + '</p>' : '';
  }

  /* ---------- Blocks ---------- */

  function Headline(p) { return '<h3 class="cs-h3">' + rich(p.text) + '</h3>'; }
  function Text(p) { return paras(p.text, 'cs-text'); }

  function Stats(p) {
    return '<ul class="cs-chips" aria-label="' + esc(p.label || 'Research methods') + '">' +
      list(p.items).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
  }

  function Quote(p) {
    return '<figure class="cs-quote"><blockquote>“' + rich(p.text) + '”</blockquote>' +
      (p.cite ? '<figcaption>— ' + esc(p.cite) + '</figcaption>' : '') + '</figure>';
  }

  function KeyInsight(p, ctx) {
    return '<aside class="cs-insight" aria-label="' + esc(p.label || 'Key insight') + '">' +
      '<span class="ascii" aria-hidden="true">' + esc(ctx.star) + '</span>' +
      '<span class="cs-insight-body"><span class="cs-insight-label">' + esc(p.label || 'KEY INSIGHT') + '</span>' +
      many(p.text).map(function (t) { return '<span class="cs-insight-text">' + rich(t) + '</span>'; }).join('') +
      '</span></aside>';
  }

  /* InfoCards: labelled cards (Context / Problem / Finding 1 …) */
  function Cards(p) {
    return (p.label ? '<p class="cs-list-label">' + esc(p.label) + '</p>' : '') +
      '<div class="cs-cards' + (list(p.items).length === 4 ? ' is-grid-2' : '') + '">' + list(p.items).map(function (c) {
      return '<div class="cs-card' + (c.full ? ' is-full' : '') + '">' +
        (c.label ? '<span class="cs-card-label">' + esc(c.label) + '</span>' : '') +
        (c.title ? '<h3 class="cs-card-title">' + rich(c.title) + '</h3>' : '') +
        paras(c.text, 'cs-card-text') +
        (list(c.bullets).length ? '<ul class="cs-bullets is-small">' + list(c.bullets).map(function (b) { return '<li><span>' + rich(b) + '</span></li>'; }).join('') + '</ul>' : '') +
        '</div>';
    }).join('') + '</div>';
  }

  /* Bullet list, optionally with a small caps label */
  function Bullets(p) {
    return (p.label ? '<p class="cs-list-label">' + esc(p.label) + '</p>' : '') +
      '<ul class="cs-bullets">' + list(p.items).map(function (b) { return '<li><span>' + rich(b) + '</span></li>'; }).join('') + '</ul>';
  }

  function DecisionCards(p) {
    function card(d, kept) {
      d = d || {};
      return '<div class="cs-decision ' + (kept ? 'is-kept' : 'is-cut') + '">' +
        '<span class="cs-decision-label">' + (kept ? 'ADOPTED' : 'EXPLORED') + '</span>' +
        '<div class="cs-decision-card">' +
          '<div class="cs-decision-head"><h3 class="cs-decision-title">' + rich(d.title) + '</h3>' +
          '<span class="cs-decision-verdict">' + (kept ? '✓ KEPT' : '× CUT') + '</span></div>' +
          paras(d.text, 'cs-decision-text') +
          (list(d.tags).length ? '<ul class="cs-principles">' + list(d.tags).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        '</div></div>';
    }
    return (p.question ? '<p class="cs-list-label">' + esc(p.question) + '</p>' : '') +
      '<div class="cs-decisions">' +
      many(p.explored).map(function (d) { return card(d, false); }).join('') +
      many(p.adopted).map(function (d) { return card(d, true); }).join('') + '</div>';
  }

  function MyRole(p) {
    return '<div class="cs-role"><span class="cs-role-tag">' + esc(p.label || 'MY ROLE') + '</span><p>' + rich(p.text) + '</p></div>';
  }

  /* Shift: "this moved from A to B" */
  function Shift(p) {
    var from = p.from || {}, to = p.to || {};
    return '<div class="cs-shift">' +
      '<div class="cs-shift-card"><span class="cs-card-label">' + esc(from.label) + '</span><span class="cs-shift-title">' + esc(from.title) + '</span></div>' +
      '<div class="cs-shift-arrow"><span aria-hidden="true">→</span>' + (p.caption ? '<span class="cs-shift-caption">' + esc(p.caption) + '</span>' : '<span class="sr-only">moved to</span>') + '</div>' +
      '<div class="cs-shift-card is-after"><span class="cs-card-label">' + esc(to.label) + '</span><span class="cs-shift-title">' + esc(to.title) + '</span></div>' +
      '</div>';
  }

  /* Link button (slide deck, Medium article …) */
  function Link(p) {
    var ext = /^https?:/.test(p.href || '');
    return '<a class="cs-link-btn" href="' + esc(p.href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' +
      esc(p.text) + ' →' + (ext ? '<span class="sr-only"> (opens in a new tab)</span>' : '') + '</a>';
  }

  /* UsabilityFinding — markers are matched to notes by kind + number so
     every marker gets a meaningful aria-label ("Problem 1: …"). */
  function UsabilityFinding(p, ctx) {
    var notes = list(p.notes);
    function noteFor(kind, n) {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].kind === kind && String(notes[i].n) === String(n)) return notes[i].text;
      }
      return '';
    }
    function screen(s, kind) {
      s = s || {};
      var markers = list(s.markers).map(function (m) {
        var word = kind === 'old' ? 'Problem ' : 'Fix ';
        var label = m.label || noteFor(kind, m.n);
        return '<span class="cs-marker is-' + kind + '" role="img" aria-label="' + esc(word + m.n + (label ? ': ' + String(label).replace(/==|\*\*/g, '') : '')) +
          '" style="left:' + esc(m.x) + ';top:' + esc(m.y) + '">' + esc(m.n) + '</span>';
      }).join('');
      return '<figure class="cs-screen' + (kind === 'new' ? ' is-new' : '') + hasMedia(s) + '">' +
        Media(s, kind === 'old' ? 'OLD SCREEN' : 'NEW SCREEN') + markers + '</figure>';
    }
    ctx.findingIndex = (ctx.findingIndex || 0) + 1;
    var num = p.n || pad(ctx.findingIndex);
    var even = list(p.old).length === list(p['new']).length;
    return '<div class="cs-panel cs-finding">' +
      '<h3 class="cs-panel-title"><span class="cs-panel-num">' + esc(num) + '</span><span class="cs-panel-name">' + rich(p.title) + '</span></h3>' +
      '<div class="cs-compare' + (even ? ' is-even' : '') + '">' +
        '<div class="cs-compare-old"><span class="cs-compare-label">OLD</span><div class="cs-screens">' +
          list(p.old).map(function (s) { return screen(s, 'old'); }).join('') + '</div></div>' +
        '<div class="cs-compare-new"><span class="cs-compare-label">NEW</span><div class="cs-screens">' +
          list(p['new']).map(function (s) { return screen(s, 'new'); }).join('') + '</div></div>' +
      '</div>' +
      '<ol class="cs-notes">' + notes.map(function (n) {
        var k = n.kind === 'new' ? 'new' : 'old';
        return '<li class="is-' + k + '"><span class="cs-note-num" aria-hidden="true">' + esc(n.n) + '</span>' +
          '<span class="cs-note-text"><span class="cs-note-tag">' + (k === 'old' ? 'OLD' : 'NEW') +
          '<span class="sr-only"> ' + (k === 'old' ? 'problem' : 'fix') + ' ' + esc(n.n) + ':</span></span>' + rich(n.text) + '</span></li>';
      }).join('') + '</ol></div>';
  }

  /* Figures — numbering continues through the whole page. */
  function Figures(p, ctx) {
    return (p.label ? '<p class="cs-list-label">' + esc(p.label) + '</p>' : '') +
      '<div class="cs-figures' + (list(p.items).length === 1 ? ' is-single' : '') + '">' + list(p.items).map(function (f) {
        ctx.figIndex = (ctx.figIndex || 0) + 1;
        return '<figure class="cs-figure"><div class="cs-figure-media' + hasMedia(f) + '">' + Media(f, 'IMAGE') + '</div>' +
          (f.caption ? '<figcaption>FIG. ' + pad(ctx.figIndex) + ' — ' + esc(f.caption) + '</figcaption>' : '') + '</figure>';
      }).join('') + '</div>';
  }

  /* FeaturePanel — alternates sides automatically.
     layout: 'phone' (default, side by side) | 'wide' (desktop screen below the copy) */
  function FeaturePanel(f, ctx, i) {
    var wide = f.layout === 'wide';
    return '<div class="cs-feature reveal' + (wide ? ' is-wide' : (i % 2 ? ' is-flipped' : '')) + '">' +
      '<div class="cs-feature-copy">' +
        '<h3 class="cs-panel-title"><span class="cs-panel-num">' + esc(f.n || pad(i + 1)) + '</span><span class="cs-panel-name">' + rich(f.name) + '</span></h3>' +
        paras(f.text, 'cs-feature-text') +
        (list(f.bullets).length ? '<ul class="cs-bullets">' + list(f.bullets).map(function (b) { return '<li><span>' + rich(b) + '</span></li>'; }).join('') + '</ul>' : '') +
      '</div>' +
      '<figure class="' + (wide ? 'cs-wide-media' : 'cs-phone') + hasMedia(f.media) + '">' + Media(f.media, 'SCREEN / GIF') + '</figure></div>';
  }
  function Features(p, ctx) {
    return list(p.items).map(function (f, i) { return FeaturePanel(f, ctx, i); }).join('');
  }

  function ResultCards(p) {
    return '<ul class="cs-results">' + list(p.items).map(function (r) {
      return '<li><span class="cs-result-value">' + esc(r.value) + '</span><span class="cs-result-label">' + esc(r.label) + '</span></li>';
    }).join('') + '</ul>';
  }

  function NextSteps(p) {
    return '<ol class="cs-steps">' + list(p.items).map(function (s, i) {
      return '<li><span class="cs-step-n" aria-hidden="true">' + pad(i + 1) + '</span><span class="cs-step-text">' + rich(s) + '</span></li>';
    }).join('') + '</ol>';
  }

  function Reflection(p) {
    return '<div class="cs-reflection">' +
      '<div class="cs-reflect is-worked"><h3>WHAT WORKED</h3>' + paras(p.worked, '') + '</div>' +
      '<div class="cs-reflect is-different"><h3>WHAT I’D DO DIFFERENTLY</h3>' + paras(p.different, '') + '</div>' +
      '</div>' + (p.team ? '<p class="cs-team">TEAM · ' + esc(p.team) + '</p>' : '');
  }

  /* Takeaways: numbered lessons (01 — title, text) */
  function Takeaways(p) {
    return '<ol class="cs-takeaways">' + list(p.items).map(function (t, i) {
      return '<li><h3 class="cs-takeaway-title"><span class="cs-step-n">' + pad(i + 1) + '</span>' + rich(t.title) + '</h3>' + paras(t.text, 'cs-text') + '</li>';
    }).join('') + '</ol>';
  }

  function Note(p) { return '<p class="cs-caption-note">' + esc(p.text) + '</p>'; }

  var BLOCKS = {
    headline: Headline, text: Text, stats: Stats, quote: Quote, keyInsight: KeyInsight,
    cards: Cards, bullets: Bullets, shift: Shift, link: Link,
    decisionCards: DecisionCards, myRole: MyRole, usabilityFinding: UsabilityFinding,
    figures: Figures, features: Features, results: ResultCards, nextSteps: NextSteps,
    reflection: Reflection, takeaways: Takeaways, note: Note,
    guide: function (p, ctx) { return Guide(p.text, ctx); }
  };

  /* SectionHeading + body. The number comes from the section's order. */
  function Section(s, ctx, index) {
    var blocks = list(s.blocks);
    var hasFeatures = blocks.some(function (b) { return b.type === 'features'; });
    var body = blocks.map(function (b) {
      var fn = BLOCKS[b.type];
      if (!fn) { console.warn('[case study] Unknown block type:', b.type); return ''; }
      return fn(b, ctx);
    }).join('');
    var headingId = s.id + '-title';
    /* Reveal runs per block (see .cs-section-body > * in the CSS), so long
       sections never sit half-transparent while being read. */
    return '<section id="' + esc(s.id) + '" class="cs-section" aria-labelledby="' + headingId + '">' +
      '<span class="cs-num" aria-hidden="true">' + pad(index + 1) + '</span>' +
      '<div class="cs-section-body' + (hasFeatures ? ' is-wide' : '') + '">' +
        '<h2 class="cs-h2" id="' + headingId + '"><span class="sr-only">' + pad(index + 1) + ' </span>' + esc(s.title || s.label) + '</h2>' +
        Guide(s.guide, ctx) + body +
      '</div></section>';
  }

  window.CaseStudyComponents = {
    esc: esc, rich: rich, pad: pad, list: list, Media: Media, Guide: Guide,
    Highlight: Highlight, Section: Section, BLOCKS: BLOCKS
  };
})();
