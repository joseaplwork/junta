import { Routes } from '@angular/router'

/**
 * Every page is lazy-loaded. Route params (`:id`) bind to inputs of the page
 * component through `withComponentInputBinding()`.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home-page').then(m => m.HomePage),
  },
  { path: '**', redirectTo: 'home' },
]
