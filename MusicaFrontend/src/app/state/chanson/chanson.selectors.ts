import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChansonState } from './chanson.reducer';

export const selectChansonState = createFeatureSelector<ChansonState>('chanson');

export const selectAllChansons = createSelector(
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
