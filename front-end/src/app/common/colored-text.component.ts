import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type MaterialColor =
  | 'primary'
  | 'accent'
  | 'warn'
  | 'success'
  | 'warning'
  | 'danger'
  | string;

@Component({
  selector: 'app-color-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngStyle]="{ color: resolveColor(color) }">
      <ng-content></ng-content>
    </span>
  `,
  styles: [],
})
export class ColorTextComponent {
  @Input() color: MaterialColor = 'primary';

  resolveColor(color: MaterialColor): string {
    switch (color) {
      case 'primary':
        return 'var(--mdc-theme-primary, #1976d2)';
      case 'accent':
        return 'var(--mdc-theme-secondary, #ff4081)';
      case 'warn':
        return 'var(--mdc-theme-error, #f44336)';
      case 'success':
        return 'var(--mdc-theme-error, #198754)';
      case 'warning':
        return 'var(--mdc-theme-error, #ffc107)';
      case 'danger':
        return 'var(--mdc-theme-error, #dc3545)';
      default:
        return color; // allows passing custom CSS color
    }
  }
}
