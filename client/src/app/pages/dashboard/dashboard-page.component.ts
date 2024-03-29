import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminProfile } from './interfaces/admin-profile.interface';
import { ProfileService } from './services/profile.service';

@Component({
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  constructor(private _profile: ProfileService) {}

  public admin$: Observable<AdminProfile | null> = of(null);

  public ngOnInit() {
    this.admin$ = this._profile.getProfile();
  }

  public handleButtonClick() {
    this.admin$ = this._profile.getProfile();
  }
}
