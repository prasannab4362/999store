import { ComboSlot, ComboValidationResult } from "@/types/product";

export function validateComboSlots(slots: ComboSlot[], requiredCount: number): ComboValidationResult {
  const selectedCount = slots.filter((slot) => slot.item !== null).length;
  const remainingCount = Math.max(0, requiredCount - selectedCount);
  const errors: string[] = [];

  if (selectedCount < requiredCount) {
    errors.push(`Combo is incomplete. Select ${remainingCount} more item${remainingCount > 1 ? "s" : ""}.`);
  } else if (selectedCount > requiredCount) {
    errors.push(`Combo exceeds limit by ${selectedCount - requiredCount} item${selectedCount - requiredCount > 1 ? "s" : ""}.`);
  }

  // Verify that there are no duplicate lineIds if they are present
  const lineIds = slots
    .map((s) => s.item?.lineId)
    .filter((id): id is string => !!id);
  const uniqueLineIds = new Set(lineIds);
  if (lineIds.length !== uniqueLineIds.size) {
    errors.push("Duplicate item instances detected in slots.");
  }

  return {
    valid: errors.length === 0,
    selectedCount,
    requiredCount,
    remainingCount,
    errors,
  };
}
