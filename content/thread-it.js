/* Thread.It — case study content. Layout + field docs: content/example.js */
window.CASE_STUDY = {
  projectName: 'Thread.It',
  impactTitle: 'Turning Decision Fatigue Into a Structured 4-Step Planning Flow',
  summary: '',
  status: 'Best Overall',
  tags: ['Mobile', 'B2C'],
  meta: {
    role: 'Product Designer',
    timeline: '6 weeks',
    tools: 'Figma, FigJam, Claude'
  },
  accent: '#2F6FA3',
  planet: 'ring',
  showGuides: false,

  cover: {
    src: 'media/thread.it-cover.png', width: 1280, height: 720,
    alt: 'Thread.It app screens showing the planning quiz, onboarding, and closet views'
  },

  tldr: [
    { label: 'What it is', text: 'Thread.It is a mobile app that builds users’ confidence and helps them develop their own sense of style with the clothes they already own and through discovery.' },
    { label: 'My role', text: 'I worked across research, ideation, and design, owning the Planning Quiz and Calendar features.' },
    { label: 'Outcome', text: 'Our team was recognized as Best Overall, amongst 4 other projects by judges from LinkedIn, ServiceNow, and Computrition.' }
  ],
  tldrLink: { text: 'See Solution', href: '#final-product' },

  next: { name: 'Automail', href: 'automail.html', company: 'CodeLab', year: '2024' },

  sections: [
    {
      id: 'problem', label: 'Problem', title: 'Problem',
      blocks: [
        { type: 'headline', text: 'Personal Style, Without a Personal Stylist' },
        { type: 'text', text: 'Professional styling is expensive and out of reach for most people, and building a wardrobe that feels personal leaves people to navigate endless options alone.' }
      ]
    },
    {
      id: 'research', label: 'Research', title: 'Research',
      blocks: [
        { type: 'headline', text: 'Full Closets, Nothing to Wear' },
        { type: 'text', text: 'Through 2 in-depth interviews and a 74-person survey, I looked at how people actually discover fashion, plan outfits, and get dressed.' },
        {
          type: 'results',
          items: [
            { value: '95%', label: 'Discover fashion from an online source (ex Pinterest, Instagram, TikTok)' },
            { value: '72%', label: 'Have full wardrobes, but felt like they had nothing to wear' },
            { value: '51%', label: 'Bought clothing in the past, but barely wore it' }
          ]
        },
        { type: 'keyInsight', text: 'People have plenty of inspiration but can’t turn it into outfits from their own closets, which I focused on closing.' },
        { type: 'text', text: 'Interviews revealed these three patterns:' },
        {
          type: 'cards',
          items: [
            { label: 'Pattern 1', title: 'Decision fatigue', text: 'Rather than work through a new outfit, people fell back on safe “preset” outfits they knew would work.' },
            { label: 'Pattern 2', title: 'No outfit memory', text: 'People had no record of what they’d worn or what worked, so every outfit started from scratch.' },
            { label: 'Pattern 3', title: 'Outfits that don’t work as planned', text: 'People often planned outfits in their heads that didn’t come together once they tried them on.' }
          ]
        },
        { type: 'quote', text: 'I’ll plan an outfit in my head and think it looks good, but when I try it on, it just doesn’t work' }
      ]
    },
    {
      id: 'define', label: 'Define', title: 'Define',
      blocks: [
        { type: 'headline', text: 'Confidence Should be the Users’ to Define' },
        { type: 'text', text: 'How do we measure success for an app about confidence, and what keeps people coming back?' },
        { type: 'text', text: 'Confidence is personal, so we didn’t want to define it for users. That ruled out features that judged appearance, including AR try-on. I raised the concern that comparing yourself to a virtual model could hurt confidence instead of building it, and the team cut it. Instead, we measured consistency: if people kept coming back to plan outfits, the app was working.' },
        /* Visual: built from the paragraph above. Swap for an image with
           { type: 'figures', items: [{ src, alt, width, height }] } if you prefer. */
        {
          type: 'decisionCards',
          explored: { title: 'AR Try-On', text: 'Comparing yourself to a virtual model could hurt confidence instead of building it.' },
          adopted: { title: 'Consistency', text: 'If people kept coming back to plan outfits, the app was working.' }
        }
      ]
    },
    {
      id: 'usability-testing', label: 'Usability Testing', title: 'Usability Testing',
      blocks: [
        { type: 'headline', text: 'Small Friction Points, Big Flow Changes' },
        {
          type: 'usabilityFinding',
          title: 'Confirm-Date Friction',
          old: [
            { src: 'media/date%20%2B%20weather%20(old%20midf).png', width: 393, height: 852, alt: 'Old mid-fi date confirmation screen' },
            { src: 'media/forecast%20page%20(old%20midfi).png', width: 393, height: 852, alt: 'Old mid-fi weather forecast screen' }
          ],
          new: [
            { src: 'media/landing%20page%20(new%20midfi).png', width: 402, height: 874, alt: 'New mid-fi landing screen with persistent calendar and weather chip' }
          ],
          notes: [
            { kind: 'old', n: 1, text: 'Date confirmation was its own screen before users could continue.' },
            { kind: 'old', n: 2, text: 'Weather was a separate screen too, adding another step before the quiz' },
            { kind: 'new', n: 1, text: 'The date defaults to today, so the quiz starts right away' },
            { kind: 'new', n: 2, text: 'Weather chips pull real-time conditions automatically, with no separate screen or app needed' }
          ]
        },
        {
          type: 'usabilityFinding',
          title: 'Closet Browsing',
          old: [{ src: 'media/my%20closet%20(old%20midfi).png', width: 393, height: 852, alt: 'Old mid-fi closet screen with abstract add icon' }],
          new: [{ src: 'media/my%20closet%20(new%20midfi).png', width: 402, height: 871, alt: 'New mid-fi closet screen with photo tiles, search, and filter pills' }],
          notes: [
            { kind: 'old', n: 1, text: 'Users didn’t recognize the “+” icon as the way to add an item' },
            { kind: 'new', n: 1, text: 'Tap-to-select photo tiles replace the “+” icon' },
            { kind: 'new', n: 2, text: 'A search bar lets users find items by name or brand' },
            { kind: 'new', n: 3, text: 'Filter pills (All, Tops, Bottoms, Shoes, Outerwear) let users narrow the closet the way they expected' }
          ]
        },
        {
          type: 'usabilityFinding',
          title: 'Occasion Clarity',
          old: [{ src: 'media/occasion%20page%20(old%20midfi).png', width: 393, height: 852, alt: 'Old mid-fi occasion screen with Skip option' }],
          new: [{ src: 'media/occasion%20page%20(new%20midfi).png', width: 402, height: 874, alt: 'New mid-fi occasion screen with Other category' }],
          notes: [
            /* TODO from your draft: "Add another number to the occasions" */
            { kind: 'old', n: 1, text: 'Only four preset occasions were available' },
            { kind: 'old', n: 2, text: 'The “Skip” button sat at the bottom and didn’t let users add their own' },
            { kind: 'new', n: 1, text: 'An “Other” option lets users type in their own occasion' },
            { kind: 'new', n: 2, text: 'It sits at the top of the screen, visible without scrolling' }
          ]
        },
        {
          type: 'usabilityFinding',
          title: 'Outfit Selection Clarity',
          old: [{ src: 'media/preview%20page%20(old%20midfi).png', width: 393, height: 852, alt: 'Old mid-fi one-item-at-a-time outfit preview' }],
          new: [{ src: 'media/preview%20page%20(new%20midfi).png', width: 402, height: 874, alt: 'New mid-fi full assembled outfit preview' }],
          notes: [
            { kind: 'old', n: 1, text: 'Users saw one item at a time, making it hard to picture the full outfit' },
            { kind: 'new', n: 1, text: 'A full outfit preview shows the top, bottom, and shoes together before users confirm' }
          ]
        }
      ]
    },
    {
      id: 'final-product', label: 'Final Product', title: 'Final Product',
      blocks: [
        { type: 'headline', text: 'Structure for Today, Memory for Tomorrow' },
        {
          type: 'features',
          items: [
            {
              name: 'Planning Quiz',
              text: 'We wanted getting dressed to feel simple, not overwhelming. The Planning Quiz breaks the decision into four steps: date, occasion, weather, and saved looks.',
              media: { src: 'media/planning-quiz-prototype.gif', width: 394, height: 804, alt: 'Planning quiz prototype walkthrough, including drag-to-arrange' }
            },
            {
              name: 'Calendar & Outfit Log',
              text: 'We wanted users to see their outfits at a glance, both past and upcoming. The Calendar & Outfit Log tracks what users have worn and what they’ve planned, all in one place.',
              media: { src: 'media/calendar.gif', width: 220, height: 480, alt: 'Calendar and outfit log walkthrough' }
            }
          ]
        }
      ]
    },
    {
      id: 'impact', label: 'Impact', title: 'Impact',
      blocks: [
        { type: 'headline', text: 'Best Overall!' },
        { type: 'text', text: 'Thread.It was recognized as Best Overall out of 5 cohort projects. Our final presentation was judged by 3 industry professionals from LinkedIn, ServiceNow, and Computrition, who all noted our team’s storytelling by making the problem tangible and reliable. It made Thread.It a solution to a real problem, not a feature-driven product.' },
        { type: 'figures', items: [{ src: 'media/DSC04282.jpg', width: 6000, height: 4000, alt: 'The Thread.It team holding their Best Overall certificates' }] },
        { type: 'link', text: 'View project slide deck', href: 'https://lnkd.in/g8X8eRDs' }
      ]
    },
    {
      id: 'reflection', label: 'Reflection', title: 'Reflection',
      blocks: [
        {
          type: 'takeaways',
          items: [
            { title: 'Advocating before there was a consensus', text: 'Pushing back on AR try-on meant challenging a direction the team had already started, without data to prove it. It taught me to get comfortable with ambiguity and to make a clear case for what I believed users needed' },
            { title: 'Designing for B2C', text: 'This was my first consumer product, where success meant people wanting to open the app again tomorrow, not just completing a flow. It changed how I saw features like streaks and the outfit log: not as add-ons, but as the core of retention.' }
          ]
        }
      ]
    }
  ]
};
