import { bootstrapApplication } from '@angular/platform-browser'

import { AppComponent } from '@/admin/app.component'
import { appConfig } from '@/admin/app.config'

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err))
