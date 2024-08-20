import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AdminProfile } from '../interfaces/admin-profile.interface';

@Injectable({
  providedIn: 'any'
})
export class ProfileDataService {
  constructor(private _http: HttpClient) {}

  public async fetch(): Promise<AdminProfile> {
    return firstValueFrom(
      this._http.get<AdminProfile>('http://localhost:3000/api/auth/profile')
    );
  }
}
