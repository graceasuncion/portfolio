/* =====================================================================
   PLAYGROUND WINDOWS — one entry per window on play.html.
   Add a window by adding one entry. Layout + rendering: playground-assets/

   Fields
   - id      unique slug (lowercase, dashes)
   - file    filename in the title bar, e.g. 'chrysalis.3d'
   - kind    short label, e.g. '3D' | 'APP' | 'AI' | 'TOOL' | 'DRAW' | 'MERCH' | 'MOTION'
             or a list for several tags, e.g. ['BRANDING', 'SOCIAL MEDIA']
   - accent  a planet color (see PLANET below) or any CSS color
   - title   italic serif title in the focus view
   - desc    one-line description in the focus view
   - tools   array of tool names, shown in the focus view's Tools section
   - media   what fills the window body (see "Media types")
   - tidy    grid placement on the 6-column grid: { col: '1 / 5', row: '1 / 3' }
             (rows are at least 280px tall)
   - group   optional; shows a small ◆ tag at the top-left of the window body
   - messy   optional; free placement for a messy/overlapping layout:
             { left, top, width, height, z }. top is measured from the top
             of the window's cluster. NOTE: nothing renders this yet.

   Media types
   - { type: '3d', video: '', poster: '', ratio: '', spline: '', interactive: false }
       video  → plays muted on loop (poster shows with reduced motion)
       ratio  → the video's shape, e.g. '16 / 9'; the window keeps that
                shape so the video isn't cropped
       spline → iframe embed URL (e.g. 'https://my.spline.design/...')
       interactive: true lets visitors drag the Spline scene; only the
       title bar then opens the focus view.
       Leave video and spline empty for a floating placeholder object.
   - { type: 'phone', src: '', alt: '' }         app screen in a phone frame
   - { type: 'chat', src: '', alt: '', messages: [{ from: 'user'|'ai', text }] }
       src set → shows that image instead of the mock chat
   - { type: 'image', src: '', alt: '', fit: 'contain' }   a single image
       fit: 'contain' shows the whole image instead of cropping it to fill
       fillGrid: true (with fit: 'contain') → on desktop the window takes its
       height from the grid rows instead of the photo, cropping a little
   - { type: 'ascii' }                           generated ASCII placeholder
   - { type: 'grid', items: [{ src: '', alt: '' }, ...] }   sketch grid
   - { type: 'kit', brand: {...}, posts: {...}, results: {...} }
       three-column brand / posts / results board (see pcn38-kit)
   - { type: 'shirts', event: '', designs: [{ name, front: { src }, back: { src } }] }
       front + back side by side; 2+ designs adds dot pagination
   - { type: 'ticket', src: '', alt: '', event, date, venue, time, number }
       src set → shows the scan; otherwise a coded ADMIT ONE ticket

   Leaving a src empty shows a labelled placeholder.
===================================================================== */
(function () {
  var PLANET = {
    work: '#4f7c9e',     // blue
    about: '#8b7fd4',    // lavender
    play: '#d9694f',     // terracotta
    contact: '#6b8a47',  // green
    star: '#c9a440'      // gold
  };

  // Shared tag for the Media Director windows
  var PCN_GROUP = 'Mga Kapatid · MEDIA DIRECTOR · 2026';

  window.PLAYGROUND = [
    {
      id: 'kapatid',
      file: 'fg39-shirt.png',
      kind: 'MERCH',
      accent: PLANET.play,
      title: 'Kapatid tee',
      desc: 'Comic-book cover shirt for UC Davis at Friendship Games 39.',  // TODO: tweak wording
      tools: ['Illustrator', 'Procreate'],
      media: {
        type: 'image',
        src: 'media/kapatid-shirt.png',
        fit: 'contain',
        fillGrid: true,  // desktop: fills its grid rows (crops a little backdrop) so the windows beside it line up
        alt: 'Black t-shirt printed like a comic book cover reading "The New Mga Kapatid takes on Friendship Games 39", with colourful hero silhouettes over a Philippine flag sunburst'
      },
      tidy: { col: '1 / 4', row: '1 / 3' }
    },
    {
      id: 'mm',
      file: 'vivienne-westwood.mp4',
      kind: 'MOTION',
      accent: PLANET.about,
      title: 'Vivienne Westwood',
      desc: 'TODO: one line about this piece, e.g. a 30-second motion tribute to Vivienne Westwood.',
      tools: ['After Effects'],
      media: {
        type: '3d',
        video: 'media/GraceA_MM.mp4',  // TODO: compress (currently 29 MB)
        poster: 'media/mm-poster.png', // title frame; shown while loading and when motion is reduced
        ratio: '16 / 9',
        spline: '',
        interactive: false
      },
      tidy: { col: '4 / 7', row: '1 / 2' }
    },

    /* ---------- PCN 38 · Media Director ---------- */
    {
      id: 'pcn38-kit',
      file: 'pcn38-branding',
      kind: ['BRANDING', 'SOCIAL MEDIA'],
      accent: PLANET.star,
      group: PCN_GROUP,
      title: 'PCN 38 media kit',
      desc: 'TODO: one line about the role, e.g. ran the brand, socials and print for PCN 38 as Media Director.',
      tools: ['Illustrator', 'Photoshop', 'Instagram'],  // TODO: confirm tools
      media: {
        type: 'kit',
        brand: {
          name: 'Mga Kapatid',
          logo: { src: '', alt: 'PCN 38 logo' },          // TODO: logo file (square or round PNG/SVG)
          typeface: 'TODO',                              // TODO: display typeface name
          // TODO: swap for the real PCN 38 palette (placeholder: Philippine flag colours)
          colors: ['#0038a8', '#ce1126', '#fcd116', '#ffffff', '#1a1a1a']
        },
        posts: {
          handle: '@TODO',                               // TODO: Instagram handle
          count: 'TODO posts',                           // TODO: e.g. '48 posts'
          // TODO: 8 post / reel screenshots (square crops), with real like counts
          items: [
            { src: '', alt: 'PCN 38 announcement post', likes: '—' },
            { src: '', alt: 'PCN 38 ticket sale post', likes: '—' },
            { src: '', alt: 'PCN 38 cast reveal reel', likes: '—' },
            { src: '', alt: 'PCN 38 rehearsal reel', likes: '—' },
            { src: '', alt: 'PCN 38 shirt drop post', likes: '—' },
            { src: '', alt: 'PCN 38 countdown post', likes: '—' },
            { src: '', alt: 'PCN 38 show night reel', likes: '—' },
            { src: '', alt: 'PCN 38 thank-you post', likes: '—' }
          ]
        },
        results: {
          // TODO: real stats
          stats: [
            { value: '+X%', label: 'Engagement rate' },
            { value: 'N → N', label: 'Followers' }
          ],
          // Line chart, drawn from these points. TODO: real follower counts per month
          chart: {
            label: 'Follower growth',
            color: PLANET.work,
            points: [
              { label: 'SEP', value: 100 },
              { label: 'OCT', value: 130 },
              { label: 'NOV', value: 150 },
              { label: 'DEC', value: 210 },
              { label: 'JAN', value: 260 },
              { label: 'FEB', value: 340 },
              { label: 'MAR', value: 420 }
            ]
          }
        }
      },
      tidy: { col: '1 / 7', row: '3 / 5' },
      messy: { left: '5%', top: '0', width: '58%', height: '620px', z: 3 }
    },
    {
      id: 'pcn38-shirt',
      file: 'pcn38-shirts',
      kind: 'MERCH',
      accent: PLANET.star,
      group: PCN_GROUP,
      title: 'PCN 38 shirts',
      desc: 'TODO: one line about the shirts, e.g. cast and crew shirts for PCN 38.',
      tools: ['Illustrator', 'Procreate'],               // TODO: confirm tools
      media: {
        type: 'shirts',
        event: 'PCN 38',
        // One entry per design; more than one shows dot pagination.
        // TODO: front/back mockups (transparent PNGs work best). Delete the second design if there's only one.
        designs: [
          { name: 'Cast', front: { src: '' }, back: { src: '' } },
          { name: 'Crew', front: { src: '' }, back: { src: '' } }
        ]
      },
      tidy: { col: '4 / 7', row: '2 / 3' },
      messy: { left: '60%', top: '180px', width: '34%', height: '380px', z: 2 }
    },
    {
      id: 'pcn38-ticket',
      file: 'pcn38-ticket.jpeg',
      kind: 'PRINT',
      accent: PLANET.star,
      group: PCN_GROUP,
      title: 'PCN 38 tickets',
      desc: 'TODO: one line about the tickets, e.g. printed show tickets for PCN 38.',
      tools: ['Illustrator', 'InDesign'],                // TODO: confirm tools
      media: {
        type: 'ticket',
        src: '',            // TODO: ticket scan; when set, it replaces the coded ticket below
        alt: 'PCN 38 show ticket',
        event: 'PCN 38',    // TODO: full show name
        date: 'TODO DATE',  // TODO: e.g. 'APR 12 2026'
        venue: 'TODO VENUE',
        time: 'TODO TIME',  // TODO: e.g. '7 PM'
        number: 'No. 0038'  // TODO: real ticket number format
      },
      tidy: { col: '4 / 7', row: '5 / 6' },
      messy: { left: '36%', top: '660px', width: '40%', height: '330px', z: 1 }
    }
  ];
})();
