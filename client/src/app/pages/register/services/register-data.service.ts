import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterDataService {
  constructor(private _http: HttpClient) {}

  signUp(
    email: string,
    password: string,
    name: string,
    surname: string,
    phone: string
  ): Promise<void> {
    const data = {
      email,
      password,
      name,
      surname,
      phone
    };

    return firstValueFrom(
      this._http.post<void>('http://localhost:3000/api/signup', data)
    );
  }
}
