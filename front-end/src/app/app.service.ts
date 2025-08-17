import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private router: Router) {}

  goTo(path: string[]): void {
    this.router.navigate(path);
  }
}
