import { REHYDRATE } from 'redux-persist';
import { all, spawn, take } from 'typed-redux-saga';
import { streamApiSaga } from 'state/common/streamApiSagas';

export function* rootSaga() {
  yield* all([yield* take(REHYDRATE), yield* spawn(streamApiSaga)]);
}
