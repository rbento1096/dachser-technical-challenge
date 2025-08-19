import { Injectable } from '@angular/core';

/**
 * Service responsible for input validation
 * Provides validation methods for forms and user inputs
 */
@Injectable({ providedIn: 'root' })
export class ValidationService {
  /**
   * Validates calculation input values
   * @param income - The income amount
   * @param cost - The cost amount
   * @returns Validation result with isValid flag and error messages
   */
  validateCalculation(income: number, cost: number): ValidationResult {
    const errors: string[] = [];

    // Check for negative values
    if (income < 0) errors.push('Income cannot be negative');
    if (cost < 0) errors.push('Cost cannot be negative');

    // Check for non-numeric values
    if (isNaN(income) || !isFinite(income)) {
      errors.push('Income must be a valid number');
    }
    if (isNaN(cost) || !isFinite(cost)) {
      errors.push('Cost must be a valid number');
    }

    // Check for reasonable limits (optional business rule)
    if (income > 1000000) {
      errors.push('Income amount seems too high. Please verify.');
    }

    if (cost > 1000000) {
      errors.push('Cost amount seems too high. Please verify.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates shipment ID
   * @param id - The shipment ID
   * @returns Validation result
   */
  validateShipmentId(id: number): ValidationResult {
    const errors: string[] = [];

    if (!id || id <= 0) errors.push('Shipment ID must be a positive number');

    if (isNaN(id) || !isFinite(id))
      errors.push('Shipment ID must be a valid number');

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates calculation ID
   * @param id - The calculation ID
   * @returns Validation result
   */
  validateCalculationId(id: number): ValidationResult {
    const errors: string[] = [];

    if (!id || id <= 0) errors.push('Calculation ID must be a positive number');

    if (isNaN(id) || !isFinite(id)) {
      errors.push('Calculation ID must be a valid number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Represents the result of a validation operation
 */
export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Array of error messages if validation failed */
  errors: string[];
}
