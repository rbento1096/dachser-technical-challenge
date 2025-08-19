import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ColorTextComponent } from '../../common/colored-text.component';
import { AppService } from '../../app.service';
import { CalculationService } from '../../services/calculation.service';
import { ValidationService } from '../../services/validation.service';
import { NotificationService } from '../../services/notification.service';

import { Calculation } from '../../models/calculation.model';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ColorTextComponent,
  ],
  template: `
    <div class="content">
      <div class="title-row">
        <button
          mat-icon-button
          aria-label="Return to list"
          (click)="_app.goTo(['shipments'])"
        >
          <mat-icon>arrow_back_ios</mat-icon>
        </button>
        <span class="toolbar-title"> Shipment {{ shipmentId }} </span>
      </div>

      <mat-card class="add-calculation-card">
        <mat-card-title>Add Calculation</mat-card-title>
        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>Income</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="income"
              [disabled]="isLoading"
              placeholder="Enter income amount"
              min="0"
              step="0.01"
            />
            <mat-error *ngIf="validationErrors['income']">
              {{ validationErrors['income'] }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Cost</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="cost"
              [disabled]="isLoading"
              placeholder="Enter cost amount"
              min="0"
              step="0.01"
            />
            <mat-error *ngIf="validationErrors['cost']">
              {{ validationErrors['cost'] }}
            </mat-error>
          </mat-form-field>

          <div class="button-container">
            <button
              mat-raised-button
              color="primary"
              (click)="addCalculation()"
              [disabled]="isLoading || !isFormValid()"
            >
              <mat-spinner
                *ngIf="isLoading"
                diameter="20"
                class="spinner-margin"
              ></mat-spinner>
              <mat-icon *ngIf="!isLoading">add</mat-icon>
              {{ isLoading ? 'Adding...' : 'Add' }}
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-form-field class="filter">
        <mat-label>Filter by ID</mat-label>
        <input
          #input
          matInput
          placeholder="Enter the ID"
          (keyup)="applyFilter($event)"
          [disabled]="isLoading"
        />
      </mat-form-field>

      <div class="table-container" [class.loading]="isLoading">
        <table
          mat-table
          [dataSource]="dataSource"
          matSort
          class="mat-elevation-z8"
        >
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let calc">{{ calc.id }}</td>
          </ng-container>

          <ng-container matColumnDef="income">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Income</th>
            <td mat-cell *matCellDef="let calc">
              {{ calc.income | currency : 'EUR' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="cost">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Cost</th>
            <td mat-cell *matCellDef="let calc">
              {{ calc.cost | currency : 'EUR' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="profitOrLoss">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Profit/Loss
            </th>
            <td mat-cell *matCellDef="let calc">
              <app-color-text
                [color]="
                  calc.profitOrLoss > 0
                    ? 'success'
                    : calc.profitOrLoss < 0
                    ? 'danger'
                    : ''
                "
              >
                {{ calc.profitOrLoss | currency : 'EUR' }}
              </app-color-text>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let calc">
              <button
                mat-icon-button
                color="warn"
                (click)="deleteCalculation(calc.id)"
                [disabled]="isLoading"
                matTooltip="Delete calculation"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

          <tr class="mat-row no-data" *matNoDataRow>
            <td class="mat-cell" colspan="5">
              <div *ngIf="!isLoading; else loadingMessage">
                No data matching the filter "{{ input.value }}"
              </div>
              <ng-template #loadingMessage>
                <div class="loading-message">
                  <mat-spinner diameter="30"></mat-spinner>
                  <span>Loading calculations...</span>
                </div>
              </ng-template>
            </td>
          </tr>
        </table>

        <mat-paginator
          [pageSizeOptions]="[5, 10, 25, 100]"
          aria-label="Select page of calculations"
          [disabled]="isLoading"
        ></mat-paginator>
      </div>
    </div>
  `,
  styles: [
    `
      .add-calculation-card {
        padding: 16px;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      mat-form-field {
        width: 200px;
        margin-right: 10px;
      }

      .button-container {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .spinner-margin {
        margin-right: 8px;
      }

      .title-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .toolbar-title {
        flex: 1;
        font-size: 20px;
        font-weight: 500;
      }

      table,
      mat-card {
        border-radius: 12px;
        overflow: hidden;
      }

      mat-paginator {
        margin-top: 16px;
        border-radius: 12px;
        background-color: transparent;
      }

      .filter {
        font-size: 14px;
        width: 100%;
      }

      .table-container {
        position: relative;
      }

      .table-container.loading {
        opacity: 0.6;
        pointer-events: none;
      }

      .loading-message {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 20px;
      }

      .validation-error {
        color: #f44336;
        font-size: 12px;
        margin-top: 4px;
      }
    `,
  ],
})
export class ShipmentDetailComponent implements OnInit, OnDestroy {
  shipmentId!: number;
  dataSource = new MatTableDataSource<Calculation>([]);
  displayedColumns = ['id', 'income', 'cost', 'profitOrLoss', 'actions'];
  income = 0;
  cost = 0;
  isLoading = false;
  validationErrors: { [key: string]: string } = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private _calculations: CalculationService,
    private _validation: ValidationService,
    private _notification: NotificationService,
    public _app: AppService
  ) {}

  ngOnInit(): void {
    this.shipmentId = Number(this.route.snapshot.paramMap.get('id'));

    const validation = this._validation.validateShipmentId(this.shipmentId);
    if (!validation.isValid) {
      this._notification.showError(
        `Invalid shipment ID: ${validation.errors.join(', ')}`
      );
      this._app.goTo(['shipments']);
      return;
    }

    this.loadCalculations();
    this.setDataFilterPredicate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCalculations(): void {
    this.isLoading = true;
    this._calculations
      .getAll(this.shipmentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this._notification.showError(
            `Failed to load calculations: ${error.message}`
          );
        },
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setDataFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Calculation, filter: string) => {
      const filterText = filter.trim().toLowerCase();
      return data.id.toString().toLowerCase().includes(filterText);
    };
  }

  isFormValid(): boolean {
    const validation = this._validation.validateCalculation(
      this.income,
      this.cost
    );
    this.validationErrors = {};

    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        if (error.includes('Income')) {
          this.validationErrors['income'] = error;
        } else if (error.includes('Cost')) {
          this.validationErrors['cost'] = error;
        }
      });
    }

    return validation.isValid;
  }

  addCalculation(): void {
    if (!this.isFormValid()) {
      this._notification.showWarning(
        'Please fix validation errors before adding calculation'
      );
      return;
    }

    this.isLoading = true;
    this._calculations
      .create(this.shipmentId, { income: this.income, cost: this.cost })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.income = 0;
          this.cost = 0;
          this.validationErrors = {};
          this.loadCalculations();
          this._notification.showSuccess('Calculation added successfully');
        },
        error: (error) => {
          this.isLoading = false;
          this._notification.showError(
            `Failed to add calculation: ${error.message}`
          );
        },
      });
  }

  deleteCalculation(id: number): void {
    const validation = this._validation.validateCalculationId(id);
    if (!validation.isValid) {
      this._notification.showError(
        `Invalid calculation ID: ${validation.errors.join(', ')}`
      );
      return;
    }

    this.isLoading = true;
    this._calculations
      .delete(this.shipmentId, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadCalculations();
          this._notification.showSuccess('Calculation deleted successfully');
        },
        error: (error) => {
          this.isLoading = false;
          this._notification.showError(
            `Failed to delete calculation: ${error.message}`
          );
        },
      });
  }
}
