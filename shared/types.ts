export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
  hasSubscription?: boolean;
  subscriptionEndsAt?: string | null;
  stripeCustomerId?: string;
  isWaitlisted?: boolean;
  tokenVersion?: number;
}
