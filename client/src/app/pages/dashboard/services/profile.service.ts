import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminProfile } from '../interfaces/admin-profile.interface';
import { ProfileDataService } from './profile-data.service';

@Injectable({
  providedIn: 'any',
})
export class ProfileService {
  constructor(private _profileDataService: ProfileDataService) {}

  getProfile(): Observable<AdminProfile> {
    return this._profileDataService.fetchProfile();
  }
}
