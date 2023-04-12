import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

export type ActionFromCreator<T extends ActionCreatorWithPayload<any>> = {
  type: T['type'];
  payload: Parameters<T>[0];
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
