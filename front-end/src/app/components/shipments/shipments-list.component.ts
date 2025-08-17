import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ShipmentService } from '../../services/shipment.service';

import { Shipment } from '../../models/shipment.model';

@Component({
  selector: 'app-shipments-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
  ],
  template: `
    <div class="content">
      <h2>Shipments</h2>

      <div style="margin-bottom: 16px">
        <button mat-raised-button color="primary" (click)="addShipment()">
          <mat-icon>add</mat-icon>
          Add Shipment
        </button>
      </div>

      <mat-card
        *ngFor="let shipment of shipments"
        class="shipment-card"
        (click)="openShipmentDetail(shipment.id)"
      >
        <mat-card-content>
          <mat-list-item>
            <mat-icon matListItemIcon>local_shipping</mat-icon>
            <span matListItemTitle>Shipment ID: {{ shipment.id }}</span>
          </mat-list-item>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .shipment-card {
        cursor: pointer;
        margin-bottom: 12px;
        transition: box-shadow 0.3s;
      }

      .shipment-card:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        .mat-mdc-list-item-icon {
          color: #1976d2;
        }
      }
      .mat-mdc-list-item-icon {
        color: #000;
      }
    `,
  ],
})
export class ShipmentsListComponent {
  shipments: Shipment[] = [];

  constructor(
    private shipmentService: ShipmentService,
    private router: Router
  ) {
    this.loadShipments();
  }

  loadShipments() {
    this.shipmentService.getAll().subscribe((data) => (this.shipments = data));
  }

  addShipment() {
    this.shipmentService.create().subscribe(() => this.loadShipments());
  }

  openShipmentDetail(id: number) {
    this.router.navigate(['/shipments', id]);
  }
}
