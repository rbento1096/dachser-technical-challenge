import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ShipmentService } from './shipment.service';
import { Shipment } from '../models/shipment.model';

describe('ShipmentService', () => {
  let service: ShipmentService;
  let httpMock: HttpTestingController;

  const mockShipments: Shipment[] = [
    { id: 1 },
    { id: 2 },
    { id: 3 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShipmentService]
    });
    service = TestBed.inject(ShipmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should retrieve all shipments', () => {
      service.getAll().subscribe(shipments => {
        expect(shipments).toEqual(mockShipments);
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      expect(req.request.method).toBe('GET');
      req.flush(mockShipments);
    });

    it('should handle empty shipments list', () => {
      service.getAll().subscribe(shipments => {
        expect(shipments).toEqual([]);
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      req.flush([]);
    });

    it('should handle HTTP errors', () => {
      const errorMessage = 'Server Error: 500 - Internal Server Error';

      service.getAll().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should retry once on network failure', () => {
      service.getAll().subscribe(shipments => {
        expect(shipments).toEqual(mockShipments);
      });

      // First request fails
      const req1 = httpMock.expectOne('/api/profit/shipments');
      req1.flush('Network error', { status: 0, statusText: 'Network Error' });

      // Second request succeeds (retry)
      const req2 = httpMock.expectOne('/api/profit/shipments');
      req2.flush(mockShipments);
    });

    it('should handle 404 error', () => {
      service.getAll().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle 403 forbidden error', () => {
      service.getAll().subscribe({
        next: () => fail('should have failed with 403 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('create', () => {
    it('should create a new shipment', () => {
      const newShipment: Shipment = { id: 4 };

      service.create().subscribe(shipment => {
        expect(shipment).toEqual(newShipment);
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(newShipment);
    });

    it('should handle creation errors', () => {
      service.create().subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle server error during creation', () => {
      service.create().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle timeout errors', () => {
      service.create().subscribe({
        next: () => fail('should have failed with timeout error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      req.flush('Request Timeout', { status: 408, statusText: 'Request Timeout' });
    });
  });

  describe('delete', () => {
    it('should delete a shipment by ID', () => {
      const shipmentId = 1;

      service.delete(shipmentId).subscribe(() => {
        // Success - no return value expected
      });

      const req = httpMock.expectOne(`/api/profit/shipments/${shipmentId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle deletion of non-existent shipment', () => {
      const shipmentId = 999;

      service.delete(shipmentId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne(`/api/profit/shipments/${shipmentId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle unauthorized deletion', () => {
      const shipmentId = 1;

      service.delete(shipmentId).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne(`/api/profit/shipments/${shipmentId}`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle forbidden deletion', () => {
      const shipmentId = 1;

      service.delete(shipmentId).subscribe({
        next: () => fail('should have failed with 403 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne(`/api/profit/shipments/${shipmentId}`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should handle server error during deletion', () => {
      const shipmentId = 1;

      service.delete(shipmentId).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne(`/api/profit/shipments/${shipmentId}`);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('error handling edge cases', () => {
    it('should handle malformed JSON response', () => {
      service.getAll().subscribe({
        next: () => fail('should have failed with JSON parse error'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      req.flush('Invalid JSON {', { status: 200, statusText: 'OK' });
    });

    it('should handle empty response body', () => {
      service.getAll().subscribe({
        next: () => fail('should have failed with empty response'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      req.flush('', { status: 204, statusText: 'No Content' });
    });

    it('should handle very large response', () => {
      const largeShipments = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1 }));

      service.getAll().subscribe(shipments => {
        expect(shipments.length).toBe(1000);
        expect(shipments[0].id).toBe(1);
        expect(shipments[999].id).toBe(1000);
      });

      const req = httpMock.expectOne('/api/profit/shipments');
      req.flush(largeShipments);
    });
  });
});
