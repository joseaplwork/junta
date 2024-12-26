import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private _route: Router) {}

  goToLoginPage() {
    return this._route.navigate(['login']);
  }

  goToDashboardPage() {
    return this._route.navigate(['dashboard']);
  }
}
