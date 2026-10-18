import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'

/** Every in-app navigation goes through here, so routes are defined in one place. */
@Injectable({ providedIn: 'root' })
export class Navigation {
  private readonly _router = inject(Router)

  goToLoginPage(): void {
    void this._router.navigate(['login'])
  }

  goToDashboardPage(): void {
    void this._router.navigate(['dashboard'])
  }

  goToJuntaList(): void {
    void this._router.navigate(['dashboard', 'junta'])
  }

  goToJuntaDetails(id: string): void {
    void this._router.navigate(['dashboard', 'junta', id])
  }

  goToJuntaCreate(): void {
    void this._router.navigate(['dashboard', 'junta', 'create'])
  }

  goToJuntaEdit(id: string): void {
    void this._router.navigate(['dashboard', 'junta', 'edit', id])
  }

  goToParticipantList(): void {
    void this._router.navigate(['dashboard', 'participant'])
  }

  goToParticipantDetails(id: string): void {
    void this._router.navigate(['dashboard', 'participant', id])
  }
}
