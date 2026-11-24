// Browser side of the storage-server navigation: boot sequence, hover/focus, eject.
// All looks come from the pure driveView()/lcdLines() in src/lib/rack.ts; this file
// only owns the state and writes the result into the elements ServerNav.astro rendered.
import { DRIVES, BOOT_DONE, BOOT_STEP_MS, EJECT_MS, RESEAT_MS, driveView, lcdLines, type RackState } from '../lib/rack';

const rack = document.querySelector<HTMLElement>('[data-rack]');
if (rack) start(rack);

function start(rack: HTMLElement) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Reduced motion: skip the boot sequence, the rack is ready at once.
  const state: RackState = { hover: null, eject: null, boot: reduced ? BOOT_DONE : 0 };

  const q = (root: Element, sel: string) => root.querySelector<HTMLElement>(sel)!;
  const parts = DRIVES.map((d) => {
    const cell = q(rack, `[data-drive="${d.id}"]`);
    return { d, cell, tip: q(cell, '[data-tip]'), face: q(cell, '[data-face]'), led1: q(cell, '[data-led1]'), led2: q(cell, '[data-led2]'), arrow: q(cell, '[data-arrow]'), lever: q(cell, '[data-lever]') };
  });
  const lcd1 = q(rack, '[data-lcd1]');
  const lcd2 = q(rack, '[data-lcd2]');

  function paint() {
    parts.forEach((p, i) => {
      const v = driveView(i, p.d.id, state);
      p.cell.style.zIndex = String(v.z);
      p.tip.style.opacity = String(v.tipOp);
      p.tip.style.transform = v.tipTf;
      p.face.style.boxShadow = v.sh;
      p.face.style.transform = v.tf;
      p.face.style.opacity = String(v.op);
      p.led1.style.background = v.led1;
      p.led1.style.boxShadow = `0 0 0 1px #0a0c0b, ${v.glow}`;
      p.led2.style.background = v.led2;
      p.arrow.style.color = v.arrow;
      p.lever.style.transform = v.latch;
    });
    const [a, b] = lcdLines(state);
    // Write only on change: the LCD is aria-live, and a rewrite re-announces it.
    if (lcd1.textContent !== a) lcd1.textContent = a;
    if (lcd2.textContent !== b) lcd2.textContent = b;
  }

  for (const p of parts) {
    const enter = () => { state.hover = p.d.id; paint(); };
    const leave = () => { if (state.hover === p.d.id) { state.hover = null; paint(); } };
    p.face.addEventListener('mouseenter', enter);
    p.face.addEventListener('mouseleave', leave);
    p.face.addEventListener('focus', enter);
    p.face.addEventListener('blur', leave);
    p.face.addEventListener('click', (e) => {
      // Modified clicks (new tab / new window) keep the browser default: the drive stays seated.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      state.eject = p.d.id;
      paint();
      if (p.d.target) {
        // Resume: the PDF opens in a new tab by itself; re-seat the drive on this page.
        setTimeout(() => { state.eject = null; state.hover = null; paint(); }, RESEAT_MS);
        return;
      }
      e.preventDefault();
      setTimeout(() => { window.location.href = p.d.href; }, reduced ? 0 : EJECT_MS);
    });
  }

  // Back/forward cache restores the page exactly as it was left: with a drive ejected
  // and invisible. Re-seat everything whenever the page is shown again.
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    state.eject = null;
    state.hover = null;
    paint();
  });

  if (state.boot < BOOT_DONE) {
    const timer = setInterval(() => {
      state.boot += 1;
      paint();
      if (state.boot >= BOOT_DONE) clearInterval(timer);
    }, BOOT_STEP_MS);
  }
  paint();
}
