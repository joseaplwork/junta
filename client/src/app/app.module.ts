import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule, provideRouter } from '@angular/router';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { DashboardPageComponent, LoginPageComponent } from './pages';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [provideRouter(appRoutes), provideAnimations()],
  declarations: [AppComponent, LoginPageComponent, DashboardPageComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
