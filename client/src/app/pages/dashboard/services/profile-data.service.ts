import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class ProfileDataService {
  constructor(private _http: HttpClient) {}

  fetchProfile(): Observable<any> {
    return this._http.get('http://localhost:3000/api/auth/profile');
  }
}
