import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminProfile } from './interfaces/admin-profile.interface';
import { LogoutService } from './services/logout.service';
import { ProfileDataService } from './services/profile-data.service';

@Component({
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  admin: AdminProfile | null = null;

  constructor(
    private _profile: ProfileDataService,
    private _logout: LogoutService,
    private readonly _router: Router,
  ) {}

  ngOnInit() {
    this._requestAdminProfile();
  }

  handleButtonClick() {
    this._requestAdminProfile();
  }

  async logout() {
    await this._logout.request();

    this._router.navigate(['/login']);
  }

  private async _requestAdminProfile() {
    this.admin = await this._profile.fetch();
  }
}
