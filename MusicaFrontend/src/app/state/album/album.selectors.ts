import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlbumState } from './album.reducer';

export const selectAlbumState = createFeatureSelector<AlbumState>('album');

export const selectAllAlbums = createSelector(
  selectAlbumState,
  (state) => state.albums
);

export const selectTotalAlbums = createSelector(
  selectAlbumState,
  (state) => state.total
);

export const selectAlbumLoading = createSelector(
  selectAlbumState,
  (state) => state.loading
);

export const selectAlbumError = createSelector(
  selectAlbumState,
  (state) => state.error
);
