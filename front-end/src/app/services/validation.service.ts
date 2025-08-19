import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ValidationService {
  validateCalculation(income: number, cost: number): ValidationResult {
    const errors: string[] = [];

    if (income < 0) errors.push('Income cannot be negative');
    if (cost < 0) errors.push('Cost cannot be negative');

    if (isNaN(income) || !isFinite(income)) {
      errors.push('Income must be a valid number');
    }
    if (isNaN(cost) || !isFinite(cost)) {
      errors.push('Cost must be a valid number');
    }

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

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
