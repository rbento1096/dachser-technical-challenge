import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Shipment } from '../models/shipment.model';


@Injectable({ providedIn: 'root' })
export class ShipmentService {
  private baseUrl = '/api/profit/shipments';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(this.baseUrl).pipe(
      retry(1), // Retry once on failure
      catchError(this.handleError)
    );
  }

  create(): Observable<Shipment> {
    return this.http
      .post<Shipment>(this.baseUrl, null)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    console.error('ShipmentService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
