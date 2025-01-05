import { Injectable, signal } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';

import { Profile } from '../interfaces';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminProfileService implements Profile {
  private _id = signal<string>('');
  private _username = signal<string>('');
  private _permissions = signal<string[]>([]);
  private _roles = signal<string[]>([]);

  constructor(private _auth: AuthService) {}

  set() {
    const { sub, username, permissions, roles } = this._decodeProfile();

    this._id.set(sub || '');
    this._username.set(username);
    this._permissions.set(permissions);
    this._roles.set(roles);
  }

  private _decodeProfile() {
    type Payload = JwtPayload & {
      username: string;
      roles: string[];
      permissions: string[];
    };

    return jwtDecode<Payload>(this._auth.getAccessToken() || '');
  }

  get id() {
    return this._id.asReadonly();
  }

  get username() {
    return this._username.asReadonly();
  }

  get permissions() {
    return this._permissions.asReadonly();
  }

  get roles() {
    return this._roles.asReadonly();
  }
}
