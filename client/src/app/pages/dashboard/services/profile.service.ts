import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileDataService } from './profile-data.service';

@Injectable({
  providedIn: 'any',
})
export class ProfileService {
  constructor(private _profileDataService: ProfileDataService) {}

  getProfile(): Observable<any> {
    return this._profileDataService.fetchProfile();
  }
}
