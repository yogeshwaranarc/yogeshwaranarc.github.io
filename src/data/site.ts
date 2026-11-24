// Identity, contact channels and the section list. Every page reads these, so a
// handle or URL changes in ONE place.

export const SITE = {
  name: 'Yogeshwaran',
  handle: 'yogeshwaran',
  role: 'Backend software engineer',
  location: 'Coimbatore, IN',
  email: 'Yogeshwaran.arc@gmail.com',
  resume: '/Yogeshwaran_Resume.pdf',
  description: 'Backend software engineer. Multi-tenant platforms, distributed storage, payments.',
} as const;

// Known limitation: the X profile URL is not decided yet. The design ships the bare
// domain and the label "profile link to add"; replace BOTH fields together.
export const SOCIALS = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/Yogeshwaran-Projects', handle: 'Yogeshwaran-Projects' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/yogeshwaran07', handle: 'in/yogeshwaran07' },
  { id: 'x', label: 'X', url: 'https://x.com/', handle: 'profile link to add' },
] as const;

export const SECTIONS = [
  { id: 'projects', name: 'Projects', href: '/projects/' },
  { id: 'experience', name: 'Experience', href: '/experience/' },
  { id: 'blog', name: 'Blog', href: '/blog/' },
  { id: 'about', name: 'About', href: '/about/' },
  { id: 'contact', name: 'Contact', href: '/contact/' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
