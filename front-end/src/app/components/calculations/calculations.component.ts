import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { CalculationService } from '../../services/calculation.service';

import { Calculation } from '../../models/calculation.model';

@Component({
  selector: 'app-calculations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './calculations.component.html',
})
export class CalculationsComponent {
  @Input() shipmentId!: number;

  calculations: Calculation[] = [];
  income = 0;
  cost = 0;
  displayedColumns = ['id', 'income', 'cost', 'profitOrLoss', 'actions'];

  constructor(private calcService: CalculationService) {}

  ngOnChanges() {
    if (this.shipmentId) {
      this.loadCalculations();
    }
  }

  loadCalculations() {
    this.calcService
      .getAll(this.shipmentId)
      .subscribe((data) => (this.calculations = data));
  }

  addCalculation() {
    this.calcService
      .create(this.shipmentId, { income: this.income, cost: this.cost })
      .subscribe(() => {
        this.income = 0;
        this.cost = 0;
        this.loadCalculations();
      });
  }

  deleteCalculation(id: number) {
    this.calcService
      .delete(this.shipmentId, id)
      .subscribe(() => this.loadCalculations());
  }
}
