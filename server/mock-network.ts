const PROFILES = {
  query: { delayMs: 800, failureRate: 0.1 },
  mutation: { delayMs: 600, failureRate: 0.2 },
} as const;

export async function simulateNetwork(kind: keyof typeof PROFILES): Promise<boolean> {
  const { delayMs, failureRate } = PROFILES[kind];
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return Math.random() < failureRate;
}
