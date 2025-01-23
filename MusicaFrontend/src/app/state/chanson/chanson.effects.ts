import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ChansonService } from 'src/app/core/services/chanson.service';
import * as ChansonActions from './chanson.actions';
import { of } from 'rxjs';

@Injectable()
export class ChansonEffects {
  constructor(
    private actions$: Actions,
    private chansonService: ChansonService
  ) {}

  // Load all chansons
  loadChansons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChansonActions.loadChansons),
      mergeMap(action =>
        this.chansonService.getAllChansons(action.page, action.size, action.sortBy).pipe(
          map(chansons => ChansonActions.loadChansonsSuccess({ chansons })),
          catchError(error => of(ChansonActions.loadChansonsFailure({ error })))
        )
      )
    )
  );

  loadChansonsByAlbumId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChansonActions.loadChansonsByAlbumId),
      mergeMap(action =>
        this.chansonService.getChansonsByAlbumId(action.albumId, action.page, action.size, action.sortBy).pipe(
          map(response => ChansonActions.loadChansonsByAlbumIdSuccess({ 
            content: response.content,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
            pageSize: response.pageable.pageSize,
            pageNumber: response.pageable.pageNumber
          })),
          catchError(error => of(ChansonActions.loadChansonsByAlbumIdFailure({ error })))
        )
      )
    )
  );

  // Create chanson
  createChanson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChansonActions.createChanson),
      mergeMap(action =>
        this.chansonService.createChanson(action.chanson, action.audioFile).pipe(
          map(chanson => ChansonActions.createChansonSuccess({ chanson })),
          catchError(error => of(ChansonActions.createChansonFailure({ error })))
        )
      )
    )
  );

  // Update chanson
  updateChanson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChansonActions.updateChanson),
      mergeMap(action =>
        this.chansonService.updateChanson(action.chanson.id!, action.chanson).pipe(
          map(chanson => ChansonActions.updateChansonSuccess({ chanson })),
          catchError(error => of(ChansonActions.updateChansonFailure({ error })))
        )
      )
    )
  );

  // Delete chanson
  deleteChanson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChansonActions.deleteChanson),
      mergeMap(action =>
        this.chansonService.deleteChanson(action.id).pipe(
          map(() => ChansonActions.deleteChansonSuccess({ id: action.id })),
          catchError(error => of(ChansonActions.deleteChansonFailure({ error })))
        )
      )
    )
  );
}
