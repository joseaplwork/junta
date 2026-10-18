import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  IonContent,
  IonHeader,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular'

import { StatusFeat } from './status-feat/status-feat'

@Component({
  selector: 'jm-home-page',
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonText, StatusFeat],
})
export class HomePage {}
