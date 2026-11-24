// Browser side of the two home-page simulations: ONE shared timer, one tick counter.
// Every look comes from the pure payments()/bunkr() in src/lib/sim.ts; this file only
// writes the result into the elements PaymentsSim.astro and BunkrSim.astro rendered.
import { TICK_MS, payments, bunkr } from '../lib/sim';

const pay = document.querySelector<HTMLElement>('[data-sim="payments"]');
const bnk = document.querySelector<HTMLElement>('[data-sim="bunkr"]');

const all = (root: Element, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
const one = (root: Element, sel: string) => root.querySelector<HTMLElement>(sel)!;
const text = (el: HTMLElement, s: string) => { if (el.textContent !== s) el.textContent = s; };

function paintPayments(root: HTMLElement, t: number) {
  const v = payments(t);
  for (const n of v.nodes) {
    const el = one(root, `[data-pay-node="${n.id}"]`);
    el.style.color = n.col;
    el.style.borderColor = n.bd;
    const led = one(el, '[data-led]');
    led.style.background = n.led;
    led.style.boxShadow = n.glow;
    text(one(el, '[data-name]'), n.n);
  }
  [v.pkt, v.pkt2].forEach((p, i) => {
    const el = one(root, `[data-pkt="${i + 1}"]`);
    el.style.left = p.x;
    el.style.top = p.y;
    el.style.opacity = String(p.op);
  });
  all(root, '[data-ledger-row]').forEach((el, i) => { el.style.opacity = String(v.ledger[i]!.op); });
  text(one(root, '[data-ledger-check]'), v.ledgerCheck);
  text(one(root, '[data-log]'), v.log);
}

function paintBunkr(root: HTMLElement, t: number) {
  const v = bunkr(t);
  one(root, '[data-chunks]').style.gap = v.chunkGap;
  all(root, '[data-chunk]').forEach((el, i) => {
    const c = v.chunks[i]!;
    el.style.background = c.bg;
    el.style.color = c.col;
    text(el, c.label);
  });
  all(root, '[data-node]').forEach((el, i) => {
    const n = v.nodes[i]!;
    el.style.borderColor = n.bd;
    el.style.opacity = String(n.op);
    one(el, '[data-led]').style.background = n.led;
    text(one(el, '[data-term]'), n.term);
    const role = one(el, '[data-role]');
    role.style.color = n.roleCol;
    text(role, n.role);
    all(el, '[data-cell]').forEach((cell, k) => { cell.style.background = n.cells[k]!; });
  });
  text(one(root, '[data-log]'), v.log);
}

// Reduced motion: both panels stay frozen on the server-rendered first frame.
if (pay && bnk && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let t = 0;
  setInterval(() => {
    t += 1;
    paintPayments(pay, t);
    paintBunkr(bnk, t);
  }, TICK_MS);
}
