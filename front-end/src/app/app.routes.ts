import { Routes } from '@angular/router';

import { ShipmentsListComponent } from './components/shipments/shipments-list.component';
import { ShipmentDetailComponent } from './components/shipments/shipment-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'shipments', pathMatch: 'full' },
  {
    path: 'shipments',
    component: ShipmentsListComponent,
  },
  {
    path: 'shipments/:id',
    component: ShipmentDetailComponent,
  },
];
