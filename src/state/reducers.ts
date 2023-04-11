import { AnyAction, combineReducers } from 'redux';
import dialogsSlice from 'state/dialogs/dialogsSlice';

export interface PersistedAppState extends RootState {
  _persist: { version: number; rehydrated: boolean };
}

export type RootState = ReturnType<typeof combinedReducer>;

export const combinedReducer = combineReducers({
  dialogs: dialogsSlice.reducer,
});
