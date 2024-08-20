import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminProfile } from '../interfaces/admin-profile.interface';

@Injectable({
  providedIn: 'any'
})
export class ProfileDataService {
  constructor(private _http: HttpClient) {}

  fetchProfile(): Observable<AdminProfile> {
    return this._http.get<AdminProfile>(
      'http://localhost:3000/api/auth/profile'
    );
  }
}
