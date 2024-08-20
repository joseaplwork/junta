import { Component, OnInit } from '@angular/core';
import { AdminProfile } from './interfaces/admin-profile.interface';
import { ProfileDataService } from './services/profile-data.service';

@Component({
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {
  admin: AdminProfile | null = null;

  constructor(private _profile: ProfileDataService) {}

  ngOnInit() {
    this._requestAdminProfile();
  }

  handleButtonClick() {
    this._requestAdminProfile();
  }

  private async _requestAdminProfile() {
    this.admin = await this._profile.fetch();
  }
}
