/* =====================================================================
   About page renderer. Reads window.ABOUT (content/about.js) and fills
   the "Right now" cards, the "Where I've been" list and the skill pills.
   Markup reuses the portfolio's card pieces (.pc-media, .pc-num, .pc-meta,
   .pc-link, .tag) so the page matches Work and Play.
===================================================================== */
(function () {
  'use strict';

  var data = window.ABOUT;
  if (!data) return;

  /* Planet tints, same as the home page galaxy */
  var TINT = {
    blue: '#4f7c9e',
    lavender: '#8b7fd4',
    terracotta: '#d9694f',
    green: '#6b8a47',
    gold: '#c9a440'
  };

  var CATEGORY = {
    'Leadership': TINT.lavender,
    'Work': TINT.blue,
    'Student org': TINT.green,
    'Education': TINT.gold
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pct(part, whole) {
    if (!whole) return 0;
    return Math.max(0, Math.min(100, (part / whole) * 100));
  }

  /* ---------- Right now ---------- */
  function card(tint, label, media, title, meta, extra) {
    return '<li class="ab-card ab-now-card" style="--tint:' + tint + ';">' +
      '<div class="pc-media ab-scene" aria-hidden="true">' + media + '</div>' +
      '<p class="pc-num ab-dot-label">' + label + '</p>' +
      '<h3 class="ab-now-title">' + esc(title) + '</h3>' +
      '<p class="pc-meta">' + meta + '</p>' +
      (extra || '') +
    '</li>';
  }

  /* A real image for a card, with optional sharper sizes and focus point */
  function sceneImage(item) {
    return '<img class="ab-scene-img" src="' + esc(item.image) + '"' +
      (item.imageSrcset ? ' srcset="' + esc(item.imageSrcset) + '" sizes="(max-width: 720px) 92vw, (max-width: 960px) 46vw, 400px"' : '') +
      (item.imagePosition ? ' style="object-position:' + esc(item.imagePosition) + '"' : '') +
      ' alt="" decoding="async">';
  }

  /* ---------- On repeat ----------
     Same anatomy as the other cards: album art in the media slot, then the
     label, title and artist. Clicking ▶ swaps the art for Spotify's player
     in the same box and starts the song. Spotify reports play/pause, so the
     label and equalizer follow the real audio once it has started. */

  /* Spotify's mid-size player is 232px tall; it's scaled to the 16:10 box */
  var SPOTIFY_H = 232;
  var SPOTIFY_API = 'https://open.spotify.com/embed/iframe-api/v1';

  /* Only Spotify links are used: returns { type, id } or null */
  function spotifyRef(url) {
    if (!url) return null;
    var m = String(url).match(/^https:\/\/open\.spotify\.com\/(?:embed\/)?(track|album|playlist|episode)\/([A-Za-z0-9]+)/);
    return m ? { type: m[1], id: m[2] } : null;
  }

  function repeatCard(r, ref) {
    var label = '<span data-repeat-label>Now playing</span>' +
      '<span class="ab-eq" aria-hidden="true"><i></i><i></i><i></i></span>';

    // Album art: a blurred fill behind a square cover. Without a cover,
    // the drawn record stands in.
    var art = r.cover
      ? '<span class="ab-album" aria-hidden="true">' +
          '<span class="ab-album-bg" style="background-image:url(\'' + esc(r.cover) + '\')"></span>' +
          '<img class="ab-album-cover" src="' + esc(r.cover) + '" alt="" decoding="async">' +
          (ref ? '<span class="ab-album-play">▶</span>' : '') +
        '</span>'
      : '<span class="ab-scene--song" aria-hidden="true">' +
          '<span class="ab-scene-vinyl"></span><span class="ab-scene-cover"></span>' +
        '</span>';

    var media = ref
      ? '<button type="button" class="pc-media ab-scene ab-scene-btn" data-repeat-play' +
          ' aria-label="' + esc('Play ' + r.title + ' by ' + r.artist) + '">' + art + '</button>'
      : '<div class="pc-media ab-scene" aria-hidden="true">' + art + '</div>';

    return '<li class="ab-card ab-now-card ab-repeat" style="--tint:' + TINT.terracotta + ';" data-repeat>' +
      media +
      '<p class="pc-num ab-dot-label">' + label + '</p>' +
      '<h3 class="ab-now-title">' + esc(r.title) + '</h3>' +
      '<p class="pc-meta">' + esc(r.artist) + '</p>' +
    '</li>';
  }

  function setRepeatPlaying(cardEl, playing) {
    cardEl.classList.toggle('is-paused', !playing);
    var label = cardEl.querySelector('[data-repeat-label]');
    if (label) label.textContent = playing ? 'Now playing' : 'On repeat';
  }

  /* Scale the 232px player to fill the 16:10 box */
  function fitPlayer(box) {
    var frame = box.querySelector('iframe');
    if (!frame) return;
    var scale = box.clientHeight / SPOTIFY_H || 1;
    frame.style.width = (box.clientWidth / scale) + 'px';
    frame.style.height = SPOTIFY_H + 'px';
    frame.style.transform = 'scale(' + scale + ')';
  }

  function watchPlayer(box) {
    fitPlayer(box);
    if ('ResizeObserver' in window) new ResizeObserver(function () { fitPlayer(box); }).observe(box);
    else window.addEventListener('resize', function () { fitPlayer(box); });
  }

  /* Plain player (no play/pause events): used if Spotify's API can't load */
  function plainPlayer(box, ref, title) {
    box.innerHTML = '<iframe src="https://open.spotify.com/embed/' + ref.type + '/' + ref.id + '?utm_source=generator&autoplay=1"' +
      ' title="' + esc(title) + '" frameborder="0"' +
      ' allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>';
    watchPlayer(box);
  }

  function startPlayer(cardEl, btn, ref, title) {
    // Swap the art for an empty box of the same size
    var box = document.createElement('div');
    box.className = 'pc-media ab-scene ab-player';
    var slot = document.createElement('div');
    box.appendChild(slot);
    btn.parentNode.replaceChild(box, btn);

    var done = false;
    var timer = setTimeout(function () {
      if (done) return;
      done = true;
      plainPlayer(box, ref, title);
    }, 6000);

    window.onSpotifyIframeApiReady = function (api) {
      if (done) return;
      done = true;
      clearTimeout(timer);

      api.createController(slot, {
        uri: 'spotify:' + ref.type + ':' + ref.id,
        width: '100%',
        height: SPOTIFY_H
      }, function (controller) {
        var frame = box.querySelector('iframe');
        if (frame) {
          frame.title = title;
          frame.removeAttribute('loading');      // it's already on screen: load now
          frame.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
        }
        watchPlayer(box);

        // Start right away (Safari may still want a click on Spotify's own ▶)
        controller.addListener('ready', function () { controller.play(); });

        // Follow the real audio once it has started; before that Spotify
        // reports "paused" while it loads, which is ignored.
        var started = false;
        controller.addListener('playback_update', function (e) {
          var d = e && e.data;
          if (!d) return;
          if (!d.isPaused) started = true;
          if (started) setRepeatPlaying(cardEl, !d.isPaused);
        });
      });
    };

    if (!document.querySelector('script[src="' + SPOTIFY_API + '"]')) {
      var s = document.createElement('script');
      s.src = SPOTIFY_API;
      s.async = true;
      document.head.appendChild(s);
    }
  }

  function wireRepeat(cardEl, ref, r) {
    var btn = cardEl.querySelector('[data-repeat-play]');
    if (!btn || !ref) return;
    btn.addEventListener('click', function () {
      startPlayer(cardEl, btn, ref, 'Spotify player: ' + r.title + ' by ' + r.artist);
    }, { once: true });
  }

  function renderNow(now) {
    var month = document.querySelector('[data-now-month]');
    if (month) month.textContent = now.month || '';

    var list = document.querySelector('[data-now-list]');
    if (!list) return;

    var p = now.playing || {};
    var w = now.watching || {};
    var r = now.onRepeat || {};
    var hp = Math.max(0, Math.min(5, p.hp == null ? 4 : p.hp));
    var hpBar = new Array(hp + 1).join('▮') + new Array(5 - hp + 1).join('▯');

    var gameScene = p.image
      ? sceneImage(p)
      : '<div class="ab-scene--game">' +
          '<span class="ab-scene-planet">  .-~~-.\n-(======)-\n  \'-..-\'</span>' +
          '<span class="ab-scene-hp">HP ' + hpBar + ' LV.' + esc(p.level) + '</span>' +
        '</div>';

    var playing = card(TINT.blue, 'Playing', gameScene,
      p.title,
      esc(p.platform) + ' · ' + esc(p.hours) + ' hrs played');

    var showProgress = '<span class="ab-scene-progress" style="width:' + pct(w.episode, w.episodes) + '%"></span>';
    var showScene = w.image
      ? sceneImage(w) + showProgress.replace('ab-scene-progress', 'ab-scene-progress ab-scene-progress--edge')
      : '<div class="ab-scene--show">' +
          '<span class="ab-scene-play">▶</span>' + showProgress +
        '</div>';

    var watching = card(TINT.lavender, 'Watching', showScene,
      w.title,
      'Season ' + esc(w.season) + ' · episode ' + esc(w.episode) + ' of ' + esc(w.episodes));

    var ref = spotifyRef(r.spotify);

    list.innerHTML = playing + watching + repeatCard(r, ref);

    var repeatEl = list.querySelector('[data-repeat]');
    if (repeatEl) wireRepeat(repeatEl, ref, r);
  }

  /* ---------- Where I've been ---------- */
  function renderExperience(items) {
    var count = document.querySelector('[data-experience-count]');
    if (count) count.textContent = (items.length < 10 ? '0' : '') + items.length;

    var list = document.querySelector('[data-experience]');
    if (!list) return;

    list.innerHTML = items.map(function (item) {
      var tint = CATEGORY[item.category] || TINT.blue;
      var desc = item.desc && item.desc !== '—'
        ? ' · <span class="ab-xp-desc">' + esc(item.desc) + '</span>'
        : '';
      var link = item.link && item.link.href
        ? '<a class="pc-link ab-xp-link" href="' + esc(item.link.href) + '">' + esc(item.link.text) + '</a>'
        : '';
      // Logo square; until a file is set, a dashed placeholder with the org's initials
      var initials = item.org.replace(/\(.*?\)/g, '').split(/\s+/)
        .map(function (w) { return w.replace(/[^A-Za-z0-9]/g, '').charAt(0); })
        .join('').slice(0, 2).toUpperCase();
      var logo = item.logo
        ? '<span class="ab-xp-logo"><img src="' + esc(item.logo) + '" alt="" loading="lazy"></span>'
        : '<span class="ab-xp-logo is-empty" aria-hidden="true" title="TODO: logo">' + esc(initials) + '</span>';

      return '<li class="ab-xp">' +
        '<p class="pc-meta ab-xp-date">' + esc(item.dates) + '</p>' +
        '<div class="ab-xp-body">' +
          '<div class="ab-xp-head">' + logo +
            '<h3 class="ab-xp-org">' + esc(item.org) + '</h3>' +
          '</div>' +
          '<p class="ab-xp-role"><strong>' + esc(item.role) + '</strong>' + desc + '</p>' +
          link +
        '</div>' +
        '<div class="ab-xp-side">' +
          '<span class="tag ab-dot-tag" style="--tint:' + tint + ';">' + esc(item.category) + '</span>' +
          '<span class="pc-meta ab-xp-place">Davis, CA</span>' +
        '</div>' +
      '</li>';
    }).join('');
  }

  /* ---------- What I bring ---------- */
  function renderSkills(skills) {
    var list = document.querySelector('[data-skills]');
    if (!list) return;
    list.innerHTML = skills.map(function (s) {
      return '<li class="tag">' + esc(s) + '</li>';
    }).join('');
  }

  renderNow(data.rightNow || {});
  renderExperience(data.experience || []);
  renderSkills(data.skills || []);
})();

/* =====================================================================
   Hello section star field: seeded ASCII stars (same layout
   on every load). The floating planets use the landing page renderer in script.js.
===================================================================== */
(function () {
  'use strict';

  /* Small seeded random (mulberry32) so stars never move on reload */
  function seeded(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ---------- Star field ---------- */
  var field = document.querySelector('[data-stars]');
  if (field) {
    var rand = seeded(1953);
    var GLYPHS = ['·', '.', "'", '+'];
    var COLORS = ['#c9a440', '#8b7fd4', '#4f7c9e', '#8c8780'];   /* gold, lavender, blue, muted */
    var html = '';
    var i;

    for (i = 0; i < 46; i++) {
      html += '<span style="left:' + (rand() * 100).toFixed(2) + '%;top:' + (rand() * 100).toFixed(2) + '%;' +
        'font-size:' + Math.round(7 + rand() * 4) + 'px;' +
        'color:' + COLORS[Math.floor(rand() * COLORS.length)] + ';' +
        'opacity:' + (0.25 + rand() * 0.3).toFixed(2) + '">' +
        GLYPHS[Math.floor(rand() * GLYPHS.length)] + '</span>';
    }

    /* Nine gold ✦ that twinkle, staggered */
    for (i = 0; i < 9; i++) {
      html += '<span class="ab-star ab-twinkle" style="left:' + (rand() * 100).toFixed(2) + '%;top:' + (rand() * 100).toFixed(2) + '%;' +
        'animation-delay:-' + (rand() * 3.4).toFixed(2) + 's">✦</span>';
    }

    field.innerHTML = html;
  }
})();
