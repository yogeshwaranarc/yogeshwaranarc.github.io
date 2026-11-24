// The two home-page simulations as PURE functions of one integer tick.
//
// Both loops have PHASES steps and share one timer (src/scripts/sims.ts). The Bunkr
// loop runs BUNKR_OFFSET phases ahead so the two panels never change at the same moment
// in their stories. The server renders tick 0; the browser renders every later tick
// with the same functions. No DOM access here.
//
// NOTE: the amounts, the idempotency key 7f3a and "report.pdf · 16 MB" are illustrative.

export const PHASES = 12;
export const TICK_MS = 950;
export const BUNKR_OFFSET = 6;

// ─────────── payments: one transfer travelling through the services ───────────

/** Node positions in percent of the diagram box: [left, top]. */
export const PAY_POS = {
  client: [12, 25],
  gateway: [37, 25],
  transfer: [62, 25],
  wallet: [87, 25],
  postgres: [87, 75],
  nats: [62, 75],
  notify: [37, 75],
  webhook: [12, 75],
} as const;
export type PayNodeId = keyof typeof PAY_POS;

/** Where the packet sits in each phase. */
const PAY_AT: readonly PayNodeId[] = ['client', 'gateway', 'transfer', 'wallet', 'transfer', 'transfer', 'wallet', 'postgres', 'nats', 'notify', 'notify', 'notify'];

const SAGA_LOGS = [
  'POST /transfers · Idempotency-Key 7f3a',
  'gateway · mTLS · token verified',
  'transfer · key 7f3a claimed · saga started',
  'wallet · HOLD 500 · rows locked in fixed order',
  'transfer-svc killed mid-saga',
  'transfer-svc restarted · saga resumed from its log · no second hold',
  'wallet · CAPTURE 500 → receiver · hold cleared',
  'postgres · constraint check · debits = credits',
  'outbox → NATS JetStream · transfer.completed',
  'notify + webhook consumed · webhook signed',
  'done · sender charged exactly once',
  'done · sender charged exactly once',
] as const;

const pct = (k: PayNodeId) => ({ x: PAY_POS[k][0] + '%', y: PAY_POS[k][1] + '%' });

export function payments(t: number) {
  const p = t % PHASES;
  const at = PAY_AT[p]!;
  const nodes = (Object.keys(PAY_POS) as PayNodeId[]).map((k) => {
    // Phase 4: the transfer service is killed mid-saga and shows as down.
    const down = k === 'transfer' && p === 4;
    const active = !down && p < 11 && (k === at || (k === 'webhook' && p >= 9));
    return {
      id: k,
      n: down ? k + ' ✕' : k,
      ...pct(k),
      col: down ? 'var(--dim)' : active ? 'var(--fg)' : 'var(--mut)',
      bd: active ? 'var(--dim)' : 'var(--line)',
      led: down ? 'transparent' : active ? 'var(--ac)' : 'var(--cell)',
      glow: down ? 'inset 0 0 0 1px var(--dim)' : active ? '0 0 6px var(--ac)' : '0 0 0 transparent',
    };
  });
  return {
    nodes,
    pkt: { ...pct(at), op: p === 4 || p === 11 ? 0 : 1 },
    // Second packet: the outbox event fanning out from NATS to the webhook service.
    pkt2: { ...pct(p >= 9 ? 'webhook' : 'nats'), op: p >= 9 && p < 11 ? 1 : 0 },
    ledger: [
      { tag: 'HOLD', dr: 'sender.available', cr: 'sender.held', op: p >= 3 ? 1 : 0.18 },
      { tag: 'CAPTURE', dr: 'sender.held', cr: 'receiver.available', op: p >= 6 ? 1 : 0.18 },
    ],
    ledgerCheck: p >= 6 ? 'Σ DR 1,000.00 = Σ CR 1,000.00 ✓' : p >= 3 ? 'Σ DR 500.00 = Σ CR 500.00 ✓' : 'Σ DR 0.00 = Σ CR 0.00',
    log: SAGA_LOGS[p]!,
  };
}
export type PaymentsView = ReturnType<typeof payments>;

// ─────────── bunkr: chunk, encrypt, replicate, then a leader failure and election ───────────

const BUNKR_LOGS = [
  'file ready on client',
  'split into 4 chunks of 4 MB',
  'chunks encrypted · AES-256-GCM · key never leaves the client',
  'leader node-1 appends to its log · term 3',
  'AppendEntries → followers',
  'majority acked · committed · 5 of 5 hold every chunk',
  'node-1 (leader) and node-4 down',
  'election timeout · node-3 requests votes · term 4',
  'node-3 elected · 3 of 5 votes',
  'file still readable from 3 nodes · 0 bytes lost',
  'node-1 and node-4 rejoin as followers · caught up from snapshot',
  'cluster healthy · term 4',
] as const;

export const BUNKR_NODES = 5;
export const BUNKR_CHUNKS = 4;

export function bunkr(t: number) {
  const b = (t + BUNKR_OFFSET) % PHASES;
  const role = (i: number) => {
    if (b < 6) return i === 0 ? 'LEADER' : 'FOLLOWER';
    if (b < 10 && (i === 0 || i === 3)) return 'DOWN';
    if (b === 6) return 'FOLLOWER';
    if (b === 7) return i === 2 ? 'CANDIDATE' : 'VOTED n3';
    return i === 2 ? 'LEADER' : 'FOLLOWER';
  };
  // Chunks stored per node: the leader appends first, followers catch up one phase later.
  const fill = (i: number) => (b < 3 ? 0 : b === 3 ? (i === 0 ? 2 : 0) : b === 4 ? (i === 0 ? 4 : 2) : 4);
  const sent = b < 3 ? 0 : b === 3 ? 2 : 4;
  const range = (n: number) => Array.from({ length: n }, (_, k) => k);
  return {
    chunkGap: b >= 1 ? '6px' : '0px',
    chunks: range(BUNKR_CHUNKS).map((k) => ({
      bg: k < sent ? 'color-mix(in srgb, var(--ac) 22%, var(--panel))' : b >= 2 ? 'var(--ac)' : 'var(--dim)',
      col: k < sent ? 'var(--mut)' : b >= 2 ? '#0A0C0B' : 'var(--bg)',
      label: b >= 2 ? 'enc ' + (k + 1) : b >= 1 ? '4 MB' : '',
    })),
    nodes: range(BUNKR_NODES).map((i) => {
      const r = role(i);
      return {
        name: 'node-' + (i + 1),
        role: r,
        term: b >= 7 && r !== 'DOWN' ? 't4' : 't3',
        op: r === 'DOWN' ? 0.35 : 1,
        led: r === 'DOWN' ? 'var(--cell)' : 'var(--ac)',
        bd: r === 'LEADER' || r === 'CANDIDATE' ? 'var(--dim)' : 'var(--line)',
        roleCol: r === 'LEADER' ? 'var(--act)' : r === 'CANDIDATE' ? 'var(--fg)' : 'var(--dim)',
        cells: range(BUNKR_CHUNKS).map((k) => (k < fill(i) ? 'var(--ac)' : 'var(--cell)')),
      };
    }),
    log: BUNKR_LOGS[b]!,
  };
}
export type BunkrView = ReturnType<typeof bunkr>;
