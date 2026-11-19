/* =====================================================================
   Case study template — page logic
   1. Loads content/<slug>.js   (?p=<slug>, defaults to "example")
   2. Renders the page with components.js
   3. Draws the site header + footer (same markup as index.html)
   4. Scroll fallbacks, IntersectionObserver side menu
===================================================================== */
(function () {
  'use strict';

  /* ---------- Site-wide settings (same for every case study) ----------
     The header and footer copy the landing page (index.html). If you
     change the nav, status line or contact links there, change them here too. */
  var SITE = {
    status: 'LOOKING FOR FULL-TIME ROLES',
    email: 'gracehasuncion@gmail.com',
    linkedin: 'https://www.linkedin.com/in/gracehasuncion/',
    year: 2026,
    workHref: 'work.html',
    titleSuffix: ' | Grace Asuncion',
    nav: [
      { label: 'Work', href: 'work.html', current: true },
      { label: 'Play', href: 'play.html' },
      { label: 'About', href: 'about.html' },
      { label: 'Contact', href: '#contact' }
    ],
    /* Shown as "More case studies" at the bottom of each case study (the
       current one is left out). Keep in sync with the cards on work.html. */
    caseStudies: [
      { name: 'Thread.It', href: 'thread-it.html', cover: 'media/thread.it-cover.png', alt: 'Thread.It app screens',
        headline: 'Turning decision fatigue into a structured 4-step planning flow.', meta: 'Product Designer · 2026' },
      { name: 'Automail', href: 'automail.html', cover: 'media/automail-cover.png', alt: 'AutoMail app screens',
        headline: 'Streamlining fragmented email workflows into one scalable tool.', meta: 'Product Designer · 2024' },
      { name: 'Paul Hom Asian Clinic', href: 'paul-hom.html', cover: 'media/paul%20hom-cover.png', alt: 'Paul Hom Asian Clinic website screens',
        headline: 'Improving accessibility for elderly patients in a clinic website redesign.', meta: 'Product Designer · 2024' }
    ]
  };

  var C = window.CaseStudyComponents;
  var esc = C.esc, rich = C.rich, list = C.list;
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STAR = '   .   \n   :   \n.:+*+:.\n   :   \n   \'   ';

  /* ---------- Colour helpers (ported from the mockup) ---------- */
  function hexToInt(hex) {
    var h = String(hex || '#2F5F7C').replace('#', '');
    if (h.length === 3) { h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; }
    var n = parseInt(h, 16);
    return isNaN(n) ? 0x2F5F7C : n;
  }
  function soft(hex, alpha) {
    var n = hexToInt(hex);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + alpha + ')';
  }
  function lighten(hex, amt) {
    var n = hexToInt(hex);
    var f = function (v) { var s = Math.round(v + (255 - v) * amt).toString(16); return s.length < 2 ? '0' + s : s; };
    return '#' + f((n >> 16) & 255) + f((n >> 8) & 255) + f(n & 255);
  }

  /* ---------- ASCII art (ported from the mockup) ---------- */
  function track(count) {
    var glyphs = ['.', '·', '.', ':', '.', '·', "'", '.'];
    var out = [];
    for (var i = 0; i < count; i++) {
      var t = (i / count) * Math.PI * 2;
      out.push({ x: (50 + 50 * Math.cos(t)).toFixed(3) + '%', y: (50 + 50 * Math.sin(t)).toFixed(3) + '%', ch: (i % 17 === 0) ? '' : glyphs[(i * 7) % glyphs.length] });
    }
    return out;
  }

  function planet(rows, cols, kind, flip) {
    var pal = ['.', ':', ':', '-', '=', '+', '*', '#'];
    var ringed = kind === 'ring', moon = kind === 'moon';
    var W = ringed ? Math.round(cols * 1.9) : (moon ? cols + 6 : cols);
    var H = ringed ? rows + 2 : rows;
    var cx = ringed ? (W - 1) / 2 : (cols - 1) / 2, cy = (H - 1) / 2;
    var mx = cols + 3, my = 1.2, rc = cols / 2, rr = rows / 2;
    var a = -14 * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    var sgn = flip ? 1 : -1;
    var lines = [];
    for (var r = 0; r < H; r++) {
      var line = '';
      for (var c = 0; c < W; c++) {
        var px = (c - cx) / rc, py = (r - cy) / rr, d = px * px + py * py, ch = ' ';
        if (d <= 1) {
          if (d > 0.8) { ch = ':'; } else {
            var shade = 0.45 * sgn * px + 0.45 * sgn * py + 0.6 * Math.sqrt(1 - d);
            var idx = Math.max(0, Math.min(pal.length - 1, Math.floor(shade * pal.length)));
            if (kind === 'bands') { var b = ['=', '~', '-', '=', '~']; ch = idx < 2 ? '.' : b[r % b.length]; }
            else if (kind === 'spots' && d < 0.6 && ((r * 7 + c * 13) % 7) === 0) { ch = 'o'; }
            else { ch = pal[idx]; }
          }
        }
        if (ringed) {
          var qx = px * ca + py * sa, qy = -px * sa + py * ca;
          var e = (qx / 1.8) * (qx / 1.8) + (qy / 0.42) * (qy / 0.42);
          if (Math.abs(e - 1) < 0.2 && (d > 1 || qy > 0)) { ch = (c % 2) ? ':' : '.'; }
        }
        if (moon) { var md = ((c - mx) / 1.7) * ((c - mx) / 1.7) + ((r - my) / 1.2) * ((r - my) / 1.2); if (md <= 1) { ch = md < 0.4 ? 'o' : ':'; } }
        line += ch;
      }
      lines.push(line);
    }
    return lines.join('\n');
  }

  function starfield(n) {
    var s = 131;
    var rand = function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    var glyphs = ['.', '.', '·', '.', "'", '.', '·', '+'];
    var colors = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)'];
    var html = '';
    for (var i = 0; i < n; i++) {
      var x = (rand() * 100).toFixed(2), y = (rand() * 100).toFixed(2);
      var ch = glyphs[Math.floor(rand() * glyphs.length)];
      var size = 7 + Math.floor(rand() * 5);
      var color = colors[Math.floor(rand() * colors.length)];
      var delay = (-rand() * 3).toFixed(2);
      var tw = i % 9 === 0;
      if (tw) { ch = rand() > 0.5 ? '+' : '*'; }
      html += '<span' + (tw ? ' class="twinkle"' : '') + ' style="left:' + x + '%;top:' + y + '%;font-size:' + size + 'px;color:' + color +
        (tw ? ';animation-delay:' + delay + 's' : '') + '">' + ch + '</span>';
    }
    return html;
  }

  /* ---------- Accent + planets ---------- */
  function applyAccent(accent) {
    var light = lighten(accent, 0.55);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-soft', soft(accent, 0.14));
    root.style.setProperty('--accent-light', light);
    root.style.setProperty('--accent-glow', soft(light, 0.45));
  }

  function drawPlanets(data) {
    var kind = data.planet || 'ring';
    var flip = true;   /* light-side shading, as in the mockup's light theme */
    var rows = kind === 'ring' ? 11 : 10, cols = kind === 'ring' ? 16 : 14;
    var hero = document.querySelector('[data-planet="hero"]');
    if (hero) hero.textContent = planet(rows, cols, kind, flip);
    var next = document.querySelector('[data-planet="next"]');
    if (next) {
      var nk = (data.next && data.next.planet) || (kind === 'ring' ? 'moon' : 'ring');
      next.textContent = planet(7, 10, nk, flip);
    }
  }

  /* ---------- Render ---------- */
  function renderCover(data) {
    var cover = data.cover || {};
    var hasMedia = !!cover.src;
    var art = hasMedia ? C.Media(cover, 'COVER') :
      '<div class="coverdots" aria-hidden="true"></div>' +
      '<div class="cs-cover-track" aria-hidden="true">' + track(200).map(function (c) {
        return c.ch ? '<span style="left:' + c.x + ';top:' + c.y + '">' + c.ch + '</span>' : '';
      }).join('') + '</div>' +
      '<span class="cs-cover-glow" aria-hidden="true"></span>' +
      '<div class="cs-cover-center"><span class="ascii cs-cover-planet" data-planet="hero" aria-hidden="true"></span>' +
      (cover.label ? '<span class="cs-cover-label">' + esc(cover.label) + '</span>' : '') + '</div>';
    if (hasMedia) { art = art.replace(/^<(img|video)/, '<$1 class="cs-cover-media"'); }
    return '<section class="cs-cover" aria-label="Cover"><div class="coverfly">' + art +
      (data.showGuides ? '<span class="cs-cover-guide">COVER — Your strongest visual. It stays in place, then fades and shrinks away as the story slides up over it.</span>' : '') +
      '<div class="cs-cover-fade" aria-hidden="true"></div></div></section>';
  }

  var META_LABELS = { role: 'Role', team: 'Team', timeline: 'Timeline', tools: 'Tools', company: 'Company' };

  function renderTitle(data) {
    var meta = data.meta || {};
    var metaHtml = Object.keys(meta).map(function (k) {
      var v = Array.isArray(meta[k]) ? meta[k].join(', ') : meta[k];
      return v ? '<div><dt>' + esc(META_LABELS[k] || k) + '</dt><dd>' + esc(v) + '</dd></div>' : '';
    }).join('');
    return '<section class="cs-title" aria-labelledby="cs-impact">' +
      '<nav class="cs-breadcrumb" aria-label="Breadcrumb"><a href="' + esc(SITE.workHref) + '">WORK</a> / ' + esc(String(data.projectName || '').toUpperCase()) + '</nav>' +
      '<div class="cs-project"><span class="cs-project-mark" aria-hidden="true">✦</span><span class="cs-project-name">' + esc(data.projectName) + '</span></div>' +
      '<h1 class="cs-impact" id="cs-impact">' + rich(data.impactTitle) + '</h1>' +
      (data.summary ? '<p class="cs-summary">' + rich(data.summary) + '</p>' : '') +
      '<ul class="cs-pills" aria-label="Project status and tags">' +
        (data.status ? '<li class="cs-pill"><span class="cs-status-dot" aria-hidden="true"></span><span class="sr-only">Status: </span>' + esc(data.status) + '</li>' : '') +
        list(data.tags).map(function (t) { return '<li class="cs-pill">' + esc(t) + '</li>'; }).join('') +
      '</ul>' +
      (metaHtml ? '<dl class="cs-meta">' + metaHtml + '</dl>' : '') +
      '</section>';
  }

  function renderTldr(data) {
    if (!list(data.tldr).length) return '';
    return '<section class="cs-tldr-wrap" aria-labelledby="cs-tldr-title"><div class="cs-tldr reveal">' +
      '<h2 class="cs-tldr-title" id="cs-tldr-title">TL;DR</h2><dl>' +
      list(data.tldr).map(function (t) { return '<div><dt>' + esc(t.label) + '</dt><dd>' + rich(t.text) + '</dd></div>'; }).join('') +
      '</dl>' + (data.tldrLink ? C.BLOCKS.link(data.tldrLink) : '') + '</div></section>';
  }

  /* "More case studies": every other case study, starting with this page's `next` */
  function renderNext(data) {
    var all = SITE.caseStudies;
    var at = -1;
    all.forEach(function (c, i) { if (c.name === data.projectName) at = i; });
    var others = all.filter(function (c) { return c.name !== data.projectName; });
    /* Start with data.next if set, otherwise the one after this page in the list */
    var start = 0;
    others.forEach(function (c, i) { if (data.next && c.href === data.next.href) start = i; });
    if (!(data.next && data.next.href) && at >= 0) start = at % others.length;
    others = others.slice(start).concat(others.slice(0, start)).slice(0, 2);
    if (!others.length) return '';
    return '<section class="cs-next" aria-labelledby="cs-more-title"><div class="cs-next-inner">' +
      '<h2 class="cs-more-title" id="cs-more-title">More case studies</h2>' +
      '<ul class="cs-more-grid">' + others.map(function (c) {
        return '<li><a class="cs-more-card" href="' + esc(c.href) + '">' +
          '<span class="cs-more-media"><img src="' + esc(c.cover) + '" alt="' + esc(c.alt) + '" loading="lazy" decoding="async"></span>' +
          '<span class="cs-more-copy">' +
            '<span class="cs-more-name">' + esc(c.name) + '</span>' +
            '<span class="cs-more-headline">' + esc(c.headline) + '</span>' +
            '<span class="cs-more-meta">' + esc(c.meta) + '</span>' +
            '<span class="cs-more-link">READ CASE STUDY →</span>' +
          '</span></a></li>';
      }).join('') + '</ul>' +
      '<a class="cs-back" href="' + esc(SITE.workHref) + '">← BACK TO ALL WORK</a></div></section>';
  }

  function render(data) {
    var ctx = { showGuides: !!data.showGuides, star: STAR };
    var sections = list(data.sections);
    document.title = (data.projectName || 'Case study') + SITE.titleSuffix;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && data.summary) desc.setAttribute('content', String(data.summary).replace(/==/g, ''));

    var toc = '<nav class="cs-toc" aria-label="On this page">' + sections.map(function (s) {
      return '<a href="#' + esc(s.id) + '">' + esc(s.label || s.title) + '</a>';
    }).join('') + '</nav>';

    var main = document.getElementById('cs-main');
    main.innerHTML = renderCover(data) +
      '<div class="cs-story">' + renderTitle(data) + renderTldr(data) +
        '<div class="cs-body">' + toc + '<article class="cs-article">' +
          sections.map(function (s, i) { return C.Section(s, ctx, i); }).join('') +
        '</article></div>' + renderNext(data) +
      '</div>';
  }

  /* Header + footer: the landing page's markup (index.html), styled by
     styles.css, so they look and behave exactly the same. */
  function renderShell() {
    document.querySelector('.cs-stars').innerHTML = starfield(300);

    document.querySelector('.site-nav').innerHTML =
      '<div class="cosmos-nav-inner">' +
        '<a href="index.html" class="brand cosmos-brand">' +
          '<img src="media/flower-logo.png" alt="" class="brand-logo" aria-hidden="true">' +
          '<span class="cosmos-brand-text"><span class="cosmos-brand-name">GRACE ASUNCION</span><span class="cosmos-brand-role">PRODUCT DESIGNER</span></span>' +
        '</a>' +
        '<div class="cosmos-nav-links">' + SITE.nav.map(function (n) {
          return '<a href="' + esc(n.href) + '" class="nav-link"' + (n.current ? ' aria-current="page"' : '') + '>' + esc(n.label) + '</a>';
        }).join('') + '</div>' +
        '<p class="cosmos-status"><span class="cosmos-status-dot" aria-hidden="true"></span>' + esc(SITE.status) + '</p>' +
      '</div>' +
      '<div class="cs-progress-track" aria-hidden="true"><div class="progress"></div></div>';

    document.querySelector('.site-footer').innerHTML =
      '<div class="doodle footer-ascii" style="top:12%; right:14%; --r:-4deg;"><img src="media/hero.gif" alt="" aria-hidden="true"></div>' +
      '<div class="wrap footer-inner">' +
        '<div class="footer-lead">' +
          '<h2 class="footer-headline">Let’s chat!</h2>' +
          '<div class="footer-contact-list">' +
            '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + '</a>' +
            '<a href="' + esc(SITE.linkedin) + '">' + esc(SITE.linkedin.replace(/^https?:\/\/(www\.)?/, '')) + '</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom-row">' +
          '<img src="media/flower-logo.png" alt="Grace Asuncion" class="footer-logo">' +
          '<p class="footer-credit">Designed and vibecoded with lots of Alanis ₊˚⊹♡</p>' +
          '<p class="footer-signature">Grace Asuncion &nbsp;&nbsp; © ' + SITE.year + '</p>' +
        '</div>' +
      '</div>';
  }

  /* ---------- Behaviour ---------- */
  function trackHeader() {
    var header = document.querySelector('.site-nav');
    function set() { root.style.setProperty('--header-h', header.offsetHeight + 'px'); }
    set();
    if ('ResizeObserver' in window) new ResizeObserver(set).observe(header);
    else window.addEventListener('resize', set);
  }

  /* Safari/Firefox fallback for the scroll-driven progress bar + cover. */
  function scrollFallback() {
    if (reduceMotion) return;
    if (window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()')) return;
    root.classList.add('js-scroll-fallback');
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty('--cs-progress', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');
      root.style.setProperty('--cs-cover', Math.min(1, y / (window.innerHeight * 0.75)).toFixed(4));
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* Side menu highlight. A section counts as "current" while it crosses a
     band just below the sticky header (top ~40% of the viewport). */
  function sectionSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.cs-toc a'));
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;
    var toc = document.querySelector('.cs-toc');
    var visible = new Set();
    var current = null;

    function activate(id) {
      if (id === current) return;
      current = id;
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('is-active', on);
        if (on) {
          a.setAttribute('aria-current', 'true');
          /* Mobile strip: keep the active item in view without moving the page. */
          if (toc.scrollWidth > toc.clientWidth) {
            toc.scrollTo({ left: a.offsetLeft - toc.clientWidth / 2 + a.offsetWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
          }
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }

    var io;
    function observe() {
      if (io) io.disconnect();
      var top = (parseInt(getComputedStyle(root).getPropertyValue('--header-h'), 10) || 76) + toc.offsetHeight * (toc.scrollWidth > toc.clientWidth ? 1 : 0);
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
        for (var i = 0; i < sections.length; i++) {
          if (visible.has(sections[i])) { activate(sections[i].id); return; }
        }
      }, { rootMargin: '-' + (top + 1) + 'px 0px -60% 0px', threshold: 0 });
      sections.forEach(function (s) { io.observe(s); });
    }
    observe();
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(observe, 200); });
    activate(sections[0].id);
  }

  /* ---------- Boot ---------- */
  function showMissing(slug) {
    document.getElementById('cs-main').innerHTML =
      '<div class="cs-missing"><h1 class="cs-impact">Case study not found</h1>' +
      '<p class="cs-text">There is no content file for “' + esc(slug) + '”. Check that <code>content/' + esc(slug) + '.js</code> exists.</p>' +
      '<a class="cs-back" href="' + esc(SITE.workHref) + '">← BACK TO ALL WORK</a></div>';
  }

  /* ---------- Lightbox: click an image or video to view it up close ----------
     Images: first click opens them fitted to the screen; clicking the enlarged
     image toggles full resolution (scrollable). Videos open fitted to the
     screen with playback controls, picking up where the inline one was.
     Esc / ✕ / backdrop closes. */
  function setupLightbox() {
    var items = document.querySelectorAll('.cs-article img, .cs-article video');
    if (!items.length) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var dlg = document.createElement('dialog');
    dlg.className = 'cs-lightbox';
    dlg.setAttribute('aria-label', 'Media viewer');
    dlg.innerHTML =
      '<div class="cs-lightbox-stage"><img alt=""><video controls muted loop playsinline></video></div>' +
      '<button type="button" class="cs-lightbox-close" aria-label="Close viewer">✕</button>' +
      '<p class="cs-lightbox-hint" aria-hidden="true"></p>';
    document.body.appendChild(dlg);

    var stage = dlg.querySelector('.cs-lightbox-stage');
    var big = stage.querySelector('img');
    var bigVid = stage.querySelector('video');
    var hint = dlg.querySelector('.cs-lightbox-hint');
    var closeBtn = dlg.querySelector('.cs-lightbox-close');
    var opener = null, openerWasPlaying = false, closing = false;

    /* ---- Motion: the media grows out of / shrinks back into its spot on the page ---- */
    var DUR = 340, EASE = 'cubic-bezier(.2,.8,.2,1)';
    var animate = !reduceMotion && typeof dlg.animate === 'function';
    /* Transform that makes an element sitting at `base` look like it sits at `target` */
    function tf(target, base) {
      return 'translate(' + (target.left - base.left) + 'px,' + (target.top - base.top) + 'px) ' +
        'scale(' + (target.width / base.width) + ',' + (target.height / base.height) + ')';
    }
    /* FLIP: element has already moved to its new box; animate it in from `from` */
    function flip(el, from) {
      if (!animate) return;
      var to = el.getBoundingClientRect();
      if (!to.width || !to.height || !from.width || !from.height) return;
      el.animate([
        { transformOrigin: '0 0', transform: tf(from, to) },
        { transformOrigin: '0 0', transform: 'none' }
      ], { duration: DUR, easing: EASE });
    }
    function fadeChrome(show) {
      if (!animate) return;
      var o = { duration: DUR, easing: EASE, fill: 'forwards' };
      var clear = 'rgba(10,11,14,0)', dark = 'rgba(10,11,14,0.94)';
      dlg.animate({ backgroundColor: show ? [clear, dark] : [dark, clear] }, o);
      [closeBtn, hint].forEach(function (n) { n.animate({ opacity: show ? [0, 1] : [1, 0] }, o); });
    }
    function whenReady(media, cb) {
      if (media === bigVid) {
        if (bigVid.readyState >= 1) cb();
        else {
          var done = function () { bigVid.removeEventListener('loadedmetadata', done); bigVid.removeEventListener('error', done); cb(); };
          bigVid.addEventListener('loadedmetadata', done);
          bigVid.addEventListener('error', done);
        }
      } else if (big.complete && big.naturalWidth) cb();
      else big.onload = big.onerror = function () { big.onload = big.onerror = null; cb(); };
    }

    function canZoom() { return big.naturalWidth > big.clientWidth + 8 || big.naturalHeight > big.clientHeight + 8; }
    function refresh() {
      if (stage.classList.contains('is-video')) { hint.textContent = 'ESC TO CLOSE'; return; }
      var zoomed = stage.classList.contains('is-zoomed');
      stage.classList.toggle('no-zoom', !zoomed && !canZoom());
      hint.textContent = zoomed ? 'CLICK TO FIT · ESC TO CLOSE'
        : canZoom() ? 'CLICK IMAGE TO ZOOM · ESC TO CLOSE' : 'ESC TO CLOSE';
    }

    function open(el) {
      if (dlg.open) return;
      opener = el;
      closing = false;
      stage.classList.remove('is-zoomed');
      var isVideo = el.tagName === 'VIDEO';
      stage.classList.toggle('is-video', isVideo);
      document.documentElement.classList.add('cs-lightbox-open');
      if (isVideo) {
        openerWasPlaying = !el.paused;
        el.pause();
        bigVid.src = el.currentSrc || el.src;
        if (el.poster) bigVid.poster = el.poster; else bigVid.removeAttribute('poster');
        bigVid.setAttribute('aria-label', el.getAttribute('aria-label') || 'Video');
        var t = el.currentTime || 0;
        bigVid.addEventListener('loadedmetadata', function () { bigVid.currentTime = t; }, { once: true });
        if (!reduceMotion) { var p = bigVid.play(); if (p && p.catch) p.catch(function () {}); }
      } else {
        big.src = el.currentSrc || el.src;
        big.alt = el.alt;
      }
      var media = isVideo ? bigVid : big;
      var from = el.getBoundingClientRect();
      /* Keep the media invisible until it has a real size, then fly it in */
      media.style.opacity = '0';
      dlg.showModal();
      fadeChrome(true);
      whenReady(media, function () {
        if (!dlg.open || closing || opener !== el) return;
        media.style.opacity = '';
        refresh();
        el.style.visibility = 'hidden'; /* the copy in the viewer stands in for it */
        flip(media, from);
      });
    }
    function close() {
      if (!dlg.open || closing) return;
      closing = true;
      var media = stage.classList.contains('is-video') ? bigVid : big;
      var from = media.getBoundingClientRect();
      var to = opener ? opener.getBoundingClientRect() : null;
      if (!animate || !to || !to.width || !from.width || media.style.opacity === '0') { dlg.close(); return; }
      fadeChrome(false);
      media.animate([
        { transformOrigin: '0 0', transform: 'none' },
        { transformOrigin: '0 0', transform: tf(to, from) }
      ], { duration: DUR, easing: EASE, fill: 'forwards' }).onfinish = function () { dlg.close(); };
    }
    /* Esc: run the closing animation instead of vanishing instantly */
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });

    dlg.addEventListener('close', function () {
      closing = false;
      if (dlg.getAnimations) dlg.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
      big.style.opacity = bigVid.style.opacity = '';
      if (opener) opener.style.visibility = '';
      document.documentElement.classList.remove('cs-lightbox-open');
      big.removeAttribute('src');
      if (stage.classList.contains('is-video')) {
        if (opener) {
          /* Hand the playback position back to the inline video */
          try { opener.currentTime = bigVid.currentTime; } catch (err) {}
          if (openerWasPlaying) { var p = opener.play(); if (p && p.catch) p.catch(function () {}); }
        }
        bigVid.pause();
        bigVid.removeAttribute('src');
        bigVid.load();
      }
      if (opener) opener.focus();
    });

    big.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!stage.classList.contains('is-zoomed') && !canZoom()) return;
      /* Keep the clicked spot under the cursor when zooming in */
      var r = big.getBoundingClientRect();
      var fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      var zoomIn = !stage.classList.contains('is-zoomed');
      stage.classList.toggle('is-zoomed', zoomIn);
      if (zoomIn) {
        stage.scrollLeft = big.offsetLeft + fx * big.offsetWidth - stage.clientWidth / 2;
        stage.scrollTop = big.offsetTop + fy * big.offsetHeight - stage.clientHeight / 2;
      }
      refresh();
      flip(big, r); /* glide between fitted and full size */
    });
    stage.addEventListener('click', function (e) { if (e.target === stage) close(); });
    closeBtn.addEventListener('click', close);
    window.addEventListener('resize', function () { if (dlg.open) refresh(); });

    Array.prototype.forEach.call(items, function (el) {
      var isVideo = el.tagName === 'VIDEO';
      var label = isVideo ? (el.getAttribute('aria-label') || 'video') : (el.alt || 'image');
      el.classList.add('cs-zoomable');
      el.removeAttribute('aria-hidden'); /* it's interactive now, so it must be exposed */
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', 'View larger: ' + label);
      el.addEventListener('click', function (e) { e.preventDefault(); open(el); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); }
      });
    });
  }

  function boot(data) {
    render(data);
    setupLightbox();
    applyAccent(data.accent || '#2F5F7C');
    drawPlanets(data);
    sectionSpy();
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  function init() {
    renderShell();
    if (window.setupMobileNav) window.setupMobileNav();   // mobile menu button (script.js)
    trackHeader();
    scrollFallback();

    /* Which content file? <html data-case-study="slug">, else ?p=slug, else the example. */
    var param = root.getAttribute('data-case-study') || new URLSearchParams(location.search).get('p') || 'example';
    var slug = /^[a-z0-9-]+$/.test(param) ? param : '';
    if (!slug) { showMissing(param); return; }

    var s = document.createElement('script');
    s.src = 'content/' + slug + '.js';
    s.onload = function () { window.CASE_STUDY ? boot(window.CASE_STUDY) : showMissing(slug); };
    s.onerror = function () { showMissing(slug); };
    document.body.appendChild(s);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
