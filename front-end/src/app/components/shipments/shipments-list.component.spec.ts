import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ShipmentsListComponent } from './shipments-list.component';
import { ShipmentService } from '../../services/shipment.service';
import { ValidationService } from '../../services/validation.service';
import { NotificationService } from '../../services/notification.service';
import { Shipment } from '../../models/shipment.model';

describe('ShipmentsListComponent', () => {
  let component: ShipmentsListComponent;
  let fixture: ComponentFixture<ShipmentsListComponent>;
  let shipmentService: jasmine.SpyObj<ShipmentService>;
  let validationService: jasmine.SpyObj<ValidationService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  const mockShipments: Shipment[] = [
    { id: 1 },
    { id: 2 },
    { id: 3 }
  ];

  beforeEach(async () => {
    const shipmentSpy = jasmine.createSpyObj('ShipmentService', ['getAll', 'create']);
    const validationSpy = jasmine.createSpyObj('ValidationService', ['validateShipmentId']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatListModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: ShipmentService, useValue: shipmentSpy },
        { provide: ValidationService, useValue: validationSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShipmentsListComponent);
    component = fixture.componentInstance;
    shipmentService = TestBed.inject(ShipmentService) as jasmine.SpyObj<ShipmentService>;
    validationService = TestBed.inject(ValidationService) as jasmine.SpyObj<ValidationService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load shipments on init', () => {
      shipmentService.getAll.and.returnValue(of(mockShipments));

      component.ngOnInit();

      expect(shipmentService.getAll).toHaveBeenCalled();
      expect(component.shipments).toEqual(mockShipments);
    });

    it('should handle loading error', () => {
      shipmentService.getAll.and.returnValue(throwError(() => new Error('Network error')));

      component.ngOnInit();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Failed to load shipments: Network error'
      );
    });

    it('should set loading state correctly', () => {
      shipmentService.getAll.and.returnValue(of(mockShipments));

      component.ngOnInit();

      expect(component.isLoading).toBe(false);
    });
  });

  describe('add shipment', () => {
    beforeEach(() => {
      shipmentService.create.and.returnValue(of(mockShipments[0]));
      shipmentService.getAll.and.returnValue(of(mockShipments));
    });

    it('should create shipment successfully', () => {
      component.addShipment();

      expect(shipmentService.create).toHaveBeenCalled();
      expect(shipmentService.getAll).toHaveBeenCalled();
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Shipment created successfully');
    });

    it('should handle creation error', () => {
      shipmentService.create.and.returnValue(throwError(() => new Error('Creation failed')));

      component.addShipment();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Failed to create shipment: Creation failed'
      );
      expect(component.isLoading).toBe(false);
    });

    it('should set loading state during creation', () => {
      shipmentService.create.and.returnValue(of(mockShipments[0]));
      shipmentService.getAll.and.returnValue(of(mockShipments));

      component.addShipment();

      expect(component.isLoading).toBe(false);
    });
  });

  describe('open shipment detail', () => {
    beforeEach(() => {
      validationService.validateShipmentId.and.returnValue({ isValid: true, errors: [] });
    });

    it('should navigate to shipment detail with valid ID', () => {
      component.openShipmentDetail(1);

      expect(validationService.validateShipmentId).toHaveBeenCalledWith(1);
      expect(router.navigate).toHaveBeenCalledWith(['/shipments', 1]);
    });

    it('should not navigate with invalid ID', () => {
      validationService.validateShipmentId.and.returnValue({ 
        isValid: false, 
        errors: ['Invalid ID'] 
      });

      component.openShipmentDetail(0);

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Invalid shipment ID: Invalid ID'
      );
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle negative ID', () => {
      validationService.validateShipmentId.and.returnValue({ 
        isValid: false, 
        errors: ['Shipment ID must be a positive number'] 
      });

      component.openShipmentDetail(-1);

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Invalid shipment ID: Shipment ID must be a positive number'
      );
    });

    it('should handle zero ID', () => {
      validationService.validateShipmentId.and.returnValue({ 
        isValid: false, 
        errors: ['Shipment ID must be a positive number'] 
      });

      component.openShipmentDetail(0);

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Invalid shipment ID: Shipment ID must be a positive number'
      );
    });
  });

  describe('component lifecycle', () => {
    it('should clean up subscriptions on destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('should show loading state when no shipments and loading', () => {
      component.isLoading = true;
      component.shipments = [];

      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector('.loading-container');
      expect(loadingElement).toBeTruthy();
    });

    it('should show empty state when no shipments and not loading', () => {
      component.isLoading = false;
      component.shipments = [];

      fixture.detectChanges();

      const emptyElement = fixture.nativeElement.querySelector('.no-shipments');
      expect(emptyElement).toBeTruthy();
    });

    it('should show shipments when available', () => {
      component.isLoading = false;
      component.shipments = mockShipments;

      fixture.detectChanges();

      const shipmentCards = fixture.nativeElement.querySelectorAll('.shipment-card');
      expect(shipmentCards.length).toBe(3);
    });
  });

  describe('button states', () => {
    it('should disable add button when loading', () => {
      component.isLoading = true;

      fixture.detectChanges();

      const addButton = fixture.nativeElement.querySelector('button[mat-raised-button]');
      expect(addButton.disabled).toBe(true);
    });

    it('should enable add button when not loading', () => {
      component.isLoading = false;

      fixture.detectChanges();

      const addButton = fixture.nativeElement.querySelector('button[mat-raised-button]');
      expect(addButton.disabled).toBe(false);
    });

    it('should show loading spinner in button when loading', () => {
      component.isLoading = true;

      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('mat-spinner');
      expect(spinner).toBeTruthy();
    });

    it('should show correct button text when loading', () => {
      component.isLoading = true;

      fixture.detectChanges();

      const buttonText = fixture.nativeElement.querySelector('button[mat-raised-button]').textContent;
      expect(buttonText).toContain('Adding...');
    });

    it('should show correct button text when not loading', () => {
      component.isLoading = false;

      fixture.detectChanges();

      const buttonText = fixture.nativeElement.querySelector('button[mat-raised-button]').textContent;
      expect(buttonText).toContain('Add Shipment');
    });
  });

  describe('shipment cards', () => {
    beforeEach(() => {
      component.shipments = mockShipments;
      component.isLoading = false;
      fixture.detectChanges();
    });

    it('should display correct shipment IDs', () => {
      const shipmentElements = fixture.nativeElement.querySelectorAll('.shipment-card');
      
      expect(shipmentElements[0].textContent).toContain('Shipment ID: 1');
      expect(shipmentElements[1].textContent).toContain('Shipment ID: 2');
      expect(shipmentElements[2].textContent).toContain('Shipment ID: 3');
    });

    it('should have click handlers', () => {
      const shipmentCards = fixture.nativeElement.querySelectorAll('.shipment-card');
      
      shipmentCards.forEach((card: HTMLElement) => {
        expect(card.style.cursor).toBe('pointer');
      });
    });

    it('should call openShipmentDetail when clicked', () => {
      spyOn(component, 'openShipmentDetail');
      validationService.validateShipmentId.and.returnValue({ isValid: true, errors: [] });

      const firstCard = fixture.nativeElement.querySelector('.shipment-card');
      firstCard.click();

      expect(component.openShipmentDetail).toHaveBeenCalledWith(1);
    });
  });

  describe('error handling scenarios', () => {
    it('should handle 404 error when loading shipments', () => {
      shipmentService.getAll.and.returnValue(throwError(() => new Error('Server Error: 404 - Not Found')));

      component.ngOnInit();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Failed to load shipments: Server Error: 404 - Not Found'
      );
    });

    it('should handle 500 error when creating shipment', () => {
      shipmentService.create.and.returnValue(throwError(() => new Error('Server Error: 500 - Internal Server Error')));

      component.addShipment();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Failed to create shipment: Server Error: 500 - Internal Server Error'
      );
    });

    it('should handle network error when loading shipments', () => {
      shipmentService.getAll.and.returnValue(throwError(() => new Error('Network Error')));

      component.ngOnInit();

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Failed to load shipments: Network Error'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty shipments array', () => {
      shipmentService.getAll.and.returnValue(of([]));

      component.ngOnInit();

      expect(component.shipments).toEqual([]);
    });

    it('should handle very large shipments array', () => {
      const largeShipments = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
      shipmentService.getAll.and.returnValue(of(largeShipments));

      component.ngOnInit();

      expect(component.shipments.length).toBe(100);
    });

    it('should handle rapid successive clicks', () => {
      shipmentService.create.and.returnValue(of(mockShipments[0]));
      shipmentService.getAll.and.returnValue(of(mockShipments));

      component.addShipment();
      component.addShipment();
      component.addShipment();

      expect(shipmentService.create).toHaveBeenCalledTimes(3);
    });
  });
});
