import { REHYDRATE } from 'redux-persist';
import { all, take } from 'typed-redux-saga';

export function* rootSaga() {
  yield* all([yield* take(REHYDRATE)]);
}
