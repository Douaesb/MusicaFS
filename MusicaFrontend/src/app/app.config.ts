import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { reducers } from './state/app.reducer';
import { TrackEffects } from './state/track/track.effects';

import { routes } from './app.routes';
import { provideEffects } from '@ngrx/effects';
import {AuthEffects} from "./state/auth/auth.effects";
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptors';
import { AlbumEffects } from './state/album/album.effects';
import { ChansonEffects } from './state/chanson/chanson.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(reducers),
    provideEffects([TrackEffects, AuthEffects, AlbumEffects, ChansonEffects]),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
