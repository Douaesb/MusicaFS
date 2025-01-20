import { ActionReducerMap } from '@ngrx/store';
import { TrackState, trackReducer } from './track/track.reducer';
import {  audioReducer, AudioState } from './audio/audio.reducer';
import {authReducer, AuthState} from "./auth/auth.reducer";

export interface AppState {
  track: TrackState;
  audio: AudioState;
  auth: AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  track: trackReducer,
  audio: audioReducer,
  auth: authReducer,
};
