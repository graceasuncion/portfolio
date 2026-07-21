(function () {
  "use strict";
  console.log("running script.js");

  var hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        hero.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.3 });
    heroObserver.observe(hero);
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
