// Roles, newest first. `summary` is the one-paragraph version on the home page;
// `bullets` and `chips` are the full version on /experience/.

export interface Role {
  when: string;
  where: string;
  title: string;
  org: string;
  current: boolean;
  summary: string;
  chips: readonly string[];
  bullets: readonly string[];
}

export const ROLES: readonly Role[] = [
  {
    when: 'SEP 2025 — PRESENT',
    where: 'COIMBATORE · ON-SITE',
    title: 'Software Engineer',
    org: 'TraineryHCM',
    current: true,
    summary:
      'Multi-tenant customer portal with role-based access for 1,000+ users. Migrated every tenant to a new hierarchical account model with zero downtime.',
    chips: ['1,000+ production users', 'zero-downtime migration', 'RBAC · multi-tenant'],
    bullets: [
      'Designed and built a multi-tenant customer portal with separate authentication flows, hierarchical user management and role-based access control across broker, consolidator and self-managed accounts.',
      'Architected the account model linking brokers to consolidators, with child accounts of up to 100 employees, and migrated every tenant to it with zero downtime and no data loss.',
      'Built a coaching module that replaced spreadsheet tracking with an integrated scheduling workflow.',
      'Engineered a scheduling engine that cross-references trainer and learner availability to auto-assign conflict-free sessions.',
    ],
  },
  {
    when: 'OCT 2024 — SEP 2025',
    where: 'REMOTE',
    title: 'Software Developer',
    org: 'Freelance',
    current: false,
    summary: '15+ client projects across AI/ML and full-stack web, shipped end to end.',
    chips: ['15+ client projects', 'AI/ML · full-stack'],
    bullets: [
      'Delivered 15+ client projects across AI/ML and full-stack web, shipping production-ready applications end to end.',
      'Built UlearnX, a course marketplace with publisher and learner modes, a revenue dashboard and per-chapter progress tracking.',
      'Integrated Stripe checkout with webhook-driven enrollment and Mux video streaming on a Next.js, Prisma/MySQL and Clerk stack.',
    ],
  },
  {
    when: 'JUN — JUL 2024',
    where: 'COIMBATORE · ON-SITE',
    title: 'AI and Web Developer Intern',
    org: 'Amypo Technologies',
    current: false,
    summary: 'Real-time computer vision for exam proctoring: face orientation and eye-movement tracking.',
    chips: ['computer vision', 'real-time'],
    bullets: [
      'Built a computer-vision model that tracks facial orientation and eye coordination in real time to detect suspicious behaviour during online exams.',
      'Implemented face and eye-movement detection to flag anomalies such as looking away from the screen, enabling automated proctoring.',
    ],
  },
];

export const EDUCATION: readonly (readonly [string, string])[] = [
  ['DEGREE', 'B.E. Computer Science Design'],
  ['COLLEGE', 'Sri Krishna College of Engineering and Technology'],
  ['YEARS', '2022 — 2026'],
];
