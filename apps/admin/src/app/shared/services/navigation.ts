import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class Navigation {
  private readonly _route = inject(Router)

  goToLoginPage() {
    return this._route.navigate(['login'])
  }

  goToDashboardPage() {
    return this._route.navigate(['dashboard'])
  }

  goToJuntaList() {
    return this._route.navigate(['dashboard', 'junta'])
  }

  goToJuntaDetails(id: string) {
    return this._route.navigate(['dashboard', 'junta', id])
  }
}
