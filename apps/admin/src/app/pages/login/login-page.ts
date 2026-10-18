import { ChangeDetectionStrategy, Component } from '@angular/core'

import { FormFeat } from './form-feat/form-feat'

@Component({
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormFeat],
})
export class LoginPage {}
