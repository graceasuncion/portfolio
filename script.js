(function () {
  "use strict";
  console.log("running script.js");

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAGE_TRANSITION_MS = 350;

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.remove('is-page-enter');
    });
  });

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest('a[href]');
    if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;

    var url;
    try { url = new URL(link.href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname) return;

    e.preventDefault();
    document.body.classList.add('is-page-exit');

    var brandLink = link.closest('.brand');
    if (brandLink && !reducedMotion) {
      var logo = brandLink.querySelector('.brand-logo');
      if (logo) logo.classList.add('is-tapped');
    }

    if (reducedMotion) {
      window.location.href = link.href;
    } else {
      window.setTimeout(function () {
        window.location.href = link.href;
      }, PAGE_TRANSITION_MS);
    }
  });

  var hero = document.querySelector('.hero');
  var nav = document.querySelector('.site-nav');
  if (hero && 'IntersectionObserver' in window) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        hero.classList.toggle('is-visible', entry.isIntersecting);
        if (nav) nav.classList.toggle('is-visible', !entry.isIntersecting);
      });
    }, { threshold: 0.3 });
    heroObserver.observe(hero);
  } else if (nav) {
    nav.classList.add('is-visible');
  }

  var osDates = document.querySelectorAll('[data-os-date]');
  var osClocks = document.querySelectorAll('[data-os-clock]');
  if (osClocks.length) {
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var tick = function () {
      var d = new Date();
      var date = d.getFullYear() + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate());
      var time = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
      osDates.forEach(function (el) { el.textContent = date; });
      osClocks.forEach(function (el) { el.textContent = time; });
    };
    tick();
    setInterval(tick, 1000);
  }

  var desktopQuery = window.matchMedia('(min-width: 901px)');
  var topZ = 10;
  document.querySelectorAll('.os-window[data-drag]').forEach(function (win) {
    var bar = win.querySelector('.os-titlebar') || win;
    var startX, startY, baseX, baseY;

    bar.addEventListener('pointerdown', function (e) {
      if (!desktopQuery.matches || e.button !== 0 || e.target.closest('a')) return;
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      baseX = parseFloat(win.dataset.dx || 0);
      baseY = parseFloat(win.dataset.dy || 0);
      win.style.zIndex = ++topZ;
      win.classList.add('is-dragging');
      bar.setPointerCapture(e.pointerId);
    });

    bar.addEventListener('pointermove', function (e) {
      if (!win.classList.contains('is-dragging')) return;
      var dx = baseX + e.clientX - startX;
      var dy = baseY + e.clientY - startY;
      win.dataset.dx = dx;
      win.dataset.dy = dy;
      win.style.translate = dx + 'px ' + dy + 'px';
    });

    var endDrag = function () { win.classList.remove('is-dragging'); };
    bar.addEventListener('pointerup', endDrag);
    bar.addEventListener('pointercancel', endDrag);
  });

  desktopQuery.addEventListener('change', function (e) {
    if (e.matches) return;
    document.querySelectorAll('.os-window[data-drag]').forEach(function (win) {
      win.style.translate = '';
      delete win.dataset.dx;
      delete win.dataset.dy;
    });
  });

  var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var tocSteps = Array.prototype.map.call(tocLinks, function (link) {
      return document.getElementById(link.getAttribute('href').slice(1));
    }).filter(Boolean);

    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    tocSteps.forEach(function (step) { tocObserver.observe(step); });
  }

  var supportsCss = function (rule) { return window.CSS && CSS.supports && CSS.supports(rule); };
  var stackItems = Array.prototype.slice.call(document.querySelectorAll('.stack-item'));
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.stack-item, .work-item'));
  var stackEnd = document.querySelector('.stack-end');
  var stage = document.querySelector('.cosmos-stage');
  var wideQuery = window.matchMedia('(min-width: 721px)');

  // Staggered card reveal for browsers without view() timelines.
  if (revealItems.length && !reducedMotion && !supportsCss('animation-timeline: view()') && 'IntersectionObserver' in window) {
    document.body.classList.add('stack-reveal-js');
    var stackObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        stackObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -15% 0px' });
    revealItems.forEach(function (item) { stackObserver.observe(item); });
  }

  if ((stage || stackItems.length) && !reducedMotion) {
    var fadeInJs = !supportsCss('animation-timeline: scroll()');
    var scrollQueued = false;

    var updateScrollEffects = function () {
      scrollQueued = false;

      // Galaxy fade fallback: 0 -> 90% of the viewport height.
      if (fadeInJs && stage) {
        var p = Math.min(window.scrollY / (window.innerHeight * 0.9), 1);
        stage.style.opacity = 1 - 0.82 * p;
        stage.style.transform = 'scale(' + (1 - 0.12 * p) + ')';
        stage.style.filter = p > 0 ? 'blur(' + (5 * p) + 'px)' : '';
      }

      // Dim each card as the next one (or the ending) slides over it. Cards keep their
      // full width so the stacked edges stay lined up with the card in front.
      stackItems.forEach(function (item, i) {
        var card = item.firstElementChild;
        var next = stackItems[i + 1] || stackEnd;
        if (!wideQuery.matches || !next) {
          card.style.filter = '';
          return;
        }
        var rect = item.getBoundingClientRect();
        var covered = Math.min(Math.max((rect.bottom - next.getBoundingClientRect().top) / rect.height, 0), 1);
        card.style.filter = covered ? 'brightness(' + (1 - 0.12 * covered) + ')' : '';
      });
    };

    var queueScrollEffects = function () {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(updateScrollEffects);
    };

    window.addEventListener('scroll', queueScrollEffects, { passive: true });
    window.addEventListener('resize', queueScrollEffects);
    updateScrollEffects();
  }

  // ASCII planets: each [data-ascii] globe is drawn as a character sphere,
  // lit from the upper-left (denser glyphs = shadow side), with a surface per kind.
  var asciiPlanet = function (kind, rows, cols) {
    var pal = ['.', ':', ':', '-', '=', '+', '*', '#'];
    var ringed = kind === 'ring';
    var W = ringed ? Math.round(cols * 1.9) : cols;
    var H = ringed ? rows + 2 : rows;
    var cx = (W - 1) / 2, cy = (H - 1) / 2, rc = cols / 2, rr = rows / 2;
    var a = -16 * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    var craters = [[0.28, -0.3, 0.3], [-0.34, 0.22, 0.26], [0.22, 0.42, 0.18]];
    var lines = [];
    for (var r = 0; r < H; r++) {
      var line = '';
      for (var c = 0; c < W; c++) {
        var px = (c - cx) / rc, py = (r - cy) / rr, d = px * px + py * py, ch = ' ';
        if (d <= 1) {
          var shade = 0.45 * px + 0.45 * py + 0.6 * Math.sqrt(1 - d);
          var idx = Math.max(0, Math.min(pal.length - 1, Math.floor(shade * pal.length)));
          ch = d > 0.82 ? ':' : pal[idx];
          if (d <= 0.82) {
            if (kind === 'bands' || kind === 'ring') {
              var bands = ['=', '~', '-', '=', '~', '-'];
              ch = idx < 2 ? '.' : bands[r % bands.length];
            } else if (kind === 'terra') {
              var land = Math.sin(c * 1.1 + r * 0.6) + Math.sin(c * 0.45 - r * 1.3) + 0.6 * Math.cos(r * 0.9);
              if (land > 0.7) { ch = idx < 3 ? '%' : '#'; } else { ch = pal[Math.max(0, idx - 2)]; }
            } else if (kind === 'craters') {
              for (var k = 0; k < craters.length; k++) {
                var cr = craters[k];
                var dd = Math.sqrt((px - cr[0]) * (px - cr[0]) + (py - cr[1]) * (py - cr[1]));
                if (dd < cr[2]) { ch = dd < cr[2] * 0.55 ? pal[Math.max(0, idx - 3)] : 'o'; break; }
              }
            }
          }
        }
        if (ringed) {
          var qx = px * ca + py * sa, qy = -px * sa + py * ca;
          var e = (qx / 1.8) * (qx / 1.8) + (qy / 0.42) * (qy / 0.42);
          // Draw the ring everywhere off the globe, and over the globe only on its near (lower) half.
          if (Math.abs(e - 1) < 0.22 && (d > 1 || qy > 0)) { ch = (c % 2) ? ':' : '='; }
        }
        line += ch;
      }
      lines.push(line);
    }
    return { text: lines.join('\n'), w: W, h: H };
  };

  Array.prototype.forEach.call(document.querySelectorAll('[data-ascii]'), function (globe) {
    var size = parseFloat(getComputedStyle(globe.parentNode).getPropertyValue('--size')) || 40;
    var cols = Math.max(7, Math.round(size / 4.2));
    var rows = Math.max(5, Math.round(cols * 0.7));
    var art = asciiPlanet(globe.dataset.ascii, rows, cols);
    var pre = document.createElement('span');
    pre.className = 'cosmos-ascii';
    pre.textContent = art.text;
    globe.style.setProperty('--cols', cols);
    globe.style.setProperty('--rows', rows);
    globe.appendChild(pre);
  });

  var orbit = document.querySelector('[data-orbit]');
  if (orbit) {
    var bodies = Array.prototype.map.call(orbit.querySelectorAll('[data-ring]'), function (el) {
      return {
        el: el,
        ring: parseFloat(el.dataset.ring),
        speed: parseFloat(el.dataset.speed),
        angle: parseFloat(el.dataset.angle) * Math.PI / 180
      };
    });
    // Hovering eases the orbit down to a crawl instead of stopping it.
    var SLOW_SPEED = 0.2;
    var speedScale = 1;
    var targetScale = 1;
    var lastFrame = null;

    // Label side swap: fade the label in toward its planet, switch sides while it's
    // hidden, then let it slide back out on the new side. A short cooldown stops it
    // flickering if a planet lingers near the switch point (e.g. while the orbit is slowed).
    var LABEL_FADE_MS = 260;
    var setLabelSide = function (b, flip) {
      if (b.flipped === undefined || reducedMotion) {
        b.flipped = flip;
        b.el.classList.toggle('is-flipped', flip);
        return;
      }
      if (flip === b.flipped || b.flipping) return;
      b.flipping = true;
      b.el.classList.add('is-label-hidden');
      setTimeout(function () {
        b.flipped = !b.flipped;
        b.el.classList.toggle('is-flipped', b.flipped);
        // Let the hidden label settle on its new side before revealing it.
        requestAnimationFrame(function () {
          b.el.classList.remove('is-label-hidden');
          setTimeout(function () { b.flipping = false; }, LABEL_FADE_MS);
        });
      }, LABEL_FADE_MS);
    };

    var placeBodies = function () {
      var w = orbit.offsetWidth;
      var h = orbit.offsetHeight;
      bodies.forEach(function (b) {
        var x = w / 2 + Math.cos(b.angle) * b.ring * w;
        var y = h / 2 + Math.sin(b.angle) * b.ring * h;
        b.el.style.transform = 'translate(' + x + 'px, ' + y + 'px) translate(-50%, -50%)';
        b.el.style.zIndex = Math.sin(b.angle) > 0 ? 2 : 0;
        // Keep labels inside the frame by flipping them left on the right side of the orbit.
        setLabelSide(b, x > w * 0.72);
      });
    };

    var stepOrbit = function (now) {
      if (lastFrame !== null) {
        var dt = Math.min(now - lastFrame, 100) / 1000;
        speedScale += (targetScale - speedScale) * Math.min(dt * 4, 1);
        bodies.forEach(function (b) { b.angle += b.speed * speedScale * dt; });
      }
      lastFrame = now;
      placeBodies();
      requestAnimationFrame(stepOrbit);
    };

    orbit.addEventListener('mouseenter', function () { targetScale = SLOW_SPEED; });
    orbit.addEventListener('mouseleave', function () { targetScale = 1; });
    orbit.addEventListener('focusin', function () { targetScale = SLOW_SPEED; });
    orbit.addEventListener('focusout', function () { targetScale = 1; });

    if (reducedMotion) {
      placeBodies();
      window.addEventListener('resize', placeBodies);
    } else {
      requestAnimationFrame(stepOrbit);
    }
  }

  /* Hero "Last push": date of the latest commit on main, from GitHub.
     Cached per session so page hops don't hit GitHub's rate limit.
     Stays hidden if the request fails. */
  (function lastPush() {
    var KEY = 'last-push-date';
    var API = 'https://api.github.com/repos/graceasuncion/portfolio/commits?sha=main&per_page=1';

    function show(iso) {
      var date = new Date(iso);
      if (isNaN(date)) return;
      var label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      document.querySelectorAll('[data-last-push]').forEach(function (el) {
        el.setAttribute('datetime', iso);
        el.textContent = label;
        var wrap = el.closest('.cosmos-last-push');
        if (wrap) wrap.hidden = false;
      });
    }

    // case-study.js draws its footer after this file runs, so wait for the DOM
    function whenReady(fn) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
      else fn();
    }

    var cached = null;
    try { cached = sessionStorage.getItem(KEY); } catch (err) {}
    if (cached) { whenReady(function () { show(cached); }); return; }

    fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
      .then(function (commits) {
        var iso = commits[0] && commits[0].commit.committer.date;
        if (!iso) return;
        try { sessionStorage.setItem(KEY, iso); } catch (err) {}
        whenReady(function () { show(iso); });
      })
      .catch(function () {});
  })();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Sparkle trail + click burst, landing page only. Shapes are drawn in currentColor.
  var SPARKLE_COLOR = '#8ab1c3'; // matches the flower logo's petals
  var STAR_PATH = 'M12 2.5l2.8 6.2 6.7.6-5.1 4.5 1.5 6.6L12 17l-5.9 3.4 1.5-6.6-5.1-4.5 6.7-.6z';
  var SHAPES = [
    '<path fill="currentColor" d="' + STAR_PATH + '"/>',
    '<path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" d="' + STAR_PATH + '"/>',
    '<circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="3.5"/>',
    '<path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M12 12a1.5 1.5 0 1 1 1.5 1.5a3 3 0 1 1 -3 -3a4.5 4.5 0 1 1 4.5 4.5a6 6 0 1 1 -6 -6"/>',
    '<circle cx="12" cy="12" r="4.5" fill="currentColor"/>',
    '<rect x="7.5" y="7.5" width="9" height="9" rx="1.5" fill="currentColor"/>',
    '<path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" d="M12 3C12.6 9 15 11.4 21 12C15 12.6 12.6 15 12 21C11.4 15 9 12.6 3 12C9 11.4 11.4 9 12 3Z"/>',
    '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M12 1v22M1 12h22M7.5 7.5l2 2M14.5 14.5l2 2M16.5 7.5l-2 2M7.5 16.5l2-2"/>',
    '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 6v12M6 12h12"/>',
    '<circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/>'
  ];

  var makeSparkle = function (className, x, y) {
    var el = document.createElement('div');
    var size = 9 + Math.random() * 13;
    el.className = className;
    el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + SHAPES[Math.floor(Math.random() * SHAPES.length)] + '</svg>';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.color = SPARKLE_COLOR;
    el.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');
    document.body.appendChild(el);
    return el;
  };

  if (document.body.classList.contains('home-page')) {
    var THROTTLE_MS = 70;
    var LIFETIME_MS = 1100;
    var lastSpawn = 0;

    document.addEventListener('mousemove', function (e) {
      var now = Date.now();
      if (now - lastSpawn < THROTTLE_MS) return;
      lastSpawn = now;

      var star = makeSparkle('cursor-star', e.clientX + (Math.random() * 24 - 12), e.clientY + (Math.random() * 24 - 12));
      setTimeout(function () { star.remove(); }, LIFETIME_MS);
    });

    var BURST_COUNT = 7;
    var BURST_LIFETIME_MS = 600;

    document.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;

      for (var i = 0; i < BURST_COUNT; i++) {
        var angle = (Math.PI * 2 * i) / BURST_COUNT + Math.random() * 0.4;
        var dist = 26 + Math.random() * 20;

        var spark = makeSparkle('click-burst', e.clientX, e.clientY);
        spark.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        spark.style.setProperty('--dy', Math.sin(angle) * dist + 'px');

        (function (el) {
          setTimeout(function () { el.remove(); }, BURST_LIFETIME_MS);
        })(spark);
      }
    });
  }

  var caseStudyCards = document.querySelectorAll('.project-card, .work-card');
  if (caseStudyCards.length && !document.body.classList.contains('home-page')) {
    var readMeBadge = document.createElement('div');
    readMeBadge.className = 'read-me-follow';
    readMeBadge.textContent = 'View Project';
    document.body.appendChild(readMeBadge);

    caseStudyCards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        readMeBadge.textContent = card.dataset.status === 'coming-soon'
          ? 'Coming Soon'
          : 'View Project';
        readMeBadge.classList.add('is-visible');
      });
      card.addEventListener('mousemove', function (e) {
        readMeBadge.style.left = (e.clientX + 18) + 'px';
        readMeBadge.style.top = e.clientY + 'px';
      });
      card.addEventListener('mouseleave', function () {
        readMeBadge.classList.remove('is-visible');
      });
    });
  }
})();
