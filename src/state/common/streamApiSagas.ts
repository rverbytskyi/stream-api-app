import { take } from 'typed-redux-saga';
import actions from 'state/actions';

export function* streamApiSaga() {
  while (true) {
    const { payload } = yield* take(actions.streamApi.streamRequested);

    console.log(payload);
  }
}
