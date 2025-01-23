import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChansonState } from './chanson.reducer';

export const selectChansonState = createFeatureSelector<ChansonState>('chanson');

export const selectChansonsByAlbumId = createSelector(
  selectChansonState,
  (state: ChansonState) => state.chansons
);

export const selectChansonLoading = createSelector(
  selectChansonState,
  (state: ChansonState) => state.loading
);

export const selectChansonError = createSelector(
  selectChansonState,
  (state: ChansonState) => state.error
);

export const selectPagination = createSelector(
  selectChansonState,
  (state: ChansonState) => state.pagination
);

export const selectTotalPages = createSelector(
  selectPagination,
  (pagination) => pagination.totalPages
);

export const selectTotalElements = createSelector(
  selectPagination,
  (pagination) => pagination.totalElements
);
