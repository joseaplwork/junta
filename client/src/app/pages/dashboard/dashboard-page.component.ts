import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HasPermissionDirective } from '@client/directives/has-permission.directive';
import { ButtonComponent } from '@client/shared/components';
import { AdminProfileService } from '@client/shared/services/admin-profile.service';

import { LogoutService } from './services/logout.service';

@Component({
  imports: [
    CommonModule,
    ButtonComponent,
    HasPermissionDirective,
    RouterModule,
  ],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  constructor(
    private _logout: LogoutService,
    public profile: AdminProfileService,
  ) {}

  logout() {
    this._logout.endSession();
  }
}
