import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterDataService {
  constructor(private _http: HttpClient) {}

  signup(
    email: string,
    password: string,
    name: string,
    surname: string,
    phone: string
  ): Observable<void> {
    const registrationData = {
      email,
      password,
      name,
      surname,
      phone
    };

    return this._http.post<void>(
      'http://localhost:3000/api/signup',
      registrationData
    );
  }
}
