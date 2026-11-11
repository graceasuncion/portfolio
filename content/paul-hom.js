/* Paul Hom Asian Clinic — case study content. Layout + field docs: content/example.js */
window.CASE_STUDY = {
  projectName: 'Paul Hom Asian Clinic',
  impactTitle: 'A refreshed, accessible website for a student-run clinic serving underserved Asian communities',
  summary: '',
  status: '',
  tags: ['Web Responsive', 'Accessibility', 'Nonprofit'],
  meta: {
    role: 'Product Designer',
    timeline: '8 weeks',
    tools: 'Figma, FigJam'
  },
  accent: '#B5603F',
  planet: 'spots',
  showGuides: false,

  cover: {
    src: 'media/paul%20hom-cover.png', width: 1280, height: 720,
    alt: 'Paul Hom Asian Clinic website redesign, desktop and mobile views'
  },

  tldr: [
    { label: 'What it is', text: 'Paul Hom Asian Clinic is a student-run organization providing free healthcare to underserved and uninsured Asian communities.' },
    { label: 'What we did', text: 'We redesigned its website so patients can find care, volunteers can get involved, and donors can give, with accessibility for elderly patients at the center.' },
    { label: 'My role', text: 'I worked across research, the design system, and design, owning the Committee page on desktop and mobile from low-fi through final hi-fi.' }
  ],

  next: { name: 'Thread.It', href: 'thread-it.html', year: '2026' },

  sections: [
    {
      id: 'problem', label: 'Problem', title: 'Problem',
      blocks: [
        { type: 'headline', text: 'A Mission the Website Couldn’t Communicate' },
        { type: 'text', text: 'The clinic’s website hadn’t kept pace with its mission. It looked outdated, was hard to navigate, and didn’t convey the professionalism or warmth the organization stands for. Unclear navigation, inconsistent branding, and poor accessibility created barriers for three groups:' },
        { type: 'bullets', items: ['Patients trying to find care', 'Volunteers trying to get involved', 'Donors trying to give'] },
        { type: 'text', text: 'These barriers hit hardest for the clinic’s older patients, who make up a large share of the people the site needs to serve.' }
      ]
    },
    {
      id: 'research', label: 'Research', title: 'Research',
      blocks: [
        { type: 'headline', text: 'Outdated, Hard to Read, Hard to Navigate' },
        {
          type: 'cards', label: 'We audited the original website across three lenses:',
          items: [
            { title: 'Branding', text: 'Outdated visuals and an inconsistent identity' },
            { title: 'Accessibility', text: 'Small text, low contrast, and cluttered layouts' },
            { title: 'Design', text: 'Unclear hierarchy and confusing navigation' }
          ]
        },
        { type: 'text', text: 'To see how others solved similar problems, we analyzed student-run and professional clinics: Imani Clinic, Bayanihan Clinic, Shifa Community Clinic, and Stanford Medicine. This surfaced patterns in navigation and readability, and most importantly, in how clinics build trust through design.' },
        /* TODO: add the competitor analysis visuals (src, alt, width, height) */
        { type: 'figures', items: [{ src: '', alt: 'Competitor analysis visuals', placeholder: 'Competitor analysis visuals' }] },
        { type: 'keyInsight', text: 'The site’s problems weren’t cosmetic. For an elderly visitor, small text and confusing navigation can be the difference between finding care and giving up, which is the gap I focused on closing.' }
      ]
    },
    {
      id: 'design-process', label: 'Design Process', title: 'Design Process',
      blocks: [
        { type: 'headline', text: 'Designing for Users We Couldn’t Reach' },
        { type: 'text', text: 'How do you design for people you can’t talk to?' },
        { type: 'text', text: 'Many of the clinic’s patients are elderly members of the Asian community, and we had no way to interview or test with them directly. Instead, we relied on competitor analysis, heuristic evaluation, and insights from clinic volunteers who work with this population every day. Without direct testing, we couldn’t afford to guess, so ==readability, high contrast, simplified layouts, and clear hierarchy became non-negotiable==.' },
        { type: 'myRole', text: 'I owned the Committee page, which presents the clinic’s team roles.' },

        { type: 'headline', text: 'Low-fidelity sketches' },
        { type: 'text', text: 'We started by simplifying navigation and improving readability. I focused on how to present team roles and information clearly across desktop and mobile.' },
        /* TODO: add the low-fi sketches */
        { type: 'figures', items: [{ src: '', alt: 'Low-fi sketches', placeholder: 'Low-fi sketches' }] },

        { type: 'headline', text: 'Mid-fidelity wireframes' },
        { type: 'text', text: 'We introduced cards to break up dense information and improve scannability. I structured the Committee page around a card-based layout so users could browse team roles without feeling overwhelmed.' },
        /* TODO: add the mid-fi wireframes */
        { type: 'figures', items: [{ src: '', alt: 'Mid-fi wireframes', placeholder: 'Mid-fi wireframes' }] },

        { type: 'headline', text: 'High-fidelity design' },
        {
          type: 'bullets', label: 'With the design system in place, I strengthened readability and hierarchy:',
          items: [
            'Larger, high-contrast typography for elderly users',
            'Consistent spacing for a clearer information flow',
            'A responsive card structure that adapts across desktop and mobile'
          ]
        }
      ]
    },
    {
      id: 'design-system', label: 'Design System', title: 'Design System',
      blocks: [
        { type: 'headline', text: 'Warm, Trustworthy, Culturally Grounded' },
        { type: 'text', text: 'Before moving to hi-fi, we built a lightweight design system to keep five designers’ work consistent across the site:' },
        {
          type: 'cards',
          items: [
            { title: 'Color palette', text: 'Neutrals with red and gold accents, reflecting warmth, care, and subtle Asian cultural symbolism' },
            { title: 'Typography', text: 'A slightly curved sans-serif for an approachable, elegant feel' },
            { title: 'Components', text: 'Card layouts, buttons, spacing rules, and iconography optimized for readability and accessibility' }
          ]
        }
      ]
    },
    {
      id: 'final-product', label: 'Final Product', title: 'Final Product',
      blocks: [
        { type: 'headline', text: 'Clarity Without Losing Warmth' },
        /* TODO: add the final Committee page screens (desktop + mobile) */
        {
          type: 'figures',
          items: [
            { src: '', alt: 'Final Committee page, desktop', placeholder: 'Final Committee page — desktop' },
            { src: '', alt: 'Final Committee page, mobile', placeholder: 'Final Committee page — mobile' }
          ]
        }
      ]
    },
    {
      id: 'reflection', label: 'Reflection', title: 'Reflection',
      blocks: [
        {
          type: 'takeaways',
          items: [
            { title: 'Designing without direct user access', text: 'Without the ability to interview the clinic’s elderly patients, I relied on indirect research and volunteer insights to guide decisions about readability, contrast, and layout. It taught me to design with clarity and empathy when the people I’m designing for are out of reach.' },
            { title: 'Accessibility as a foundation', text: 'Treating accessibility as a core principle from the first sketch, rather than a final check, shaped every decision on the Committee page. It strengthened my ability to navigate ambiguity and create a cohesive, culturally sensitive interface that supports the clinic’s mission.' }
          ]
        }
      ]
    }
  ]
};
