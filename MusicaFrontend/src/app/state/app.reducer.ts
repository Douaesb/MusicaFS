import { ActionReducerMap } from '@ngrx/store';
import { TrackState, trackReducer } from './track/track.reducer';
import { audioReducer, AudioState } from './audio/audio.reducer';
import { authReducer, AuthState } from './auth/auth.reducer';
import { albumReducer, AlbumState } from './album/album.reducer';
import { chansonReducer, ChansonState } from './chanson/chanson.reducer';

export interface AppState {
  track: TrackState;
  audio: AudioState;
  auth: AuthState;
  album: AlbumState;
  chanson: ChansonState;
}

export const reducers: ActionReducerMap<AppState> = {
  track: trackReducer,
  audio: audioReducer,
  auth: authReducer,
  album: albumReducer,
  chanson: chansonReducer,
};
