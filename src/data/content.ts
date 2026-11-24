// Small static lists: blog queue, about-page facts, the home numbers row and the toolbox.

// Known limitation: nothing is published yet. These titles are placeholders for the
// first three posts; the Blog page says so in its intro line.
export const POSTS: readonly { title: string; source: string }[] = [
  { title: 'Raft from scratch in Go: what the paper leaves out', source: 'FROM BUNKR' },
  { title: 'Migrating every tenant with zero downtime', source: 'FROM TRAINERYHCM' },
  { title: 'A six-state escrow machine on Solana', source: 'FROM TRUSTIFY' },
];

export const FACTS: readonly (readonly [string, string])[] = [
  ['ROLE', 'Software Engineer'],
  ['COMPANY', 'TraineryHCM'],
  ['BASED IN', 'Coimbatore, IN'],
  ['FOCUS', 'Backend · distributed systems'],
  ['STATUS', 'Employed · not looking'],
];

export const SKILLS: readonly (readonly [string, string])[] = [
  ['LANGUAGES', 'Go, Rust, Python, SQL, TypeScript'],
  ['DATA & INFRASTRUCTURE', 'PostgreSQL, AWS, IPFS'],
  ['CONCEPTS', 'Distributed systems, Raft consensus, Solana / Web3, Stripe'],
];

export const NUMBERS: readonly (readonly [string, string])[] = [
  ['1,000+', 'production users on the portal I built'],
  ['15+', 'client projects shipped as a freelancer'],
  ['2 of 5', 'node failures Bunkr survives, zero data lost'],
  ['2,774', 'transfers under load test, 0 failures'],
];

// Patch panel: every row has PORTS_PER_ROW ports. A row with fewer tools gets unlit
// ports labelled "spare" (the header line counts them: 20 ports, 2 spare).
export const PORTS_PER_ROW = 5;
export const TOOLBOX: readonly (readonly [string, readonly string[]])[] = [
  ['LANGUAGES', ['Go', 'Rust', 'Python', 'SQL', 'TypeScript']],
  ['DATA', ['PostgreSQL', 'Redis', 'NATS', 'MySQL']],
  ['INFRA', ['Docker', 'Kubernetes', 'AWS', 'gRPC', 'IPFS']],
  ['CONCEPTS', ['Dist. systems', 'Raft', 'Ledgers', 'Sagas', 'Idempotency']],
];

// Small ports on the server's bottom rail.
export const RAIL_STACK = ['Go', 'Rust', 'Python', 'TypeScript', 'SQL', 'PostgreSQL', 'Redis', 'NATS', 'gRPC', 'Docker', 'AWS'] as const;
