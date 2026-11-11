/* Automail — case study content. Layout + field docs: content/example.js */
window.CASE_STUDY = {
  projectName: 'Automail',
  impactTitle: 'Streamlining Fragmented Email Workflows into One Scalable Tool',
  summary: 'CodeLab is a student-run software and design agency at UC Davis providing students with real-world experience.',
  status: '',
  tags: ['B2B', 'Internal Tool', 'Desktop'],
  meta: {
    role: 'Product Design',
    timeline: '22 weeks',
    tools: 'Figma, FigJam, Google Forms, Zoom, Notion'
  },
  accent: '#3A7B99',
  planet: 'bands',
  showGuides: false,

  cover: {
    src: 'media/automail-cover.png', width: 1280, height: 720,
    alt: 'AutoMail dashboard and landing page screens'
  },

  tldr: [
    { label: 'What it is', text: 'Automail is an email automation tool built around CodeLab’s real recruitment workflow, replacing three disconnected tools with one.' },
    { label: 'My role', text: 'I worked across research, ideation, and design, owning the main landing page and the Contact Groups page.' },
    { label: 'Outcome', text: 'Our application sent 100+ personalized emails in under 5 minutes, replacing 8 hours of manual work.' }
  ],

  next: { name: 'Paul Hom Asian Clinic', href: 'paul-hom.html', company: 'Paul Hom Asian Clinic', year: '2024' },

  sections: [
    {
      id: 'problem', label: 'Problem', title: 'Problem',
      blocks: [
        { type: 'headline', text: 'Three Tools, One Broken Workflow' },
        { type: 'text', text: 'CodeLab’s recruitment outreach was split across Airtable, Mailchimp, and Gmail. Contacts lived in one tool, emails were built in another, and follow-ups were sent from a third. Simple sends became slow and error-prone right when recruitment cycles needed consistency most.' }
      ]
    },
    {
      id: 'research', label: 'Research', title: 'Research',
      blocks: [
        { type: 'headline', text: 'One Person, Thousands of Emails' },
        {
          type: 'text',
          text: [
            'Through a 10-person survey and a 45-minute interview with CodeLab’s President, I looked at how email automation worked.',
            'The President was pulling all-nighters to personalize and double-check recruitment emails one by one, anxious about getting sensitive information wrong. They wished for “a central place” where other board members could help.'
          ]
        },
        {
          type: 'cards', label: 'Key Insights',
          items: [
            { title: 'Constant re-syncing', text: 'Contact data had to be exported and re-uploaded between Airtable and Mailchimp before every send, with no personalization at scale.' },
            { title: 'Tools that broke at scale', text: 'Mailchimp’s audience caps failed during peak recruitment. Lists of 10k+ contacts needed real structure, not a workaround.' },
            { title: 'Two very different users', text: 'Power users wanted full template control, while non-technical members needed something that required no training.' }
          ]
        }
      ]
    },
    {
      id: 'define', label: 'Define', title: 'Define',
      blocks: [
        { type: 'headline', text: 'Built for the Team, Not the Brand' },
        { type: 'myRole', text: 'I raised the concern that our finished designs didn’t fit the product, and the team started over.' },
        { type: 'text', text: 'By the end of week 10, we had finished high-fi designs in an orange, Mailchimp-inspired style. But Automail was a developer-focused tool, and the creative look didn’t represent it. We rebuilt toward a cleaner interface with the same functionality.' },
        {
          type: 'figures', label: 'Before: orange, Mailchimp-inspired high-fi',
          items: [
            { src: 'media/home page (old hifi).png', width: 1512, height: 1143, alt: 'Old high-fidelity landing page, orange Mailchimp-inspired style', caption: 'Landing page' },
            { src: 'media/saved templates pop up (old hifi).png', width: 1040, height: 784, alt: 'Old high-fidelity saved templates popup, orange Mailchimp-inspired style', caption: 'Saved templates popup' }
          ]
        },
        {
          type: 'figures', label: 'After: cleaner interface',
          items: [
            { src: 'media/Home Page - automail (hifi).png', width: 1512, height: 982, alt: 'New high-fidelity home page, cleaner and simplified', caption: 'Home page' }
          ]
        },
        {
          type: 'cards', label: 'What changed',
          items: [
            { title: 'Minimalist interface', text: 'A neutral style that streamlines the tool instead of competing with it.' },
            { title: 'Clear name', text: '“Automail” says exactly what the product does.' },
            { title: 'Sidebar navigation', text: 'Users move between pages without losing their place.' }
          ]
        }
      ]
    },
    {
      id: 'design-process', label: 'Design Process', title: 'Design Process',
      blocks: [
        { type: 'headline', text: 'Fewer Steps, More Structure' },
        {
          type: 'cards',
          items: [
            { title: 'Landing Page', text: 'Lists sent and drafted emails, with pop-up email creation.' },
            { title: 'Contact Groups', text: 'Organizes synced Airtable data into selectable recipient groups.' },
            { title: 'Airtable Sync', text: 'One-click sync replaces manual export and re-upload.' },
            { title: 'Template Editors', text: 'An HTML editor for power users, and a simple builder for everyone else.' }
          ]
        }
      ]
    },
    {
      id: 'final-product', label: 'Final Product', title: 'Final Product',
      blocks: [
        { type: 'headline', text: 'One Tool for Every Kind of Sender' },
        { type: 'figures', items: [{ src: 'media/contact-page.gif', width: 800, height: 516, alt: 'Automail landing page', caption: 'Landing page' }] },
        { type: 'figures', items: [{ src: 'media/automail-landing-pop-up.gif', width: 800, height: 520, alt: 'Automail popup creation flow', caption: 'Pop-up email creation' }] },
        { type: 'figures', items: [{ src: 'media/contact-group.gif', width: 800, height: 530, alt: 'Automail Contact Groups page', caption: 'Contact Groups' }] },
        { type: 'figures', items: [{ src: 'media/airtable-sync.gif', width: 800, height: 531, alt: 'Automail one-click Airtable sync', caption: 'Airtable Sync' }] },
        { type: 'figures', items: [{ src: 'media/automail-html-template.gif', width: 1314, height: 686, alt: 'Automail HTML template editor with variable insertion and live preview', caption: 'HTML template editor' }] },
        { type: 'figures', items: [{ src: 'media/regular-template.gif', width: 800, height: 521, alt: 'Automail regular email template builder', caption: 'Simple template builder' }] }
      ]
    },
    {
      id: 'impact', label: 'Impact', title: 'Impact',
      blocks: [
        { type: 'headline', text: 'From 8 Hours to Under 5 Minutes' },
        {
          type: 'results',
          items: [
            { value: '<5 min', label: '8 hours → under 5 minutes' },
            { value: '100+', label: 'Personalized emails sent live' },
            { value: '~100', label: 'Demoed to CodeLab members' }
          ]
        },
        { type: 'text', text: 'No more all-nighters for the President.' },
        { type: 'figures', items: [{ src: 'media/codelab-team.JPG', width: 6960, height: 4640, alt: 'The CodeLab Automail team' }] },
        { type: 'link', text: 'Read the Medium article', href: 'https://codelabdavis.medium.com/automated-email-tool-6523a2850cf8' },
        { type: 'link', text: 'Read the design process on Medium', href: 'https://codelabdavis.medium.com/automail-2a3cd3d8b868' }
      ]
    },
    {
      id: 'reflection', label: 'Reflection', title: 'Reflection',
      blocks: [
        {
          type: 'takeaways',
          items: [
            { title: 'Designing for B2B', text: 'This was my first internal tool, so I had to figure out what good design means when the tool is part of someone’s job. I learned to start from the existing workflow instead of a blank canvas, to measure success in time saved rather than engagement, and to prioritize clarity over visual identity. The orange design looked good but didn’t serve the people using it.' },
            { title: 'First Time Working Directly with Engineers', text: 'This was my first time working with engineers and seeing how designs translate into development. I learned to design within technical constraints and to adapt when they changed, like prioritizing a working prototype over late-stage usability testing when developer bandwidth got tight.' }
          ]
        }
      ]
    }
  ]
};
