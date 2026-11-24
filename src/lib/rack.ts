// Storage-server navigation: the drive list and a PURE view function.
//
// The same function renders the first paint on the server (boot = 0) and every later
// state in the browser (src/scripts/rack.ts), so the two can not drift apart.
// It has no DOM access, which keeps it testable without a browser.
//
//   boot < i+1            → drive i's LED is still dark (boot sequence)
//   hover === id          → drive pulled out, LEDs white/accent, lever open, preview shown
//   eject === id          → drive leaves the bay (scale up, fade out); hover look is off

export interface Drive {
  id: string;
  name: string;
  read: string;
  href: string;
  /** Set ONLY for the resume: the PDF opens in a new tab and the page stays. */
  target?: '_blank';
  /** Hover-preview screenshot. The resume has none (text-only preview). */
  preview?: string;
  /** One-line summary for the preview card and the LCD. */
  prev: string;
}

export const DRIVES: readonly Drive[] = [
  { id: 'projects', name: 'Projects', read: '04 builds', href: '/projects/', preview: '/previews/01-page.jpg', prev: 'Payments · Bunkr · Trustify · UlearnX' },
  { id: 'experience', name: 'Experience', read: '03 roles', href: '/experience/', preview: '/previews/02-page.jpg', prev: 'TraineryHCM · Freelance · Amypo' },
  { id: 'blog', name: 'Blog', read: '03 drafts', href: '/blog/', preview: '/previews/03-page.jpg', prev: '3 drafts · nothing published yet' },
  { id: 'about', name: 'About', read: '01 human', href: '/about/', preview: '/previews/04-page.jpg', prev: 'Backend engineer · Coimbatore · B.E. 2026' },
  { id: 'resume', name: 'Resume', read: 'PDF', href: '/Yogeshwaran_Resume.pdf', target: '_blank', prev: 'One page · PDF · opens in a new tab' },
  { id: 'contact', name: 'Contact', read: 'LinkedIn', href: '/contact/', preview: '/previews/05-page.jpg', prev: 'Email · LinkedIn · GitHub' },
];

/** Two open bays sit before the drives: 6 drives in an 8-bay chassis. */
export const EMPTY_BAYS = 2;

/** Boot counts 0..BOOT_DONE; drive i lights when boot > i, the LCD goes idle at BOOT_DONE. */
export const BOOT_DONE = 7;
export const BOOT_STEP_MS = 170;
/** Time the eject animation gets before the browser navigates. */
export const EJECT_MS = 340;
/** The resume drive re-seats after this long (its PDF opened in another tab). */
export const RESEAT_MS = 900;

export interface RackState {
  hover: string | null;
  eject: string | null;
  boot: number;
}

export interface DriveView {
  z: number;
  tipOp: number;
  tipTf: string;
  tf: string;
  op: number;
  sh: string;
  led1: string;
  glow: string;
  led2: string;
  arrow: string;
  latch: string;
}

export function driveView(index: number, id: string, s: RackState): DriveView {
  const lit = index < s.boot;
  const out = s.eject === id;
  const hot = !out && s.hover === id;
  return {
    z: hot || out ? 5 : 1,
    tipOp: hot ? 1 : 0,
    tipTf: hot ? 'translateY(0)' : 'translateY(6px)',
    tf: out ? 'scale(1.2) translateY(12px)' : hot ? 'scale(1.045) translateY(-1px)' : 'none',
    op: out ? 0 : 1,
    sh:
      hot || out
        ? 'inset 0 1px 0 rgba(255,255,255,.25), inset 0 -1px 0 rgba(0,0,0,.5), 0 0 0 1px #000, 0 16px 26px -4px rgba(0,0,0,.9), 0 3px 0 #040505'
        : 'inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.5), 0 0 0 1px #000',
    led1: hot ? '#F4F6F4' : lit ? 'var(--ac)' : '#1b1e1d',
    glow: hot ? '0 0 6px rgba(255,255,255,.85)' : lit ? '0 0 4px color-mix(in srgb, var(--ac) 55%, transparent)' : '0 0 0 transparent',
    led2: hot ? 'var(--ac)' : '#1b1e1d',
    arrow: hot ? '#E8EAE8' : '#6c716e',
    latch: hot ? 'rotate(-7deg)' : 'none',
  };
}

/** The two LCD lines: boot progress, then the hovered section, then the idle readout. */
export function lcdLines(s: RackState): [string, string] {
  if (s.boot < BOOT_DONE) return ['BOOT', 'spinning up bay ' + Math.min(s.boot, DRIVES.length) + '/' + DRIVES.length];
  const hovered = DRIVES.find((d) => d.id === s.hover);
  if (hovered) return ['/' + hovered.id, hovered.prev];
  return ['READY · ' + DRIVES.length + ' OF ' + (DRIVES.length + EMPTY_BAYS) + ' BAYS', 'employed · not looking'];
}
