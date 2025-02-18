import { AppComponent } from '@/client/app.component'
import { appConfig } from '@/client/app.config'
import { bootstrapApplication } from '@angular/platform-browser'

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err))
