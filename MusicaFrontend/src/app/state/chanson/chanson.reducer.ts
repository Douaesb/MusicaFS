import { createReducer, on } from '@ngrx/store';
import { Chanson } from './chanson.model';
import * as ChansonActions from './chanson.actions';

export interface ChansonState {
  chansons: Chanson[];
  loading: boolean;
  error: any;
  pagination: {
    totalPages: number;
    totalElements: number;
    pageSize: number;
    pageNumber: number;
  };
}

export const initialState: ChansonState = {
  chansons: [],
  loading: false,
  error: null,
  pagination: {
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
    pageNumber: 0
  }
};

export const chansonReducer = createReducer(
  initialState,
  on(ChansonActions.loadChansons, (state) => ({
    ...state,
    loading: true,
  })),
  on(ChansonActions.loadChansonsSuccess, (state, { chansons }) => {
    console.log('Loaded Chansons:', chansons); 
    return {
      ...state,
      loading: false,
      chansons: Array.isArray(chansons) ? chansons : [],
    };
  }),  
  on(ChansonActions.loadChansonsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),
  on(ChansonActions.createChansonSuccess, (state, { chanson }) => ({
    ...state,
    chansons: [...state.chansons, chanson],
  })),
  on(ChansonActions.updateChansonSuccess, (state, { chanson }) => ({
    ...state,
    chansons: state.chansons.map(c => c.id === chanson.id ? chanson : c),
  })),
  on(ChansonActions.deleteChansonSuccess, (state, { id }) => ({
    ...state,
    chansons: state.chansons.filter(c => c.id !== id),
  })),
  on(ChansonActions.loadChansonsByAlbumId, (state) => ({
    ...state,
    loading: true,
  })),
  on(ChansonActions.loadChansonsByAlbumIdSuccess, (state, { content, totalPages, totalElements, pageSize, pageNumber }) => ({
    ...state,
    loading: false,
    chansons: content,
    pagination: {
      totalPages,
      totalElements,
      pageSize,
      pageNumber
    }
  })),
  on(ChansonActions.loadChansonsByAlbumIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  }))
);
