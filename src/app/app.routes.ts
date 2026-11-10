import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/shell/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'sections/:slug',
        loadComponent: () =>
          import('./features/sections/section-editor.component').then(m => m.SectionEditorComponent),
      },
      {
        path: 'administradores',
        loadComponent: () =>
          import('./features/administradores/administradores.component').then(m => m.AdministradoresComponent),
      },
    ],
  },
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin' },
];
