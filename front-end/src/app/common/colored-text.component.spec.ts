import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ColorTextComponent } from './colored-text.component';

describe('ColorTextComponent', () => {
  let component: ColorTextComponent;
  let fixture: ComponentFixture<ColorTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ColorTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorTextComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('color resolution', () => {
    it('should resolve primary color correctly', () => {
      component.color = 'primary';
      fixture.detectChanges();

      const result = component.resolveColor('primary');
      expect(result).toBe('var(--mdc-theme-primary, #1976d2)');
    });

    it('should resolve accent color correctly', () => {
      const result = component.resolveColor('accent');
      expect(result).toBe('var(--mdc-theme-secondary, #ff4081)');
    });

    it('should resolve warn color correctly', () => {
      const result = component.resolveColor('warn');
      expect(result).toBe('var(--mdc-theme-error, #f44336)');
    });

    it('should resolve success color correctly', () => {
      const result = component.resolveColor('success');
      expect(result).toBe('var(--mdc-theme-error, #198754)');
    });

    it('should resolve warning color correctly', () => {
      const result = component.resolveColor('warning');
      expect(result).toBe('var(--mdc-theme-error, #ffc107)');
    });

    it('should resolve danger color correctly', () => {
      const result = component.resolveColor('danger');
      expect(result).toBe('var(--mdc-theme-error, #dc3545)');
    });

    it('should return custom color for unknown types', () => {
      const customColor = '#ff0000';
      const result = component.resolveColor(customColor);
      expect(result).toBe(customColor);
    });

    it('should return custom CSS color name', () => {
      const result = component.resolveColor('red');
      expect(result).toBe('red');
    });

    it('should return custom RGB color', () => {
      const result = component.resolveColor('rgb(255, 0, 0)');
      expect(result).toBe('rgb(255, 0, 0)');
    });

    it('should return custom HSL color', () => {
      const result = component.resolveColor('hsl(0, 100%, 50%)');
      expect(result).toBe('hsl(0, 100%, 50%)');
    });
  });

  describe('default color', () => {
    it('should have primary as default color', () => {
      expect(component.color).toBe('primary');
    });

    it('should resolve default color correctly', () => {
      const result = component.resolveColor(component.color);
      expect(result).toBe('var(--mdc-theme-primary, #1976d2)');
    });
  });

  describe('template rendering', () => {
    it('should render span element', () => {
      fixture.detectChanges();
      const spanElement = fixture.nativeElement.querySelector('span');
      expect(spanElement).toBeTruthy();
    });

    it('should apply color style to span', () => {
      component.color = 'success';
      fixture.detectChanges();

      const spanElement = fixture.nativeElement.querySelector('span');
      const computedStyle = window.getComputedStyle(spanElement);
      expect(computedStyle.color).toBe('rgb(25, 135, 84)'); // #198754 in RGB
    });

    it('should apply custom color style', () => {
      component.color = '#ff0000';
      fixture.detectChanges();

      const spanElement = fixture.nativeElement.querySelector('span');
      const computedStyle = window.getComputedStyle(spanElement);
      expect(computedStyle.color).toBe('rgb(255, 0, 0)');
    });

    it('should render content inside span', () => {
      const testContent = 'Test Content';
      component.color = 'primary';
      fixture.detectChanges();

      const spanElement = fixture.nativeElement.querySelector('span');
      spanElement.textContent = testContent;
      expect(spanElement.textContent).toBe(testContent);
    });

    it('should update color when input changes', () => {
      component.color = 'primary';
      fixture.detectChanges();

      let spanElement = fixture.nativeElement.querySelector('span');
      let computedStyle = window.getComputedStyle(spanElement);
      expect(computedStyle.color).toBe('rgb(25, 122, 210)'); // #1976d2 in RGB

      component.color = 'danger';
      fixture.detectChanges();

      spanElement = fixture.nativeElement.querySelector('span');
      computedStyle = window.getComputedStyle(spanElement);
      expect(computedStyle.color).toBe('rgb(220, 53, 69)'); // #dc3545 in RGB
    });
  });

  describe('edge cases', () => {
    it('should handle empty string color', () => {
      const result = component.resolveColor('');
      expect(result).toBe('');
    });

    it('should handle null color', () => {
      const result = component.resolveColor(null as any);
      expect(result).toBe(null);
    });

    it('should handle undefined color', () => {
      const result = component.resolveColor(undefined as any);
      expect(result).toBe(undefined);
    });

    it('should handle case sensitive color names', () => {
      const result = component.resolveColor('PRIMARY');
      expect(result).toBe('PRIMARY'); // Should return as-is since it doesn't match
    });

    it('should handle whitespace in color names', () => {
      const result = component.resolveColor(' primary ');
      expect(result).toBe(' primary '); // Should return as-is
    });
  });

  describe('color validation', () => {
    it('should handle valid hex colors', () => {
      const validHexColors = [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffffff',
        '#000000',
      ];

      validHexColors.forEach((color) => {
        const result = component.resolveColor(color);
        expect(result).toBe(color);
      });
    });

    it('should handle valid CSS color names', () => {
      const validColorNames = [
        'red',
        'green',
        'blue',
        'yellow',
        'purple',
        'orange',
      ];

      validColorNames.forEach((color) => {
        const result = component.resolveColor(color);
        expect(result).toBe(color);
      });
    });

    it('should handle valid RGB colors', () => {
      const validRgbColors = [
        'rgb(255, 0, 0)',
        'rgb(0, 255, 0)',
        'rgb(0, 0, 255)',
      ];

      validRgbColors.forEach((color) => {
        const result = component.resolveColor(color);
        expect(result).toBe(color);
      });
    });

    it('should handle valid RGBA colors', () => {
      const validRgbaColors = [
        'rgba(255, 0, 0, 0.5)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 0, 255, 0.8)',
      ];

      validRgbaColors.forEach((color) => {
        const result = component.resolveColor(color);
        expect(result).toBe(color);
      });
    });

    it('should handle valid HSL colors', () => {
      const validHslColors = [
        'hsl(0, 100%, 50%)',
        'hsl(120, 100%, 50%)',
        'hsl(240, 100%, 50%)',
      ];

      validHslColors.forEach((color) => {
        const result = component.resolveColor(color);
        expect(result).toBe(color);
      });
    });
  });
});
