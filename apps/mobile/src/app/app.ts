import { ChangeDetectionStrategy, Component } from '@angular/core'
import { IonApp, IonRouterOutlet } from '@ionic/angular'

@Component({
  selector: 'jm-root',
  imports: [IonApp, IonRouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ion-app><ion-router-outlet /></ion-app>`,
})
export class App {}
