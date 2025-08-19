/**
 * Represents a profit calculation for a shipment
 * Contains income, cost, and calculated profit/loss
 */
export interface Calculation {
  /** Unique identifier for the calculation */
  id: number;
  /** ID of the shipment this calculation belongs to */
  shipmentId: number;
  /** Income amount in currency units */
  income: number;
  /** Cost amount in currency units */
  cost: number;
  /** Calculated profit (positive) or loss (negative) */
  profitOrLoss: number;
}
