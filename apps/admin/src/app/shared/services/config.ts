import { Injectable } from '@angular/core'

import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class Config {
  api = {
    url: `${environment.apiUrl}/api`,
    auth: `${environment.apiUrl}/api/auth`,
  }
}
