import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Calculation } from '../models/calculation.model';

@Injectable({ providedIn: 'root' })
export class CalculationService {
  private baseUrl = '/api/profit/shipments';

  constructor(private http: HttpClient) {}

  getAll(shipmentId: number): Observable<Calculation[]> {
    return this.http
      .get<Calculation[]>(`${this.baseUrl}/${shipmentId}/calculations`)
      .pipe(
        retry(1), // Retry once on failure
        catchError(this.handleError)
      );
  }

  create(
    shipmentId: number,
    calc: Partial<Calculation>
  ): Observable<Calculation> {
    return this.http
      .post<Calculation>(`${this.baseUrl}/${shipmentId}/calculations`, calc)
      .pipe(catchError(this.handleError));
  }

  delete(shipmentId: number, calculationId: number): Observable<void> {
    return this.http
      .delete<void>(
        `${this.baseUrl}/${shipmentId}/calculations/${calculationId}`
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    console.error('CalculationService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
