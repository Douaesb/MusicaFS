import { createAction, props } from '@ngrx/store';
import { Album } from './album.models';

export const loadAlbums = createAction('[Album API] Load Albums', props<{ page: number; size: number; sortBy: string }>());
export const loadAlbumsSuccess = createAction('[Album API] Load Albums Success', props<{ albums: Album[]; total: number }>());
export const loadAlbumsFailure = createAction('[Album API] Load Albums Failure', props<{ error: string }>());

export const addAlbum = createAction('[Album API] Add Album', props<{ album: Album }>());
export const addAlbumSuccess = createAction('[Album API] Add Album Success', props<{ album: Album }>());
export const addAlbumFailure = createAction('[Album API] Add Album Failure', props<{ error: string }>());

export const updateAlbum = createAction('[Album API] Update Album', props<{ album: Album }>());
export const updateAlbumSuccess = createAction('[Album API] Update Album Success', props<{ album: Album }>());
export const updateAlbumFailure = createAction('[Album API] Update Album Failure', props<{ error: string }>());

export const deleteAlbum = createAction('[Album API] Delete Album', props<{ id: string }>());
export const deleteAlbumSuccess = createAction('[Album API] Delete Album Success', props<{ id: string }>());
export const deleteAlbumFailure = createAction('[Album API] Delete Album Failure', props<{ error: string }>());


