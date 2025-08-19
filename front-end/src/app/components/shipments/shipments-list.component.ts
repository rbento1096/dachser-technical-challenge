import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ShipmentService } from '../../services/shipment.service';
import { ValidationService } from '../../services/validation.service';
import { NotificationService } from '../../services/notification.service';

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
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="content">
      <h2>Shipments</h2>

      <div style="margin-bottom: 16px">
        <button
          mat-raised-button
          color="primary"
          (click)="addShipment()"
          [disabled]="isLoading"
        >
          <mat-spinner
            *ngIf="isLoading"
            diameter="20"
            class="spinner-margin"
          ></mat-spinner>
          <mat-icon *ngIf="!isLoading">add</mat-icon>
          {{ isLoading ? 'Adding...' : 'Add Shipment' }}
        </button>
      </div>

      <div class="shipments-container" [class.loading]="isLoading">
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

        <div *ngIf="shipments.length === 0 && !isLoading" class="no-shipments">
          <mat-icon>inbox</mat-icon>
          <p>
            No shipments found. Click "Add Shipment" to create your first
            shipment.
          </p>
        </div>

        <div
          *ngIf="isLoading && shipments.length === 0"
          class="loading-container"
        >
          <mat-spinner diameter="50"></mat-spinner>
          <p>Loading shipments...</p>
        </div>
      </div>
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

      .spinner-margin {
        margin-right: 8px;
      }

      .shipments-container {
        position: relative;
      }

      .shipments-container.loading {
        opacity: 0.6;
        pointer-events: none;
      }

      .no-shipments {
        text-align: center;
        padding: 40px;
        color: #666;
      }

      .no-shipments mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        gap: 16px;
      }
    `,
  ],
})
export class ShipmentsListComponent implements OnInit, OnDestroy {
  shipments: Shipment[] = [];
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private shipmentService: ShipmentService,
    private validationService: ValidationService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadShipments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadShipments(): void {
    this.isLoading = true;
    this.shipmentService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.shipments = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(
            `Failed to load shipments: ${error.message}`
          );
        },
      });
  }

  addShipment(): void {
    this.isLoading = true;
    this.shipmentService
      .create()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadShipments();
          this.notificationService.showSuccess('Shipment created successfully');
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError(
            `Failed to create shipment: ${error.message}`
          );
        },
      });
  }

  openShipmentDetail(id: number): void {
    const validation = this.validationService.validateShipmentId(id);
    if (!validation.isValid) {
      this.notificationService.showError(
        `Invalid shipment ID: ${validation.errors.join(', ')}`
      );
      return;
    }

    this.router.navigate(['/shipments', id]);
  }
}
