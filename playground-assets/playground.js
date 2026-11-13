/* =====================================================================
   Playground: renders the windows from content/playground.js and runs
   the focus view (click a window: it comes forward with its notes,
   the page blurs).
===================================================================== */
(function () {
  "use strict";

  var stage = document.querySelector('[data-stage]');
  var data = window.PLAYGROUND || [];
  var kindColors = window.PLAYGROUND_KIND_COLORS || {};
  if (!stage) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Small DOM helper: el('div', { class: 'x' }, [children]) */
  var el = function (tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      var value = attrs[key];
      if (value === null || value === undefined || value === false) return;
      if (key === 'text') node.textContent = value;
      else if (value === true) node.setAttribute(key, '');
      else node.setAttribute(key, value);
    });
    (children || []).forEach(function (child) { if (child) node.appendChild(child); });
    return node;
  };

  var todo = function (text) { return el('p', { class: 'pg-todo', text: text, 'aria-hidden': 'true' }); };
  var placeholder = function (text) { return el('div', { class: 'pg-ph', text: text, 'aria-hidden': 'true' }); };

  /* ---------- Media builders ---------- */
  var media = {
    '3d': function (m, item) {
      var body = el('div', { class: 'pg-body pg-media-3d' + (m.ratio ? ' pg-has-ratio' : '') });
      if (m.ratio) body.style.setProperty('--ratio', m.ratio);

      if (m.video) {
        var video = el('video', {
          class: 'pg-fill',
          // Without autoplay or a poster, '#t=0.1' makes the browser show an early frame instead of a blank box
          src: m.video + (reducedMotion.matches && !m.poster ? '#t=0.1' : ''),
          poster: m.poster || null,
          muted: true,
          loop: true,
          playsinline: true,
          preload: 'metadata',
          'aria-hidden': 'true'
        });
        video.muted = true;
        if (!reducedMotion.matches) {
          video.autoplay = true;
          video.play().catch(function () {});
        }
        body.appendChild(video);
      } else if (m.spline) {
        body.appendChild(el('iframe', {
          class: 'pg-fill',
          src: m.spline,
          title: item.title + ' 3D scene',
          loading: 'lazy',
          tabindex: m.interactive ? null : '-1'
        }));
      } else {
        body.appendChild(el('span', { class: 'pg-oval', 'aria-hidden': 'true' }));
        body.appendChild(el('span', { class: 'pg-object', 'aria-hidden': 'true' }));
        body.appendChild(todo('TODO · video or Spline embed'));
      }
      return body;
    },

    phone: function (m) {
      var screen = el('div', { class: 'pg-phone-screen' });
      if (m.src) {
        screen.appendChild(el('img', { class: 'pg-fill', src: m.src, alt: m.alt || '', loading: 'lazy' }));
      } else {
        screen.appendChild(el('div', { class: 'pg-fake', 'aria-hidden': 'true' }, [
          el('span', { class: 'pg-fake-title' }),
          el('span', { class: 'pg-fake-sub' }),
          el('span', { class: 'pg-fake-hero' }),
          el('span', { class: 'pg-fake-card' }),
          el('span', { class: 'pg-fake-card' }),
          el('span', { class: 'pg-fake-tab' })
        ]));
      }
      return el('div', { class: 'pg-body pg-media-phone' }, [el('div', { class: 'pg-phone' }, [screen])]);
    },

    chat: function (m, item) {
      if (m.src) return media.image(m, item);
      var log = el('ul', { class: 'pg-chat-log', 'aria-hidden': 'true' }, (m.messages || []).map(function (msg) {
        return el('li', { class: 'pg-msg pg-msg--' + (msg.from === 'user' ? 'user' : 'ai'), text: msg.text });
      }));
      var input = el('div', { class: 'pg-chat-input', 'aria-hidden': 'true' }, [
        el('span', { text: 'Ask ' + item.title + '…' }),
        el('span', { class: 'pg-chat-send', text: '↑' })
      ]);
      return el('div', { class: 'pg-body pg-media-chat' }, [log, input]);
    },

    image: function (m, item) {
      if (!m.src) return el('div', { class: 'pg-body pg-media-image' }, [placeholder('TODO · ' + item.file)]);
      var contain = m.fit === 'contain';
      var img = el('img', { class: 'pg-fill' + (contain ? ' pg-fill--contain' : ''), src: m.src, alt: m.alt || '', loading: 'lazy' });
      var body = el('div', {
        class: 'pg-body pg-media-image' + (contain ? ' pg-media-image--extend' : '') + (contain && m.fillGrid ? ' pg-media-image--fill-grid' : '')
      }, [img]);
      if (contain) {
        // The image sits at the bottom; its top row of pixels is stretched up to fill
        // the space above, so the photo's backdrop just continues (see CSS)
        body.style.backgroundImage = 'url("' + m.src + '")';
        // Small screens size the window to the photo's shape instead
        var setRatio = function () {
          if (img.naturalWidth) body.style.setProperty('--ratio', img.naturalWidth + ' / ' + img.naturalHeight);
        };
        if (img.complete) setRatio(); else img.addEventListener('load', setRatio);
      }
      // fit: 'contain' shows the whole image; bg fills the space around it
      if (m.bg) body.style.background = m.bg;
      return body;
    },

    ascii: function () {
      return el('div', { class: 'pg-body pg-media-ascii' }, [
        el('pre', { class: 'pg-ascii', text: asciiRipple(84, 24), 'aria-hidden': 'true' })
      ]);
    },

    grid: function (m) {
      var cells = (m.items || []).map(function (sketch, i) {
        return el('div', { class: 'pg-cell' }, [
          sketch.src
            ? el('img', { src: sketch.src, alt: sketch.alt || '', loading: 'lazy' })
            : placeholder('TODO · ' + (i < 9 ? '0' : '') + (i + 1))
        ]);
      });
      return el('div', { class: 'pg-body pg-media-grid' }, cells);
    },

    /* Role board: 01 Brand | 02 Posts | 03 Results */
    kit: function (m) {
      var brand = m.brand || {};
      var posts = m.posts || {};
      var results = m.results || {};

      var label = function (num, text) {
        return el('p', { class: 'pg-kit-label' }, [
          el('span', { class: 'pg-kit-num', text: num }),
          el('span', { text: text })
        ]);
      };

      // 01 Brand: logo + name + typeface, then the palette
      var logo = brand.logo || {};
      var brandCol = el('section', { class: 'pg-kit-col' }, [
        label('01', 'Brand'),
        el('div', { class: 'pg-kit-brand' }, [
          logo.src
            ? el('img', { class: 'pg-kit-logo', src: logo.src, alt: logo.alt || '', loading: 'lazy' })
            // TODO: logo (set brand.logo.src in content/playground.js)
            : el('span', { class: 'pg-kit-logo pg-kit-logo--ph', text: 'LOGO', 'aria-hidden': 'true' }),
          el('div', {}, [
            el('p', { class: 'pg-kit-org', text: brand.name || '' }),
            el('p', { class: 'pg-kit-meta', text: 'TYPE · ' + (brand.typeface || '') })
          ])
        ]),
        el('ul', { class: 'pg-kit-swatches', 'aria-label': 'Brand colours' }, (brand.colors || []).map(function (hex) {
          var chip = el('span', { class: 'pg-kit-swatch', 'aria-hidden': 'true' });
          chip.style.background = hex;
          return el('li', {}, [chip, el('span', { class: 'pg-kit-meta', text: hex.toUpperCase() })]);
        }))
      ]);

      // 02 Posts: profile row + 4×2 thumbnails
      var postsCol = el('section', { class: 'pg-kit-col' }, [
        label('02', 'Posts'),
        el('div', { class: 'pg-kit-profile' }, [
          el('span', { class: 'pg-kit-avatar', 'aria-hidden': 'true' }),
          el('strong', { class: 'pg-kit-handle', text: posts.handle || '' }),
          el('span', { class: 'pg-kit-meta', text: posts.count || '' })
        ]),
        el('ul', { class: 'pg-kit-posts' }, (posts.items || []).slice(0, 8).map(function (post, i) {
          return el('li', { class: 'pg-kit-post' }, [
            post.src
              ? el('img', { src: post.src, alt: post.alt || '', loading: 'lazy' })
              // TODO: post / reel screenshot
              : placeholder('TODO · ' + (i < 9 ? '0' : '') + (i + 1)),
            el('span', { class: 'pg-kit-likes', text: '♥ ' + (post.likes || '') })
          ]);
        }))
      ]);

      // 03 Results: stat rows + growth chart
      var resultsCol = el('section', { class: 'pg-kit-col' }, [
        label('03', 'Results'),
        el('dl', { class: 'pg-kit-stats' }, (results.stats || []).map(function (stat) {
          return el('div', { class: 'pg-kit-stat' }, [
            el('dt', { class: 'pg-kit-stat-label', text: stat.label }),
            el('dd', { class: 'pg-kit-stat-value', text: stat.value })
          ]);
        })),
        results.chart ? lineChart(results.chart) : null
      ]);

      return el('div', { class: 'pg-body pg-media-kit' }, [brandCol, postsCol, resultsCol]);
    },

    /* Front + back side by side; dots switch designs */
    shirts: function (m, item) {
      var designs = m.designs || [];
      var pair = el('div', { class: 'pg-shirts-pair' });
      var body = el('div', { class: 'pg-body pg-media-shirts' }, [pair]);
      var dots = [];

      var show = function (index) {
        var design = designs[index] || {};
        var name = (m.event || item.title) + (designs.length > 1 && design.name ? ' ' + design.name : '');
        pair.textContent = '';
        ['front', 'back'].forEach(function (side) {
          var shot = design[side] || {};
          var Side = side.charAt(0).toUpperCase() + side.slice(1);
          pair.appendChild(el('figure', { class: 'pg-shirt' }, [
            el('div', { class: 'pg-shirt-img' }, [
              shot.src
                ? el('img', { src: shot.src, alt: shot.alt || Side + ' of ' + name + ' shirt design', loading: 'lazy' })
                // TODO: shirt mockup
                : placeholder('TODO · ' + side + ' mockup')
            ]),
            el('figcaption', { class: 'pg-shirt-label', text: side.toUpperCase() })
          ]));
        });
        dots.forEach(function (dot, i) { dot.setAttribute('aria-pressed', i === index ? 'true' : 'false'); });
      };

      if (designs.length > 1) {
        dots = designs.map(function (design, i) {
          var dot = el('button', {
            type: 'button',
            class: 'pg-dot',
            'aria-label': 'Show ' + (design.name || 'design ' + (i + 1)) + ' shirt design'
          });
          // Don't let a dot click open/close the window
          dot.addEventListener('click', function (e) {
            e.stopPropagation();
            show(i);
          });
          return dot;
        });
        body.appendChild(el('div', { class: 'pg-dots' }, dots));
      }

      show(0);
      return body;
    },

    /* Ticket scan, or a coded ADMIT ONE ticket with a tear-off stub */
    ticket: function (m) {
      var body = el('div', { class: 'pg-body pg-media-ticket' });
      if (m.src) {
        body.appendChild(el('img', { class: 'pg-ticket-scan', src: m.src, alt: m.alt || '', loading: 'lazy' }));
        return body;
      }
      // TODO: replace with the ticket scan (media.src) once there is one
      var meta = [m.date, m.venue, m.time].filter(Boolean).join(' · ');
      body.appendChild(el('div', { class: 'pg-ticket-wrap' }, [
        el('div', { class: 'pg-ticket', role: 'img', 'aria-label': (m.alt || 'Ticket') + ': admit one, ' + (m.event || '') + (meta ? ', ' + meta : '') }, [
          el('div', { class: 'pg-ticket-main', 'aria-hidden': 'true' }, [
            el('p', { class: 'pg-ticket-admit', text: 'ADMIT ONE' }),
            el('p', { class: 'pg-ticket-event', text: m.event || '' }),
            el('p', { class: 'pg-ticket-meta', text: meta })
          ]),
          el('div', { class: 'pg-ticket-stub', 'aria-hidden': 'true' }, [
            el('span', { class: 'pg-ticket-no', text: m.number || '' })
          ])
        ])
      ]));
      return body;
    }
  };

  /* Line chart drawn from { label, value } points.
     The SVG stretches to its box; strokes stay crisp (non-scaling-stroke). */
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var svgEl = function (tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    return node;
  };

  function lineChart(chart) {
    var pts = chart.points || [];
    var W = 300, H = 120, PAD = 8;
    var values = pts.map(function (p) { return p.value; });
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    var span = max - min || 1;
    var xy = pts.map(function (p, i) {
      return [
        pts.length > 1 ? (i / (pts.length - 1)) * W : W / 2,
        PAD + (1 - (p.value - min) / span) * (H - PAD * 2)
      ];
    });
    var line = xy.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');

    var svg = svgEl('svg', { class: 'pg-chart-svg', viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'none', 'aria-hidden': 'true' });
    [0.25, 0.5, 0.75].forEach(function (f) {
      svg.appendChild(svgEl('line', { class: 'pg-chart-grid', x1: 0, x2: W, y1: H * f, y2: H * f, 'vector-effect': 'non-scaling-stroke' }));
    });
    if (xy.length) {
      svg.appendChild(svgEl('path', { class: 'pg-chart-area', d: line + ' L' + W + ' ' + H + ' L0 ' + H + ' Z' }));
      svg.appendChild(svgEl('path', { class: 'pg-chart-line', d: line, 'vector-effect': 'non-scaling-stroke' }));
    }

    var first = pts[0] || {};
    var last = pts[pts.length - 1] || {};
    var figure = el('figure', {
      class: 'pg-chart',
      role: 'img',
      'aria-label': (chart.label || 'Growth') + ': ' + pts.map(function (p) { return p.label + ' ' + p.value; }).join(', ')
    }, [
      el('figcaption', { class: 'pg-kit-meta', text: chart.label || '', 'aria-hidden': 'true' }),
      el('div', { class: 'pg-chart-plot' }, [svg]),
      el('div', { class: 'pg-chart-ends pg-kit-meta', 'aria-hidden': 'true' }, [
        el('span', { text: (first.label || '') + ' · ' + (first.value != null ? first.value : '') }),
        el('span', { text: (last.label || '') + ' · ' + (last.value != null ? last.value : '') })
      ])
    ]);
    if (chart.color) figure.style.setProperty('--pg-chart', chart.color);
    return figure;
  }

  /* Media body + the shared group tag (◆ GROUP) when the entry has one */
  function buildBody(m, item) {
    var body = (media[m.type] || media.image)(m, item);
    if (item.group) {
      body.insertBefore(el('p', { class: 'pg-group' }, [
        el('span', { class: 'pg-group-mark', text: '◆', 'aria-hidden': 'true' }),
        el('span', { text: item.group })
      ]), body.firstChild);
    }
    return body;
  }

  /* Placeholder art for ascii.gen: concentric ripples around a bright core */
  function asciiRipple(cols, rows) {
    var ramp = ' .·:-=+*#%@';
    var out = [];
    for (var y = 0; y < rows; y++) {
      var line = '';
      for (var x = 0; x < cols; x++) {
        var dx = (x - cols / 2) / 2.1;   // characters are ~2x taller than wide
        var dy = y - rows / 2;
        var d = Math.sqrt(dx * dx + dy * dy);
        var a = Math.atan2(dy, dx);
        var v = (Math.sin(d * 0.9 - a * 2) * 0.5 + 0.5) * Math.max(0, 1 - d / 15) + Math.max(0, 1 - d / 2.5);
        line += ramp[Math.min(ramp.length - 1, Math.floor(v * ramp.length))];
      }
      out.push(line);
    }
    return out.join('\n');
  }

  /* ---------- Window ---------- */
  var windows = {};

  // kind can be one label or a list of labels
  function kinds(item) {
    return [].concat(item.kind || []);
  }

  data.forEach(function (item) {
    var m = item.media || {};

    var win = el('article', {
      class: 'pg-window pg-window--' + (m.type || 'image') + (m.interactive ? ' is-interactive' : ''),
      'data-id': item.id
    });

    var tidy = item.tidy || {};
    win.style.setProperty('--accent', item.accent || '');
    win.style.setProperty('--col', tidy.col || 'auto');
    win.style.setProperty('--row', tidy.row || 'auto');

    var hit = el('button', {
      type: 'button',
      class: 'pg-hit',
      'aria-label': 'Open ' + item.file + ', ' + kinds(item).join(', '),
      'aria-haspopup': 'dialog'
    });

    // Listen on the window so clicks on the controls (which sit above the
    // button for their hover states) count too
    win.addEventListener('click', function () {
      openFocus(item, win, hit);
    });

    win.appendChild(titlebar(item));
    win.appendChild(buildBody(m, item));
    win.appendChild(hit);
    stage.appendChild(win);
    windows[item.id] = win;
  });

  /* Title bar: ✦ file.ext (KIND)  – □ ×
     On the cards the controls are decoration; in the focus view × is a real close button. */
  function titlebar(item, closeBtn) {
    return el('div', { class: 'pg-titlebar' }, [
      el('div', { class: 'pg-tb-left', 'aria-hidden': closeBtn ? null : 'true' }, [
        el('span', { class: 'pg-tb-star', text: '✦', 'aria-hidden': 'true' }),
        el('span', { class: 'pg-file', text: item.file })
      ]),
      // Right side: the category tag, then the window controls
      el('div', { class: 'pg-tb-right' }, [
        el('span', { class: 'pg-kinds', 'aria-hidden': closeBtn ? null : 'true' }, kinds(item).map(function (kind) {
          return el('span', { class: 'pg-kind' }, [
            el('span', { class: 'pg-kind-dot', 'aria-hidden': 'true', style: kindColors[kind] ? 'background:' + kindColors[kind] : null }),
            el('span', { text: kind })
          ]);
        })),
        el('div', { class: 'pg-controls' }, [
          el('span', { class: 'pg-control', text: '–', 'aria-hidden': 'true' }),
          el('span', { class: 'pg-control', text: closeBtn ? '❐' : '□', 'aria-hidden': 'true' }),
          closeBtn || el('span', { class: 'pg-control pg-control--close', text: '×', 'aria-hidden': 'true' })
        ])
      ])
    ]);
  }

  /* ---------- Focus view: the window comes forward, page behind blurs ---------- */
  var focus = el('dialog', { class: 'pg-focus', 'aria-labelledby': 'pg-focus-title' });
  var focusWin = el('div', { class: 'pg-window pg-focus-window' });
  focus.appendChild(focusWin);
  document.body.appendChild(focus);

  var current = null; // { win, hit }

  /* Focus-view gallery: the main image plus item.extra, switched with thumbnails.
     The frame keeps the main image's size, so switching photos doesn't resize the window. */
  function gallery(body, m, item) {
    var img = body.querySelector('img');
    var slides = [{ src: m.src, alt: m.alt || '' }].concat(item.extra);
    var ph = null;
    var thumbs = [];

    var lockSize = function () { if (img.naturalWidth) body.style.width = body.offsetWidth + 'px'; };
    if (img.complete) requestAnimationFrame(lockSize); else img.addEventListener('load', lockSize);

    var show = function (i) {
      var s = slides[i];
      if (ph) { ph.remove(); ph = null; }
      if (s.src) {
        img.src = s.src;
        img.alt = s.alt || '';
        img.style.visibility = '';
      } else {
        img.style.visibility = 'hidden';
        ph = placeholder('TODO · ' + (s.label || 'extra photo'));
        ph.classList.add('pg-gallery-ph');
        body.appendChild(ph);
      }
      thumbs.forEach(function (t, j) { t.setAttribute('aria-current', j === i ? 'true' : 'false'); });
    };

    var list = el('ul', { class: 'pg-thumbs', 'aria-label': 'Photos' }, slides.map(function (s, i) {
      var btn = el('button', { type: 'button', class: 'pg-thumb', 'aria-label': 'Photo ' + (i + 1) + ' of ' + slides.length }, [
        s.src ? el('img', { src: s.src, alt: '' }) : placeholder('TODO')
      ]);
      btn.addEventListener('click', function () { show(i); });
      thumbs.push(btn);
      return el('li', {}, [btn]);
    }));

    show(0);
    return el('div', { class: 'pg-gallery' }, [body, list]);
  }

  function openFocus(item, win, hit) {
    if (focus.open) return;
    var m = item.media || {};
    var closeBtn = el('button', { type: 'button', class: 'pg-control pg-control--close', text: '×', 'aria-label': 'Close' });
    closeBtn.addEventListener('click', closeFocus);

    focusWin.className = 'pg-window pg-focus-window pg-window--' + (m.type || 'image');
    focusWin.style.setProperty('--accent', item.accent || '');
    focusWin.textContent = '';
    focusWin.appendChild(titlebar(item, closeBtn));
    var mediaEl = buildBody(m, item);
    // Extra photos only appear here in the focus view, as a thumbnail gallery
    if ((item.extra || []).length && m.type === 'image' && m.src) mediaEl = gallery(mediaEl, m, item);
    var tools = item.tools || [];
    // Media on the left, notes on the right (stacked on small screens, see CSS)
    focusWin.appendChild(el('div', { class: 'pg-focus-content' }, [mediaEl, el('div', { class: 'pg-notes' }, [
      el('div', {}, [
        el('h3', { class: 'pg-notes-title', id: 'pg-focus-title', text: item.title }),
        el('p', { class: 'pg-notes-desc', text: item.desc })
      ]),
      // Tools section: a label + the portfolio's .tag pills
      el('section', { class: 'pg-tools', 'aria-labelledby': 'pg-tools-label' }, [
        el('h4', { class: 'pg-tools-label', id: 'pg-tools-label', text: 'Tools' }),
        tools.length
          ? el('ul', { class: 'tag-row pg-tools-list' }, tools.map(function (tool) { return el('li', { class: 'tag', text: tool }); }))
          : el('p', { class: 'pg-tools-empty', text: 'TODO: add tools in content/playground.js' })
      ])
    ])]));

    current = { win: win, hit: hit };
    focus.classList.remove('is-closing');
    focus.showModal();
    closeBtn.focus();
    fly(win, 'in');
  }

  function closeFocus() {
    if (!focus.open || !current) return;
    var c = current;
    current = null;
    focus.classList.add('is-closing'); // fades the blur out (CSS)
    fly(c.win, 'out', function () {
      focus.close();
      focus.classList.remove('is-closing');
      focusWin.textContent = ''; // stops any video or embed
      c.hit.focus({ preventScroll: true });
    });
  }

  /* Only the window itself animates: it flies in from the card's spot and fades out in place.
     (A page-wide view transition would snapshot the fixed nav and sticky hero,
     which made the header glitch.) */
  var FLY_MS = 420;

  function fly(card, dir, done) {
    if (reducedMotion.matches || !focusWin.animate) {
      if (done) done();
      return;
    }
    var from = card.getBoundingClientRect();
    var to = focusWin.getBoundingClientRect();
    var scale = from.width / to.width;
    var dx = (from.left + from.width / 2) - (to.left + to.width / 2);
    var dy = (from.top + from.height / 2) - (to.top + to.height / 2);
    var atCard = { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(' + scale + ')', opacity: 0 };
    var settled = { transform: 'none', opacity: 1 };

    // Closing: the window gently fades in place over the first part, while the
    // blur loosens over the whole 400ms (CSS), then the dialog closes
    var closing = [{ opacity: 1 }, { opacity: 0, offset: 0.6 }, { opacity: 0 }];
    var duration = dir === 'in' ? FLY_MS : 400;
    var anim = focusWin.animate(dir === 'in' ? [atCard, settled] : closing, {
      duration: duration,
      easing: dir === 'in' ? 'cubic-bezier(0.2, 0.8, 0.2, 1)' : 'ease-in-out',
      fill: 'both'
    });

    // Finish once, on the animation's end or a timer fallback (e.g. a background tab)
    var finished = false;
    var finish = function () {
      if (finished) return;
      finished = true;
      if (done) done();
      anim.cancel();
    };
    anim.onfinish = finish;
    setTimeout(finish, duration + 150);
  }

  // Esc and clicks on the blurred backdrop close it too
  focus.addEventListener('cancel', function (e) { e.preventDefault(); closeFocus(); });
  focus.addEventListener('click', function (e) { if (e.target === focus) closeFocus(); });

})();
