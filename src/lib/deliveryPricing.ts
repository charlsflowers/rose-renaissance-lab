/**
 * Calculate delivery cost based on miles.
 * 0-5 miles: $20 flat
 * 5-87 miles: $20 + $1.60 per mile over 5
 */
export function calculateDeliveryCost(miles: number): number {
  if (miles <= 0) return 0;
  if (miles <= 5) return 20;
  return Math.round((20 + (miles - 5) * 1.60) * 100) / 100;
}

/**
 * Calculate delivery cost for Room Decors.
 * 0-10 miles: FREE (included)
 * 10+ miles: $1.60 per mile over 10
 */
export function calculateRoomDecorDeliveryCost(miles: number): number {
  if (miles <= 10) return 0;
  return Math.round(((miles - 10) * 1.60) * 100) / 100;
}

/** Format delivery cost for display */
export function formatDeliveryCost(cost: number): string {
  return cost % 1 === 0 ? `$${cost}` : `$${cost.toFixed(2)}`;
}
