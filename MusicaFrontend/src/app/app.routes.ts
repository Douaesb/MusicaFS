import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'tracks',
        loadComponent: () => import('./components/track-list/track-list.component').then(m => m.TrackListComponent)
    },
    {
        path: 'tracks/:id',
        loadComponent: () => import('./components/track-detail/track-detail.component').then(m => m.TrackDetailComponent)
    },
    {
        path: '',
        redirectTo: '/tracks',
        pathMatch: 'full'
    },
    // {
    //     path: '**',
    //     redirectTo: '/login'
    // } ,
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          loadComponent: () =>
            import('./components/login/login.component').then(m => m.LoginComponent)
        },
        {
          path: 'register',
          loadComponent: () =>
            import('./components/register/register.component').then(m => m.RegisterComponent)
        }
      ]
    },

];
