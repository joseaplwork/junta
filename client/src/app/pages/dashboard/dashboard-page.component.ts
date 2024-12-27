import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '@client/shared/components';

import { AdminProfile } from './interfaces/admin-profile.interface';
import { LogoutService } from './services/logout.service';
import { ProfileDataService } from './services/profile-data.service';

@Component({
  imports: [CommonModule, ButtonComponent, RouterModule],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  admin: AdminProfile | null = null;

  constructor(
    private _profile: ProfileDataService,
    private _logout: LogoutService,
  ) {}

  ngOnInit() {
    this._requestAdminProfile();
  }

  handleButtonClick() {
    this._requestAdminProfile();
  }

  logout() {
    this._logout.endSession();
  }

  private async _requestAdminProfile() {
    this.admin = await this._profile.fetch();
  }
}
