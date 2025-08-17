import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { ColorTextComponent } from '../../common/colored-text.component';
import { AppService } from '../../app.service';
import { CalculationService } from '../../services/calculation.service';

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
            <input matInput type="number" [(ngModel)]="income" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Cost</mat-label>
            <input matInput type="number" [(ngModel)]="cost" />
          </mat-form-field>

          <div>
            <button
              mat-raised-button
              color="primary"
              (click)="addCalculation()"
            >
              <mat-icon>add</mat-icon>
              Add
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
        />
      </mat-form-field>

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
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Profit/Loss</th>
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
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

        <tr class="mat-row no-data" *matNoDataRow>
          <td class="mat-cell" colspan="5">
            No data matching the filter "{{ input.value }}"
          </td>
        </tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[5, 10, 25, 100]"
        aria-label="Select page of users"
      ></mat-paginator>
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
    `,
  ],
})
export class ShipmentDetailComponent {
  shipmentId!: number;
  dataSource = new MatTableDataSource<Calculation>([]);
  displayedColumns = ['id', 'income', 'cost', 'profitOrLoss', 'actions'];
  income = 0;
  cost = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private _calculations: CalculationService,
    public _app: AppService
  ) {
    this.shipmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCalculations();
    this.setDataFilterPredicate();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCalculations(): void {
    this._calculations.getAll(this.shipmentId).subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  setDataFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Calculation, filter: string) => {
      const filterText = filter.trim().toLowerCase();
      return data.id.toString().toLowerCase().includes(filterText);
    };
  }

  addCalculation(): void {
    this._calculations
      .create(this.shipmentId, { income: this.income, cost: this.cost })
      .subscribe(() => {
        this.income = 0;
        this.cost = 0;
        this.loadCalculations();
      });
  }

  deleteCalculation(id: number): void {
    this._calculations
      .delete(this.shipmentId, id)
      .subscribe(() => this.loadCalculations());
  }
}
