import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Shipment } from '../models/shipment.model';

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  private baseUrl = '/api/profit/shipments';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(this.baseUrl);
  }

  create(): Observable<Shipment> {
    return this.http.post<Shipment>(this.baseUrl, null);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
