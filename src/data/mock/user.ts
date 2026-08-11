export interface DemoUser {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export const DEFAULT_DEMO_SESSION: DemoUser = {
  id: "demo-user-1",
  name: "Prasanna",
  phone: "9876543210",
  email: "prasanna@example.com",
};
