import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { RouterModule } from '@angular/router'

@Component({
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {}
