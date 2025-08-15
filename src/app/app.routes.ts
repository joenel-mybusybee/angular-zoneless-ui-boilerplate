import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/no-auth.guard';
import { mainRoutes } from './components/pages/main/main.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    canActivate: [AuthenticatedGuard],
    loadComponent: () => import('./components/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    canActivate: [AuthenticatedGuard],
    loadComponent: () => import('./components/pages/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'main',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/pages/main/root/root.component').then((m) => m.MainRootComponent),
    children: mainRoutes,
  },
];
