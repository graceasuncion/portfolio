/* =====================================================================
   About page content (about.html). Layout lives in about-assets/.
   Edit the text here; the page re-renders from it on load.

   rightNow   — the "Right now." card. Update `month` and the three items.
   experience — "Where I've been", newest first.
                category: 'Leadership' | 'Work' | 'Student org' | 'Education'
                logo (optional): square image path; empty shows an initials placeholder
                link (optional): { text, href }
   skills     — "What I bring" pills.
===================================================================== */
window.ABOUT = {
  rightNow: {
    month: 'NOV 2026',

    playing: {
      title: 'Final Fantasy VII Rebirth',
      image: 'media/ff7-rebirth.jpg',  // optional; leave '' for the ASCII planet scene
      // optional sharper sizes: the browser picks the best one for the screen
      imageSrcset: 'media/ff7-rebirth-1200.jpg 1200w, media/ff7-rebirth.jpg 2560w',
      platform: 'PC',
      hours: 56,         // N hrs played
      level: 0,          // LV.N in the thumbnail
      hp: 4              // filled HP blocks, out of 5
    },

    watching: {
      title: 'Attack on Titan',
      image: 'media/attack-on-titan.jpg',
      imageSrcset: 'media/attack-on-titan-1200.jpg 1200w, media/attack-on-titan.jpg 2560w',
      imagePosition: 'center 45%',   // optional crop focus: keeps the titan and the title in frame
      season: 3,
      episode: 1,
      episodes: 22       // progress line = episode / episodes
    },

    onRepeat: {
      title: 'Hot & talking',
      artist: 'Say Now',
      cover: 'media/hot-and-talking.jpg',   // square album art; leave '' for a drawn record
      // Spotify track link (or embed link): clicking ▶ plays it on the page
      spotify: 'https://open.spotify.com/track/2P9AVxACR93BZDs3l79cfl'
    }
  },

  experience: [
    {
      dates: 'Apr – Jun 2026',
      org: 'Design Interactive',
      logo: 'media/logos/design-interactive.jpg',
      role: 'Product Designer',
      desc: 'Thread.It',
      category: 'Student org',
      link: { text: 'read the Thread.It case study →', href: 'thread-it.html' }
    },
    {
      dates: 'Feb 2025 – Jun 2026',
      org: 'UC Davis Career Center',
      logo: 'media/logos/ucd-career-center.jpg',
      role: 'Design & Marketing Student Assistant',
      desc: '',
      category: 'Work'
    },
    {
      dates: 'Jun 2025 – Apr 2026',
      org: 'Mga Kapatid (PCN 38)',
      logo: 'media/logos/mga-kapatid.jpg',
      role: 'Media Director',
      desc: '',
      category: 'Leadership',
      link: { text: 'see it in my playground →', href: 'play.html' }
    },
    {
      dates: 'Mar 2025 – Mar 2026',
      org: 'Design Interactive',
      logo: 'media/logos/design-interactive.jpg',
      role: 'Vice President of Operations',
      desc: '',
      category: 'Leadership'
    },
    {
      dates: 'Jun 2024 – Jun 2025',
      org: 'Mga Kapatid',
      logo: 'media/logos/mga-kapatid.jpg',
      role: 'Public Relations Chair',
      desc: '',
      category: 'Leadership'
    },
    {
      dates: 'Oct 2023 – Jun 2024',
      org: 'CodeLab',
      logo: 'media/logos/codelab.jpg',
      role: 'Product Designer',
      desc: 'Automail',
      category: 'Student org',
      link: { text: 'read the Automail case study →', href: 'automail.html' }
    },
    {
      dates: 'Nov 2023 – Mar 2024',
      org: '#include',
      logo: 'media/logos/include.jpg',
      role: 'Product Designer',
      desc: 'Paul Hom Asian Clinic',
      category: 'Student org',
      link: { text: 'read the Paul Hom case study →', href: 'paul-hom.html' }
    },
    {
      dates: 'Sep 2022 – Jun 2026',
      org: 'UC Davis',
      logo: 'media/logos/uc-davis.jpg',
      role: 'B.A. in Cognitive Science & Design',
      desc: '',
      category: 'Education'
    }
  ],

  skills: [
    'User research',
    'Interaction design',
    'Prototyping',
    'Usability testing',
    'Design systems',
    'Visual & brand design',
    'Motion graphics',
    'Figma',
    'Community building',
    'Team leadership'
  ]
};
