import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentsComponent } from './components/shipments/shipments.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, ShipmentsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Profit Calculator';
}
