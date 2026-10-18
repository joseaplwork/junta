import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { SessionExpiredWatcher } from './components/session-expired-watcher/session-expired-watcher'
import { Sidebar } from './components/sidebar/sidebar'

@Component({
  imports: [RouterOutlet, SessionExpiredWatcher, Sidebar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ja-sidebar>
      <router-outlet />
    </ja-sidebar>
    <ja-session-expired-watcher />
  `,
})
export class MainLayout {}
