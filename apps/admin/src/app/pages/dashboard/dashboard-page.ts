
import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { RouterModule } from '@angular/router'

@Component({
  imports: [MatButtonModule, RouterModule],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {}
