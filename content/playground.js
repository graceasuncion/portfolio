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
   - extra   optional (image windows); more photos, only in the focus view. The main
             image gets a thumbnail row underneath to switch between them:
             [{ src: '', alt: '', label: '' }]. Empty src shows a placeholder
             (label names it, e.g. 'shirt photo').
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

  // Fixed dot color for a category tag, so it looks the same on every window.
  // Tags not listed here use the window's accent.
  window.PLAYGROUND_KIND_COLORS = {
    MERCH: PLANET.play
  };

  window.PLAYGROUND = [
    {
      id: 'kapatid',
      file: 'fg39-shirt.png',
      kind: 'MERCH',
      accent: PLANET.play,
      title: 'Mga Kapatid Friendship Games 39 shirt design',
      desc: 'For Friendship Games 39, the largest student-run Filipinx-American event in the United States, I designed the official shirt for Mga Kapatid, UC Davis’s student-run Filipinx-American organization. It was my first time designing apparel, and seeing people wear something I created was really cool!',
      tools: ['Illustrator', 'Procreate'],
      media: {
        type: 'image',
        src: 'media/kapatid-shirt.png',
        fit: 'contain',
        fillGrid: true,  // desktop: fills its grid rows (crops a little backdrop) so the windows beside it line up
        alt: 'Black t-shirt printed like a comic book cover reading "The New Mga Kapatid takes on Friendship Games 39", with colourful hero silhouettes over a Philippine flag sunburst'
      },
      // Only shown when the window is clicked open
      extra: [
        { src: '', alt: '', label: 'shirt photo' }  // TODO: add photo path + alt text
      ],
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
      file: 'pcn38-branding.pdf',
      kind: ['BRANDING', 'SOCIAL MEDIA'],
      accent: PLANET.star,
      title: 'PCN 38 media kit',
      desc: 'TODO: one line about the role, e.g. ran the brand, socials and print for PCN 38 as Media Director.',
      tools: ['Illustrator', 'Photoshop', 'Instagram'],  // TODO: confirm tools
      media: {
        type: 'kit',
        brand: {
          name: 'Mga Kapatid',
          logo: { src: '', alt: 'PCN 38 logo' },          // TODO: logo file (square or round PNG/SVG)
          typeface: 'TODO',                              // TODO: display typeface name
          colors: ['#f0d074', '#6dab1e', '#edf2fd', '#e5e4e4', '#61961e', '#105213']
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
      title: 'PCN 38 shirts',
      desc: 'TODO: one line about the shirts, e.g. cast and crew shirts for PCN 38.',
      tools: ['Procreate'],
      media: {
        type: 'shirts',
        event: 'PCN 38',
        // One entry per design; more than one shows dot pagination.
        designs: [
          {
            name: 'Cast',
            front: {
              src: 'media/pcn38-shirt-front.png',
              alt: 'Front of the dark green PCN 38 shirt: a patterned sea turtle over a Philippine flag sun with white sampaguita flowers, framed by the script "Lakas ng Nakaraan, Liwanag ng Kinabukasan"'
            },
            back: {
              src: 'media/pcn38-shirt-back.png',
              alt: 'Back of the dark green PCN 38 shirt: "Philippine Culture Night, Mga Kapatid 38, 2026" with a sun, sampaguita flowers, a line of Baybayin script and a list of the night\'s dances, from Arnis to Waray Waray'
            }
          }
        ]
      },
      tidy: { col: '3 / 7', row: '5 / 6' },
      messy: { left: '36%', top: '660px', width: '40%', height: '330px', z: 1 }
    },
    {
      id: 'pcn38-ticket',
      file: 'pcn38-ticket.png',
      kind: 'PRINT',
      accent: PLANET.star,
      title: 'PCN 38 tickets',
      desc: 'TODO: one line about the tickets, e.g. printed show tickets for PCN 38.',
      tools: ['Procreate', 'Canva'],
      media: {
        type: 'ticket',
        src: 'media/pcn38-ticket.png',
        alt: 'PCN 38 ticket: Mga Kapatid presents the 38th Annual Philippine Culture Night, Lakas ng Nakaraan, Liwanag ng Kinabukasan, April 11 and 12',
        event: 'PCN 38',    // TODO: full show name
        date: 'TODO DATE',  // TODO: e.g. 'APR 12 2026'
        venue: 'TODO VENUE',
        time: 'TODO TIME',  // TODO: e.g. '7 PM'
        number: 'No. 0038'  // TODO: real ticket number format
      },
      tidy: { col: '4 / 7', row: '2 / 3' },
      messy: { left: '60%', top: '180px', width: '34%', height: '380px', z: 2 }
    },

    /* ---------- Coursework ---------- */
    {
      id: 'avatar-poster',
      file: 'atla-poster.pdf',
      kind: 'POSTER',
      accent: PLANET.work,
      title: 'Avatar: The Last Airbender in Concert tour poster',
      desc: 'TODO: one line about this piece, e.g. a world tour poster for Avatar: The Last Airbender in Concert, made for DES 16.',
      tools: ['Illustrator'],  // TODO: confirm tools
      media: {
        type: 'image',
        src: 'media/avatar-concert-poster.png',
        fit: 'contain',
        alt: 'Poster for Avatar: The Last Airbender in Concert, World Tour 2024–2025: the show logo over a starry dusk sky, three columns of tour dates and cities, and Appa the sky bison floating in front of a setting sun'
      },
      tidy: { col: '1 / 3', row: '5 / 6' }
    }
  ];
})();
