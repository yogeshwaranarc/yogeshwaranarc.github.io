// The four builds, newest first. `card` is the shorter version shown under
// "More work" on the home page; only projects that appear there carry one.

export interface Project {
  host: string;
  status: string;
  title: string;
  summary: string;
  specs: readonly (readonly [label: string, value: string])[];
  bullets: readonly string[];
  tags: readonly string[];
  links: readonly { label: string; url: string }[];
  card?: {
    title: string;
    text: string;
    specs: readonly (readonly [label: string, value: string])[];
    tags: readonly string[];
    link?: { label: string; url: string };
  };
}

export const PROJECTS: readonly Project[] = [
  {
    host: 'payment-system',
    status: 'IN PROGRESS',
    title: 'Payments backend',
    summary:
      'Six microservices (gateway, auth, wallet, transfer, notification, webhook) around a double-entry ledger where the database itself rejects any transaction that does not balance.',
    specs: [
      ['SERVICES', '6'],
      ['TESTS', '271 · race detector'],
      ['LOAD TEST', '2,774 transfers · 0 failed'],
      ['TRACE', '59 spans · 5 services'],
    ],
    bullets: [
      'Row locks in a fixed order plus idempotency keys: 20 parallel requests with one key produce exactly 1 transfer.',
      'Cross-service transfers are sagas (hold, capture, release). A service killed mid-transfer resumes on restart and charges the sender exactly once.',
      'Transactional outbox and NATS JetStream: no event lost when the broker is down, duplicates dropped, failures replayed from a dead-letter queue.',
      'mTLS between services, least-privilege database roles, an append-only audit log, signed webhooks and risk checks with manual review.',
    ],
    tags: ['Go', 'Fiber', 'PostgreSQL', 'gRPC', 'NATS JetStream', 'Redis', 'Docker'],
    links: [{ label: 'GitHub ↗', url: 'https://github.com/Yogeshwaran-Projects/payment-system' }],
  },
  {
    host: 'bunkrfile.xyz',
    status: 'LIVE',
    title: 'Bunkr, a distributed file system',
    summary:
      'A fault-tolerant file system that survives any 2 of 5 node failures with zero data loss, with Raft implemented from scratch.',
    specs: [
      ['FAULT TOLERANCE', '2 of 5 nodes'],
      ['CHUNK SIZE', '4 MB streaming'],
      ['ENCRYPTION', 'AES-256-GCM'],
      ['ADDRESSING', 'SHA-256'],
    ],
    bullets: [
      'Raft from scratch: leader election, log replication and snapshots.',
      'Zero-knowledge pipeline: chunks are encrypted before they leave the client, so the server never sees the key.',
      'Full stack: Go backend, a real-time Next.js cluster dashboard and a TypeScript CLI published to npm.',
    ],
    tags: ['Go', 'Raft', 'gRPC', 'Next.js', 'TypeScript'],
    links: [{ label: 'bunkrfile.xyz ↗', url: 'https://bunkrfile.xyz' }],
  },
  {
    host: 'trustify.fit',
    status: 'LIVE',
    title: 'Trustify, escrow on Solana',
    summary:
      'A trustless freelance escrow. An Anchor smart contract holds funds in Program Derived Addresses until the work is verified.',
    specs: [
      ['STATE MACHINE', '6 states · 6 instructions'],
      ['COST / LIFECYCLE', '$0.001'],
      ['VS ETHEREUM', '~20,000x cheaper'],
      ['DELIVERABLES', 'IPFS / Pinata'],
    ],
    bullets: [
      'On-chain authorization, status guards and replay protection.',
      'Tamper-proof deliverables on IPFS and automated GitHub verification of submitted work.',
      'Next.js frontend with wallet-adapter and live SOL price conversion.',
    ],
    tags: ['Rust', 'Anchor', 'Solana', 'IPFS', 'Next.js'],
    links: [{ label: 'trustify.fit ↗', url: 'https://trustify.fit' }],
    card: {
      title: 'Trustify',
      text: 'Trustless freelance escrow on Solana. Funds sit in Program Derived Addresses until the work is verified.',
      specs: [
        ['state machine', '6 states · 6 instructions'],
        ['cost per lifecycle', '$0.001'],
        ['deliverables', 'IPFS + GitHub check'],
      ],
      tags: ['Rust', 'Anchor', 'Solana', 'IPFS'],
      link: { label: 'trustify.fit ↗', url: 'https://trustify.fit' },
    },
  },
  {
    host: 'ulearnx',
    status: 'CLIENT WORK',
    title: 'UlearnX, a course marketplace',
    summary: 'A learning platform with publisher and learner modes, built end to end for a freelance client.',
    specs: [
      ['ENROLLMENT', 'Stripe webhooks'],
      ['VIDEO', 'Mux streaming'],
      ['AUTH', 'Clerk'],
      ['DATA', 'Prisma · MySQL'],
    ],
    bullets: [
      'Instructors author chaptered video courses with drag-and-drop ordering and a revenue analytics dashboard.',
      'Learners browse, purchase and track progress per chapter.',
    ],
    tags: ['Next.js', 'Prisma', 'MySQL', 'Stripe', 'Mux', 'Clerk'],
    links: [],
    card: {
      title: 'UlearnX',
      text: 'Course marketplace with publisher and learner modes: chaptered video courses, checkout and progress tracking.',
      specs: [
        ['enrollment', 'Stripe webhooks'],
        ['video', 'Mux streaming'],
        ['auth', 'Clerk'],
      ],
      tags: ['Next.js', 'Prisma', 'MySQL', 'Stripe'],
    },
  },
];
