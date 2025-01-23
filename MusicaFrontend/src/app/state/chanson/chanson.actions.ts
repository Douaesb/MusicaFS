import { createAction, props } from '@ngrx/store';
import { Chanson } from './chanson.model';

export const loadChansons = createAction('[Chanson] Load Chansons', props<{ page: number, size: number, sortBy: string }>());

export const loadChansonsSuccess = createAction('[Chanson] Load Chansons Success', props<{ chansons: Chanson[] }>());

export const loadChansonsFailure = createAction('[Chanson] Load Chansons Failure', props<{ error: any }>());

export const createChanson = createAction('[Chanson] Create Chanson', props<{ chanson: Chanson, audioFile: File }>());

export const createChansonSuccess = createAction('[Chanson] Create Chanson Success', props<{ chanson: Chanson }>());

export const createChansonFailure = createAction('[Chanson] Create Chanson Failure', props<{ error: any }>());

export const updateChanson = createAction(
  '[Chanson] Update Chanson', 
  props<{ chanson: Chanson, audioFile?: File }>()
);
export const updateChansonSuccess = createAction('[Chanson] Update Chanson Success', props<{ chanson: Chanson }>());

export const updateChansonFailure = createAction('[Chanson] Update Chanson Failure', props<{ error: any }>());

export const deleteChanson = createAction('[Chanson] Delete Chanson', props<{ id: string }>());

export const deleteChansonSuccess = createAction('[Chanson] Delete Chanson Success', props<{ id: string }>());

export const deleteChansonFailure = createAction('[Chanson] Delete Chanson Failure', props<{ error: any }>());

export const loadChansonsByAlbumId = createAction(
  '[Chanson] Load Chansons By Album ID',
  props<{ albumId: string; page: number; size: number; sortBy: string }>()
);

export const loadChansonsByAlbumIdSuccess = createAction(
  '[Chanson] Load Chansons By Album ID Success',
  props<{ 
    content: Chanson[],
    totalPages: number,
    totalElements: number,
    pageSize: number,
    pageNumber: number
  }>()
);
export const loadChansonsByAlbumIdFailure = createAction(
  '[Chanson] Load Chansons By Album ID Failure',
  props<{ error: any }>()
);