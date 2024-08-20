import { Injectable } from '@angular/core';
import { RegisterDataService } from './register-data.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  constructor(private _registerDataService: RegisterDataService) {}

  public register(
    email: string,
    password: string,
    name: string,
    surname: string,
    phone: string
  ) {
    return this._registerDataService.signup(
      email,
      password,
      name,
      surname,
      phone
    );
  }
}
