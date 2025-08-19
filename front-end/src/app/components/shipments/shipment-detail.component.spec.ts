import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ShipmentDetailComponent } from './shipment-detail.component';
import { CalculationService } from '../../services/calculation.service';
import { ValidationService } from '../../services/validation.service';
import { NotificationService } from '../../services/notification.service';
import { AppService } from '../../app.service';
import { Calculation } from '../../models/calculation.model';

describe('ShipmentDetailComponent', () => {
  let component: ShipmentDetailComponent;
  let fixture: ComponentFixture<ShipmentDetailComponent>;
  let calculationService: jasmine.SpyObj<CalculationService>;
  let validationService: jasmine.SpyObj<ValidationService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let appService: jasmine.SpyObj<AppService>;

  const mockCalculations: Calculation[] = [
    { id: 1, shipmentId: 1, income: 1000, cost: 500, profitOrLoss: 500 },
    { id: 2, shipmentId: 1, income: 2000, cost: 1500, profitOrLoss: 500 }
  ];

  beforeEach(async () => {
    const calculationSpy = jasmine.createSpyObj('CalculationService', ['getAll', 'create', 'delete']);
    const validationSpy = jasmine.createSpyObj('ValidationService', ['validateCalculation', 'validateShipmentId', 'validateCalculationId']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError', 'showWarning']);
    const appSpy = jasmine.createSpyObj('AppService', ['goTo']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: CalculationService, useValue: calculationSpy },
        { provide: ValidationService, useValue: validationSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: AppService, useValue: appSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShipmentDetailComponent);
    component = fixture.componentInstance;
    calculationService = TestBed.inject(CalculationService) as jasmine.SpyObj<CalculationService>;
    validationService = TestBed.inject(ValidationService) as jasmine.SpyObj<ValidationService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    appService = TestBed.inject(AppService) as jasmine.SpyObj<AppService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with shipment ID from route', () => {
      expect(component.shipmentId).toBe(1);
    });

    it('should load calculations on init', () => {
      calculationService.getAll.and.returnValue(of(mockCalculations));
      validationService.validateShipmentId.and.returnValue({ isValid: true, errors: [] });

      component.ngOnInit();

      expect(calculationService.getAll).toHaveBeenCalledWith(1);
    });

    it('should redirect on invalid shipment ID', () => {
      validationService.validateShipmentId.and.returnValue({ 
        isValid: false, 
        errors: ['Invalid ID'] 
      });

      component.ngOnInit();

      expect(notificationService.showError).toHaveBeenCalled();
      expect(appService.goTo).toHaveBeenCalledWith(['shipments']);
    });

    it('should handle calculation loading error', () => {
      calculationService.getAll.and.returnValue(throwError(() => new Error('Network error')));
      validationService.validateShipmentId.and.returnValue({ isValid: true, errors: [] });

      component.ngOnInit();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Failed to load calculations: Network error'
      );
    });
  });

  describe('form validation', () => {
    beforeEach(() => {
      validationService.validateCalculation.and.returnValue({ isValid: true, errors: [] });
    });

    it('should return true for valid form', () => {
      component.income = 1000;
      component.cost = 500;

      const isValid = component.isFormValid();

      expect(isValid).toBe(true);
      expect(validationService.validateCalculation).toHaveBeenCalledWith(1000, 500);
    });

    it('should return false for invalid form', () => {
      component.income = -100;
      component.cost = 500;
      validationService.validateCalculation.and.returnValue({ 
        isValid: false, 
        errors: ['Income cannot be negative'] 
      });

      const isValid = component.isFormValid();

      expect(isValid).toBe(false);
      expect(component.validationErrors['income']).toBe('Income cannot be negative');
    });

    it('should handle multiple validation errors', () => {
      component.income = -100;
      component.cost = -500;
      validationService.validateCalculation.and.returnValue({ 
        isValid: false, 
        errors: ['Income cannot be negative', 'Cost cannot be negative'] 
      });

      const isValid = component.isFormValid();

      expect(isValid).toBe(false);
      expect(component.validationErrors['income']).toBe('Income cannot be negative');
      expect(component.validationErrors['cost']).toBe('Cost cannot be negative');
    });

    it('should clear validation errors for valid form', () => {
      component.validationErrors = { income: 'Previous error' };
      component.income = 1000;
      component.cost = 500;

      component.isFormValid();

      expect(component.validationErrors).toEqual({});
    });
  });

  describe('add calculation', () => {
    beforeEach(() => {
      validationService.validateCalculation.and.returnValue({ isValid: true, errors: [] });
      calculationService.create.and.returnValue(of(mockCalculations[0]));
      calculationService.getAll.and.returnValue(of(mockCalculations));
    });

    it('should add calculation successfully', () => {
      component.income = 1000;
      component.cost = 500;

      component.addCalculation();

      expect(calculationService.create).toHaveBeenCalledWith(1, { income: 1000, cost: 500 });
      expect(calculationService.getAll).toHaveBeenCalled();
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Calculation added successfully');
      expect(component.income).toBe(0);
      expect(component.cost).toBe(0);
    });

    it('should not add calculation with invalid form', () => {
      validationService.validateCalculation.and.returnValue({ 
        isValid: false, 
        errors: ['Income cannot be negative'] 
      });
      component.income = -100;
      component.cost = 500;

      component.addCalculation();

      expect(calculationService.create).not.toHaveBeenCalled();
      expect(notificationService.showWarning).toHaveBeenCalledWith(
        'Please fix validation errors before adding calculation'
      );
    });

    it('should handle creation error', () => {
      calculationService.create.and.returnValue(throwError(() => new Error('Creation failed')));

      component.addCalculation();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Failed to add calculation: Creation failed'
      );
      expect(component.isLoading).toBe(false);
    });
  });

  describe('delete calculation', () => {
    beforeEach(() => {
      validationService.validateCalculationId.and.returnValue({ isValid: true, errors: [] });
      calculationService.delete.and.returnValue(of(void 0));
      calculationService.getAll.and.returnValue(of(mockCalculations));
    });

    it('should delete calculation successfully', () => {
      component.deleteCalculation(1);

      expect(calculationService.delete).toHaveBeenCalledWith(1, 1);
      expect(calculationService.getAll).toHaveBeenCalled();
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Calculation deleted successfully');
    });

    it('should not delete calculation with invalid ID', () => {
      validationService.validateCalculationId.and.returnValue({ 
        isValid: false, 
        errors: ['Invalid ID'] 
      });

      component.deleteCalculation(0);

      expect(calculationService.delete).not.toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Invalid calculation ID: Invalid ID'
      );
    });

    it('should handle deletion error', () => {
      calculationService.delete.and.returnValue(throwError(() => new Error('Deletion failed')));

      component.deleteCalculation(1);

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Failed to delete calculation: Deletion failed'
      );
      expect(component.isLoading).toBe(false);
    });
  });

  describe('filter functionality', () => {
    it('should apply filter to table data', () => {
      const mockEvent = { target: { value: '1' } } as any;
      component.dataSource.data = mockCalculations;

      component.applyFilter(mockEvent);

      expect(component.dataSource.filter).toBe('1');
    });

    it('should handle empty filter', () => {
      const mockEvent = { target: { value: '   ' } } as any;
      component.dataSource.data = mockCalculations;

      component.applyFilter(mockEvent);

      expect(component.dataSource.filter).toBe('');
    });

    it('should reset paginator to first page when filtering', () => {
      const mockEvent = { target: { value: '1' } } as any;
      component.dataSource.data = mockCalculations;
      component.dataSource.paginator = { firstPage: jasmine.createSpy('firstPage') } as any;

      component.applyFilter(mockEvent);

      expect(component.dataSource.paginator?.firstPage).toHaveBeenCalled();
    });
  });

  describe('component lifecycle', () => {
    it('should set up paginator and sort after view init', () => {
      const mockPaginator = {} as any;
      const mockSort = {} as any;
      component.paginator = mockPaginator;
      component.sort = mockSort;

      component.ngAfterViewInit();

      expect(component.dataSource.paginator).toBe(mockPaginator);
      expect(component.dataSource.sort).toBe(mockSort);
    });

    it('should clean up subscriptions on destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('should set loading state during calculation loading', () => {
      calculationService.getAll.and.returnValue(of(mockCalculations));
      validationService.validateShipmentId.and.returnValue({ isValid: true, errors: [] });

      component.ngOnInit();

      expect(component.isLoading).toBe(false);
    });

    it('should set loading state during calculation creation', () => {
      validationService.validateCalculation.and.returnValue({ isValid: true, errors: [] });
      calculationService.create.and.returnValue(of(mockCalculations[0]));
      calculationService.getAll.and.returnValue(of(mockCalculations));

      component.addCalculation();

      expect(component.isLoading).toBe(false);
    });

    it('should set loading state during calculation deletion', () => {
      validationService.validateCalculationId.and.returnValue({ isValid: true, errors: [] });
      calculationService.delete.and.returnValue(of(void 0));
      calculationService.getAll.and.returnValue(of(mockCalculations));

      component.deleteCalculation(1);

      expect(component.isLoading).toBe(false);
    });
  });

  describe('data source configuration', () => {
    it('should set up filter predicate correctly', () => {
      component.setDataFilterPredicate();

      const testData = { id: 123 } as Calculation;
      const result = component.dataSource.filterPredicate(testData, '12');

      expect(result).toBe(true);
    });

    it('should filter by ID correctly', () => {
      component.setDataFilterPredicate();

      const testData = { id: 123 } as Calculation;
      const result = component.dataSource.filterPredicate(testData, '456');

      expect(result).toBe(false);
    });

    it('should handle case insensitive filtering', () => {
      component.setDataFilterPredicate();

      const testData = { id: 123 } as Calculation;
      const result = component.dataSource.filterPredicate(testData, 'ABC');

      expect(result).toBe(false);
    });
  });
});
