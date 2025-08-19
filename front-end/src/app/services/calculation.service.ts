import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Calculation } from '../models/calculation.model';

/**
 * Service responsible for managing calculation operations
 * Handles CRUD operations for profit calculations
 *
 * @example
 * ```typescript
 * constructor(private calculationService: CalculationService) {}
 *
 * // Get all calculations for a shipment
 * this.calculationService.getAll(shipmentId).subscribe({
 *   next: (calculations) => console.log(calculations),
 *   error: (error) => console.error('Failed to load calculations:', error)
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CalculationService {
  private baseUrl = '/api/profit/shipments';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all calculations for a specific shipment
   * @param shipmentId - The ID of the shipment
   * @returns Observable of calculation array
   * @throws HttpErrorResponse if the request fails
   */
  getAll(shipmentId: number): Observable<Calculation[]> {
    return this.http
      .get<Calculation[]>(`${this.baseUrl}/${shipmentId}/calculations`)
      .pipe(
        retry(1), // Retry once on failure
        catchError(this.handleError)
      );
  }

  /**
   * Creates a new calculation for a shipment
   * @param shipmentId - The ID of the shipment
   * @param calc - Partial calculation data (income, cost)
   * @returns Observable of created calculation
   * @throws HttpErrorResponse if the request fails
   */
  create(
    shipmentId: number,
    calc: Partial<Calculation>
  ): Observable<Calculation> {
    return this.http
      .post<Calculation>(`${this.baseUrl}/${shipmentId}/calculations`, calc)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a calculation by ID
   * @param shipmentId - The ID of the shipment
   * @param calculationId - The ID of the calculation to delete
   * @returns Observable that completes when deletion is successful
   * @throws HttpErrorResponse if the request fails
   */
  delete(shipmentId: number, calculationId: number): Observable<void> {
    return this.http
      .delete<void>(
        `${this.baseUrl}/${shipmentId}/calculations/${calculationId}`
      )
      .pipe(catchError(this.handleError));
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

    console.error('CalculationService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
