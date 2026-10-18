import { bootstrapApplication } from '@angular/platform-browser'

import { App } from '@/mobile/app'
import { appConfig } from '@/mobile/app-config'

bootstrapApplication(App, appConfig).catch(err => console.error(err))
