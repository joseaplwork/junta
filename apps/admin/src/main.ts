import { bootstrapApplication } from '@angular/platform-browser'

import { App } from '@/admin/app'
import { appConfig } from '@/admin/app-config'

bootstrapApplication(App, appConfig).catch(err => console.error(err))
