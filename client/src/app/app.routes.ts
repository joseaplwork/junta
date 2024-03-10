import { Route } from '@angular/router';

import { AuthGuard } from './guards';
import { DashboardPageComponent, LoginPageComponent } from './pages';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginPageComponent },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [AuthGuard],
  },
];
