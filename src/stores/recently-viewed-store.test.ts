import { describe, it, expect, beforeEach } from "vitest";
import { useRecentlyViewedStore } from "./recently-viewed-store";

describe("Recently Viewed Store", () => {
  beforeEach(() => {
    useRecentlyViewedStore.setState({ items: [] });
  });

  it("should add recently viewed items to the top", () => {
    const store = useRecentlyViewedStore.getState();
    store.addRecentlyViewed("item-1");
    store.addRecentlyViewed("item-2");

    expect(useRecentlyViewedStore.getState().items).toEqual(["item-2", "item-1"]);
  });

  it("should bring an existing item to the top if viewed again", () => {
    const store = useRecentlyViewedStore.getState();
    store.addRecentlyViewed("item-1");
    store.addRecentlyViewed("item-2");
    store.addRecentlyViewed("item-1"); // view item-1 again

    expect(useRecentlyViewedStore.getState().items).toEqual(["item-1", "item-2"]);
  });

  it("should enforce a maximum limit of 12 items", () => {
    const store = useRecentlyViewedStore.getState();
    for (let i = 1; i <= 15; i++) {
      store.addRecentlyViewed(`item-${i}`);
    }

    const state = useRecentlyViewedStore.getState();
    expect(state.items.length).toBe(12);
    // Should contain items 15 down to 4 (most recent 12)
    expect(state.items[0]).toBe("item-15");
    expect(state.items[11]).toBe("item-4");
    expect(state.items.includes("item-3")).toBe(false);
  });
});
