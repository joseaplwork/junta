import { Route } from '@angular/router';

import { AuthGuard } from './guards';
import {
  DashboardPageComponent,
  LoginPageComponent,
  RegisterPageComponent,
} from './pages';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginPageComponent },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardPageComponent },
      {
        path: 'register',
        component: RegisterPageComponent,
      },
    ],
  },
];
