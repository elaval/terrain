import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' }
];
