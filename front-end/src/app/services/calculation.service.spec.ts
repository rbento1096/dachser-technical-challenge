import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CalculationService } from './calculation.service';
import { Calculation } from '../models/calculation.model';

describe('CalculationService', () => {
  let service: CalculationService;
  let httpMock: HttpTestingController;

  const mockCalculations: Calculation[] = [
    { id: 1, shipmentId: 1, income: 1000, cost: 500, profitOrLoss: 500 },
    { id: 2, shipmentId: 1, income: 2000, cost: 1500, profitOrLoss: 500 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CalculationService]
    });
    service = TestBed.inject(CalculationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should retrieve calculations for a shipment', () => {
      const shipmentId = 1;

      service.getAll(shipmentId).subscribe(calculations => {
        expect(calculations).toEqual(mockCalculations);
      });

      const req = httpMock.expectOne(`/api/profit/shipments/${shipmentId}/calculations`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCalculations);
    });

    it('should handle HTTP errors', () => {
      const shipmentId = 1;
      const errorMessage = 'Server Error: 500 - Internal Server Error';

      service.getAll(shipmentId).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne(`/api/profit/shipments/${shipmentId}/calculations`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should retry once on failure', () => {
      const shipmentId = 1;

      service.getAll(shipmentId).subscribe(calculations => {
        expect(calculations).toEqual(mockCalculations);
      });

      // First request fails
      const req1 = httpMock.expectOne(`/api/profit/shipments/${shipmentId}/calculations`);
      req1.flush('Network error', { status: 0, statusText: 'Network Error' });

      // Second request succeeds (retry)
      const req2 = httpMock.expectOne(`/api/profit/shipments/${shipmentId}/calculations`);
      req2.flush(mockCalculations);
    });
  });

  describe('create', () => {
    it('should create a new calculation', () => {
      const shipmentId = 1;
      const newCalculation = { income: 1500, cost: 800 };
      const createdCalculation: Calculation = { 
        id: 3, 
        shipmentId: 1, 
        income: 1500, 
        cost: 800, 
        profitOrLoss: 700 
      };

      service.create(shipmentId, newCalculation).subscribe(calculation => {
        expect(calculation).toEqual(createdCalculation);
      });

      const req = httpMock.expectOne(`/api/profit/shipments/${shipmentId}/calculations`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newCalculation);
      req.flush(createdCalculation);
    });

    it('should handle creation errors', () => {
      const shipmentId = 1;
      const newCalculation = { income: -100, cost: 500 };

      service.create(shipmentId, newCalculation).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne(`/api/profit/shipments/${shipmentId}/calculations`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('delete', () => {
    it('should delete a calculation', () => {
      const shipmentId = 1;
      const calculationId = 1;

      service.delete(shipmentId, calculationId).subscribe(() => {
        // Success - no return value expected
      });

      const req = httpMock.expectOne(`/api/profit/shipments/${shipmentId}/calculations/${calculationId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle deletion errors', () => {
      const shipmentId = 1;
      const calculationId = 999;

      service.delete(shipmentId, calculationId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne(`/api/profit/shipments/${shipmentId}/calculations/${calculationId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
