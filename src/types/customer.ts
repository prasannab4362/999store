export interface CustomerSession {
  customerId: string;
  name: string;
  phone: string;
  email?: string;
  isDemo: boolean;
}
