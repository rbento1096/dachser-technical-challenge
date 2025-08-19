import { TestBed } from '@angular/core/testing';

import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService]
    });
    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateCalculation', () => {
    it('should return valid for positive numbers', () => {
      const result = service.validateCalculation(1000, 500);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return invalid for negative income', () => {
      const result = service.validateCalculation(-100, 500);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Income cannot be negative');
    });

    it('should return invalid for negative cost', () => {
      const result = service.validateCalculation(1000, -500);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Cost cannot be negative');
    });

    it('should return invalid for NaN income', () => {
      const result = service.validateCalculation(NaN, 500);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Income must be a valid number');
    });

    it('should return invalid for NaN cost', () => {
      const result = service.validateCalculation(1000, NaN);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Cost must be a valid number');
    });

    it('should return invalid for infinite income', () => {
      const result = service.validateCalculation(Infinity, 500);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Income must be a valid number');
    });

    it('should return invalid for infinite cost', () => {
      const result = service.validateCalculation(1000, Infinity);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Cost must be a valid number');
    });

    it('should return warning for very high income', () => {
      const result = service.validateCalculation(2000000, 500);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Income amount seems too high. Please verify.');
    });

    it('should return warning for very high cost', () => {
      const result = service.validateCalculation(1000, 2000000);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Cost amount seems too high. Please verify.');
    });

    it('should return multiple errors for multiple issues', () => {
      const result = service.validateCalculation(-100, -500);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Income cannot be negative');
      expect(result.errors).toContain('Cost cannot be negative');
      expect(result.errors.length).toBe(2);
    });
  });

  describe('validateShipmentId', () => {
    it('should return valid for positive ID', () => {
      const result = service.validateShipmentId(1);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return invalid for zero ID', () => {
      const result = service.validateShipmentId(0);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Shipment ID must be a positive number');
    });

    it('should return invalid for negative ID', () => {
      const result = service.validateShipmentId(-1);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Shipment ID must be a positive number');
    });

    it('should return invalid for NaN ID', () => {
      const result = service.validateShipmentId(NaN);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Shipment ID must be a valid number');
    });

    it('should return invalid for infinite ID', () => {
      const result = service.validateShipmentId(Infinity);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Shipment ID must be a valid number');
    });
  });

  describe('validateCalculationId', () => {
    it('should return valid for positive ID', () => {
      const result = service.validateCalculationId(1);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return invalid for zero ID', () => {
      const result = service.validateCalculationId(0);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Calculation ID must be a positive number');
    });

    it('should return invalid for negative ID', () => {
      const result = service.validateCalculationId(-1);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Calculation ID must be a positive number');
    });

    it('should return invalid for NaN ID', () => {
      const result = service.validateCalculationId(NaN);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Calculation ID must be a valid number');
    });

    it('should return invalid for infinite ID', () => {
      const result = service.validateCalculationId(Infinity);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Calculation ID must be a valid number');
    });
  });
});
