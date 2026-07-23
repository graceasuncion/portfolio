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

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var COLORS = ['var(--pink-deep)', 'var(--green-deep)', 'var(--blue-deep)', 'var(--yellow-deep)'];
  var CHARS = ['✦', '✧', '·'];
  var THROTTLE_MS = 90;
  var LIFETIME_MS = 900;
  var lastSpawn = 0;

  document.addEventListener('mousemove', function (e) {
    var now = Date.now();
    if (now - lastSpawn < THROTTLE_MS) return;
    lastSpawn = now;

    var star = document.createElement('div');
    star.className = 'cursor-star';
    star.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
    star.style.left = (e.clientX + (Math.random() * 10 - 5)) + 'px';
    star.style.top = (e.clientY + (Math.random() * 10 - 5)) + 'px';
    star.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    document.body.appendChild(star);

    setTimeout(function () { star.remove(); }, LIFETIME_MS);
  });
})();
