import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Shipment } from '../models/shipment.model';

/**
 * Service responsible for managing shipment operations
 * Handles CRUD operations for shipments
 *
 * @example
 * ```typescript
 * constructor(private shipmentService: ShipmentService) {}
 *
 * // Get all shipments
 * this.shipmentService.getAll().subscribe({
 *   next: (shipments) => console.log(shipments),
 *   error: (error) => console.error('Failed to load shipments:', error)
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ShipmentService {
  private baseUrl = '/api/profit/shipments';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all shipments
   * @returns Observable of shipment array
   * @throws HttpErrorResponse if the request fails
   */
  getAll(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(this.baseUrl).pipe(
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new shipment
   * @returns Observable of created shipment
   * @throws HttpErrorResponse if the request fails
   */
  create(): Observable<Shipment> {
    return this.http.post<Shipment>(this.baseUrl, null).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a shipment by ID
   * @param id - The ID of the shipment to delete
   * @returns Observable that completes when deletion is successful
   * @throws HttpErrorResponse if the request fails
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handles HTTP errors and provides meaningful error messages
   * @param error - The HTTP error response
   * @returns Observable that throws a user-friendly error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    console.error('ShipmentService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
