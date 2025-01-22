import { createReducer, on } from '@ngrx/store';
import * as AlbumActions from './album.action';
import { Album } from './album.models';

export interface AlbumState {
  albums: Album[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: AlbumState = {
  albums: [],
  total: 0,
  loading: false,
  error: null,
};

export const albumReducer = createReducer(
  initialState,
  on(AlbumActions.loadAlbums, (state) => ({ ...state, loading: true })),
  on(AlbumActions.loadAlbumsSuccess, (state, { albums, total }) => ({
    ...state,
    albums,
    total,
    loading: false,
    error: null,
  })),
  on(AlbumActions.loadAlbumsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AlbumActions.searchAlbumsByTitleSuccess, (state, { albums, total }) => ({
    ...state,
    albums,
    total,
    loading: false,
    error: null,
  })),
  on(AlbumActions.searchAlbumsByTitleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AlbumActions.searchAlbumsByArtistSuccess, (state, { albums, total }) => ({
    ...state,
    albums,
    total,
    loading: false,
    error: null,
  })),
  on(AlbumActions.searchAlbumsByArtistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AlbumActions.filterAlbumsByYearSuccess, (state, { albums, total }) => ({
    ...state,
    albums,
    total,
    loading: false,
    error: null,
  })),
  on(AlbumActions.filterAlbumsByYearFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AlbumActions.addAlbumSuccess, (state, { album }) => ({
    ...state,
    albums: [...state.albums, album],
  })),
  on(AlbumActions.deleteAlbumSuccess, (state, { id }) => ({
    ...state,
    albums: state.albums.filter((album) => album.id !== id),
  })),
  on(AlbumActions.updateAlbumSuccess, (state, { album }) => ({
    ...state,
    albums: state.albums.map((a) => (a.id === album.id ? album : a)),
  }))
);
