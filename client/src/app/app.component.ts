import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <app-session-expired-dialog></app-session-expired-dialog>
  `,
})
export class AppComponent {}
