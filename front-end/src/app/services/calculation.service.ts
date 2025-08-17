import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Calculation } from '../models/calculation.model';

@Injectable({ providedIn: 'root' })
export class CalculationService {
  private baseUrl = '/api/profit/shipments';

  constructor(private http: HttpClient) {}

  getAll(shipmentId: number): Observable<Calculation[]> {
    return this.http.get<Calculation[]>(
      `${this.baseUrl}/${shipmentId}/calculations`
    );
  }

  create(
    shipmentId: number,
    calc: Partial<Calculation>
  ): Observable<Calculation> {
    return this.http.post<Calculation>(
      `${this.baseUrl}/${shipmentId}/calculations`,
      calc
    );
  }

  delete(shipmentId: number, calculationId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${shipmentId}/calculations/${calculationId}`
    );
  }
}
