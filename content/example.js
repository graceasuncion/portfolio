/* =====================================================================
   EXAMPLE CASE STUDY — duplicate this file for each project.

   1. Copy to content/<your-slug>.js   (lowercase letters, numbers, dashes)
   2. Fill in the fields below
   3. Open case-study.html?p=<your-slug>

   Text tips
   - Wrap a phrase in ==double equals== to give it the accent highlighter.
   - Every image/video needs `alt` (describe what it shows). For purely
     decorative media use `decorative: true` instead.
   - Leave `src` empty ('') to show a labelled placeholder box.
   - Delete any block or section you don't need. Sections are numbered
     automatically, and the side menu is built from them.
===================================================================== */
window.CASE_STUDY = {
  /* ---------- Project settings ---------- */
  projectName: '[Project name]',
  impactTitle: '[Impact title: the change you made, e.g. “Turning hesitation into confidence”]',
  summary: '[One sentence: what you designed, for whom, and the change it made.]',
  status: '[STATUS]',                       // e.g. 'SHIPPED', 'IN PROGRESS', 'CONCEPT'
  tags: ['[DISCIPLINE]', '[INDUSTRY]', '[PLATFORM]'],
  meta: {
    role: '[YOUR ROLE]',
    team: '[WHO YOU WORKED WITH]',
    timeline: '[DURATION · YEAR]',
    tools: '[TOOLS]',                       // a string or an array: ['Figma', 'Maze']
    company: '[COMPANY]'
  },
  accent: '#2F5F7C',                        // mockup swatches: #2F5F7C  #6B52AE  #B5603F  #3F7A50
  planet: 'ring',                           // 'ring' | 'moon' | 'bands' | 'spots'
  showGuides: true,                         // dashed authoring hints. Set false before publishing!

  /* Cover: leave src empty to show the ASCII planet art.
     Image:  { src: 'media/my-cover.png', alt: '…' }
     Video:  { src: 'media/my-cover.mp4', alt: '…', poster: 'media/poster.jpg' } */
  cover: {
    src: '',
    alt: '',
    label: '[KEY MOMENT]'                    // pill under the planet (planet cover only)
  },

  tldr: [
    { label: 'PROBLEM', text: '[What wasn’t working, in one line.]' },
    { label: 'WHAT I DID', text: '[Your key contribution, in one line.]' },
    { label: 'OUTCOME', text: '[The result: a metric, a launch, or what changed.]' }
  ],

  next: {
    name: '[Next project name]',
    href: 'case-study.html?p=example',     // link to the next case study
    company: '[COMPANY]',
    year: '[YEAR]'
    // planet: 'moon'                       // optional; defaults to the opposite of this project's
  },

  /* ---------- Story ----------
     Each section: { id, label (menu), title (big caps heading), guide?, blocks: [] }
     Any `text` can be a string or an array of strings (several paragraphs).
     Block types:
       headline        { text }
       text            { text }
       stats           { items: ['12 INTERVIEWS', …] }
       quote           { text, cite }
       keyInsight      { text, label? }            label defaults to 'KEY INSIGHT'
       cards           { items: [{ label, title?, text?, bullets?: [], full?: true }] }
       bullets         { items: ['…'], label? }
       decisionCards   { question?, explored: { title, text }, adopted: { title, text, tags: [] } }
                         (explored/adopted can also be arrays of cards)
       myRole          { text }
       shift           { from: { label, title }, to: { label, title }, caption }   "moved from → to"
       usabilityFinding{ title, old: [screen], new: [screen], notes: [{ kind:'old'|'new', n, text }] }
                         screen = { src, alt, width, height, markers?: [{ n, x:'20%', y:'30%' }] }
       figures         { items: [{ src, alt, width, height, caption, placeholder }], label? }
       features        { items: [{ name, text, bullets: [], media: { src, alt, width, height }, layout?: 'wide' }] }
                         layout 'wide' = desktop screenshot under the copy (default: phone beside it)
       results         { items: [{ value, label }] }
       nextSteps       { items: ['…'] }
       reflection      { worked, different, team }
       takeaways       { items: [{ title, text }] }   numbered lessons
       link            { text, href }                 outlined button (external links open in a new tab)
       note            { text }                       small caps footnote

     Images: add `width` and `height` (the file's pixel size) so the page
     doesn't jump while images load. The side menu depends on this.
  */
  sections: [
    {
      id: 'overview', label: 'Overview', title: 'Overview',
      guide: 'The setting: product, users, and what the business needed.',
      blocks: [
        { type: 'headline', text: '[A headline that states the challenge.]' },
        { type: 'text', text: '[Two or three sentences. Use a ==highlight== for the phrase you want skimmers to catch.]' }
      ]
    },
    {
      id: 'research', label: 'Research', title: 'Research',
      blocks: [
        { type: 'headline', text: '[What you set out to learn.]' },
        { type: 'stats', items: ['[N] INTERVIEWS', '[N] SURVEY RESPONSES', '[N] COMPETITORS REVIEWED'] },
        { type: 'quote', text: '[A real quote from research that captures the problem.]', cite: '[PARTICIPANT ROLE]' },
        { type: 'keyInsight', text: '[The one finding that shaped the whole design.]' }
      ]
    },
    {
      id: 'define', label: 'Define', title: 'Define',
      guide: 'Your framing + one decision: what you explored and cut vs. what you adopted.',
      blocks: [
        { type: 'headline', text: '[Confidence should be the user’s to define, not ours.]' },
        { type: 'text', text: '[The research made the direction clear: this wasn’t a ==[X] problem==, it was a ==[Y] problem==. Name the gap, and say how you set out to close it.]' },
        {
          type: 'decisionCards',
          explored: { title: '[Idea you cut]', text: '[What it was, and the risk that made you cut it.]' },
          adopted: {
            title: '[Idea you kept]',
            text: '[What it is and why it serves users better.]',
            tags: ['[PRINCIPLE] OVER [X]', '[PRINCIPLE] OVER [X]', '[PRINCIPLE] OVER [X]']
          }
        },
        { type: 'myRole', text: '[What you personally raised or decided, and how it guided the rest of the project.]' }
      ]
    },
    {
      id: 'testing', label: 'Usability Testing', title: 'Usability Testing',
      guide: 'One panel per finding. Number the problems on OLD screens and the fixes on NEW ones.',
      blocks: [
        { type: 'text', text: '[Who you tested with, how many sessions, and what you were looking for.]' },
        {
          type: 'usabilityFinding',
          title: '[Finding name, e.g. confirm-date friction]',
          old: [
            { src: '', alt: '[Describe the old screen]', markers: [{ n: 1, x: '20%', y: '28%' }] },
            { src: '', alt: '[Describe the old screen]', markers: [{ n: 2, x: '24%', y: '34%' }] }
          ],
          new: [
            { src: '', alt: '[Describe the new screen]', markers: [{ n: 1, x: '26%', y: '20%' }, { n: 2, x: '50%', y: '30%' }] }
          ],
          notes: [
            { kind: 'old', n: 1, text: '[What the problem was on the old screen.]' },
            { kind: 'old', n: 2, text: '[A second problem users ran into.]' },
            { kind: 'new', n: 1, text: '[How the new design fixes problem 1.]' },
            { kind: 'new', n: 2, text: '[How the new design fixes problem 2.]' }
          ]
        },
        { type: 'note', text: 'Repeat the usabilityFinding block for finding 02, 03 …' }
      ]
    },
    {
      id: 'ideate', label: 'Ideate', title: 'Ideate',
      blocks: [
        { type: 'headline', text: '[How ideas became a direction.]' },
        {
          type: 'figures',
          items: [
            { src: '', alt: '[Describe the sketches]', placeholder: 'SKETCHES', caption: '[CAPTION]' },
            { src: '', alt: '[Describe the flow]', placeholder: 'USER FLOW / WIREFRAMES', caption: '[CAPTION]' }
          ]
        }
      ]
    },
    {
      id: 'solution', label: 'Solution', title: 'Solution',
      guide: 'One panel per key feature: what it is, the problem it fixes, 3–5 bullets, one screen.',
      blocks: [
        {
          type: 'features',
          items: [
            {
              name: '[Feature name]',
              text: '[What it is, and the user problem it directly fixes.]',
              bullets: ['[Key interaction or capability]', '[How it reduces effort or confusion]', '[A detail that shows craft]', '[What users said about it]'],
              media: { src: '', alt: '[Describe the screen or GIF]' }
            },
            {
              name: '[Feature name]',
              text: '[What it is, and the user problem it directly fixes.]',
              bullets: ['[Key interaction or capability]', '[How it reduces effort or confusion]', '[A detail that shows craft]', '[What users said about it]'],
              media: { src: '', alt: '[Describe the screen or GIF]' }
            }
          ]
        }
      ]
    },
    {
      id: 'outcome', label: 'Outcome', title: 'Outcome',
      blocks: [
        {
          type: 'results',
          items: [
            { value: '[Result]', label: '[WHAT IT MEASURES]' },
            { value: '[Result]', label: '[WHAT IT MEASURES]' },
            { value: '[Result]', label: '[WHAT IT MEASURES]' }
          ]
        },
        { type: 'text', text: '[No numbers yet? Share testing results, a launch, or a stakeholder quote.]' }
      ]
    },
    {
      id: 'next-steps', label: 'Next Steps', title: 'Next Steps',
      blocks: [
        {
          type: 'nextSteps',
          items: ['[What you’d build or test next, and why.]', '[What you’d build or test next, and why.]', '[What you’d build or test next, and why.]']
        }
      ]
    },
    {
      id: 'reflection', label: 'Reflection', title: 'Reflection',
      blocks: [
        {
          type: 'reflection',
          worked: '[What you’d repeat on the next project.]',
          different: '[What you learned the hard way.]',
          team: '[NAMES AND ROLES — CREDIT YOUR COLLABORATORS]'
        }
      ]
    }
  ]
};
