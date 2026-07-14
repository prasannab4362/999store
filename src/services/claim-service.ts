const LATENCY = 300;

const delay = <T>(value: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
};

export interface DamageClaim {
  id: string;
  orderId: string;
  productName: string;
  reason: string;
  description: string;
  videoFile: {
    name: string;
    size: number;
    type: string;
  };
  status: "submitted" | "under_review" | "approved" | "rejected" | "resolved";
  createdAt: string;
}

export class MockClaimService {
  async getClaims(): Promise<DamageClaim[]> {
    if (typeof window === "undefined") return delay([]);
    const claims = JSON.parse(localStorage.getItem("999-store-claims") || "[]");
    return delay(claims);
  }

  async submitClaim(claim: Omit<DamageClaim, "id" | "status" | "createdAt">): Promise<DamageClaim> {
    const claimId = `CLM-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullClaim: DamageClaim = {
      ...claim,
      id: claimId,
      status: "submitted",
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      const claims = JSON.parse(localStorage.getItem("999-store-claims") || "[]");
      localStorage.setItem("999-store-claims", JSON.stringify([fullClaim, ...claims]));
    }

    return delay(fullClaim);
  }
}

export const claimService = new MockClaimService();
export default claimService;
