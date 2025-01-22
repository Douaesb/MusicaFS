import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { AlbumService } from 'src/app/core/services/album.service';
import * as AlbumActions from './album.action';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AlbumEffects {
    constructor(private actions$: Actions, private albumService: AlbumService) {}
  
    loadAlbums$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AlbumActions.loadAlbums),
        mergeMap(({ page, size, sortBy }) =>
          this.albumService.getAllAlbums(page, size, sortBy).pipe(
            map((response) =>
              AlbumActions.loadAlbumsSuccess({
                albums: response.content,
                total: response.totalElements,
              })
            ),
            catchError((error) =>
              of(AlbumActions.loadAlbumsFailure({ error: error.message }))
            )
          )
        )
      )
    );
  
    addAlbum$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AlbumActions.addAlbum),
        mergeMap(({ album }) =>
          this.albumService.addAlbum(album).pipe(
            map((newAlbum) => AlbumActions.addAlbumSuccess({ album: newAlbum })),
            catchError((error) =>
              of(AlbumActions.addAlbumFailure({ error: error.message }))
            )
          )
        )
      )
    );
  
    updateAlbum$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AlbumActions.updateAlbum),
        mergeMap(({ album }) =>
          this.albumService.updateAlbum(album.id!, album).pipe(
            map((updatedAlbum) =>
              AlbumActions.updateAlbumSuccess({ album: updatedAlbum })
            ),
            catchError((error) =>
              of(AlbumActions.updateAlbumFailure({ error: error.message }))
            )
          )
        )
      )
    );
  
    deleteAlbum$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AlbumActions.deleteAlbum),
        mergeMap(({ id }) =>
          this.albumService.deleteAlbum(id).pipe(
            map(() => AlbumActions.deleteAlbumSuccess({ id })),
            catchError((error) =>
              of(AlbumActions.deleteAlbumFailure({ error: error.message }))
            )
          )
        )
      )
    );
  }
  