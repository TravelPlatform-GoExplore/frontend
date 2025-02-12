// src/app/app-routing.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { SubscriptionPickerComponent } from './components/subscription-picker/subscription-picker.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { GenerateTripComponent } from './components/generate-trip/generate-trip.component';
import { MyTripsComponent } from './components/my-trips/my-trips.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Add your routes here, except login and register
      // Example:
      { path: '', component: HomeComponent },
      { path: 'profile', component: SubscriptionPickerComponent },
      { path: 'generate-trip', component: GenerateTripComponent },
      { path: 'my-trips', component: MyTripsComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];

