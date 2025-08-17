import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { CalculationsComponent } from '../calculations/calculations.component';

import { ShipmentService } from '../../services/shipment.service';

import { Shipment } from '../../models/shipment.model';

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CalculationsComponent,
  ],
  templateUrl: './shipments.component.html',
})
export class ShipmentsComponent {
  shipments: Shipment[] = [];
  displayedColumns = ['id', 'actions'];

  constructor(private shipmentService: ShipmentService) {
    this.loadShipments();
  }

  loadShipments() {
    this.shipmentService.getAll().subscribe((data) => (this.shipments = data));
  }

  addShipment() {
    this.shipmentService.create().subscribe(() => this.loadShipments());
  }

  deleteShipment(id: number) {
    this.shipmentService.delete(id).subscribe(() => this.loadShipments());
  }
}
