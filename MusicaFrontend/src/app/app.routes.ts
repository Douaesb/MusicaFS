import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'album/:albumId/tracks',
        loadComponent: () => import('./components/track-list/track-list.component').then(m => m.TrackListComponent),
        canActivate: [() => AuthGuard(['ROLE_USER', 'ROLE_ADMIN'])],
    },
    {
      path: 'albums',
      loadComponent: () => import('./components/albums/albums.component').then(m => m.AlbumsComponent),
      canActivate: [() => AuthGuard(['ROLE_USER', 'ROLE_ADMIN'])],
  },
    {
        path: 'tracks/:id',
        loadComponent: () => import('./components/track-detail/track-detail.component').then(m => m.TrackDetailComponent),
        canActivate: [() => AuthGuard(['ROLE_USER', 'ROLE_ADMIN'])],
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
