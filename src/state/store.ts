import { applyMiddleware, compose, createStore } from 'redux';
import {
  createMigrate,
  MigrationManifest,
  PersistConfig,
  persistReducer,
  persistStore,
} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { combinedReducer, PersistedAppState, RootState } from 'state/reducers';
import { initReactotron, storage } from 'utils';
import _ from 'lodash';
import { rootSaga } from 'state/sagas';

const migrations: MigrationManifest = {
  0: state => state,
};

const persistConfig: PersistConfig<RootState> = {
  blacklist: [
    'status',
    'date',
    'cholesterol',
    'timer',
    'navigation',
    'bpm',
    'deleteAccount',
    'permissions',
  ],
  key: '@StreamAPIApp:state',
  migrate: createMigrate(migrations, { debug: __DEV__ }),
  storage: storage,
  version: 0,
};

export const configStore = (initialState?: PersistedAppState) => {
  let sagaMonitor;

  let reactorEnhancer;

  if (__DEV__) {
    const Reactotron = initReactotron();

    sagaMonitor = Reactotron.createSagaMonitor?.();

    reactorEnhancer = Reactotron.createEnhancer?.();

    // eslint-disable-next-line no-console
    console.tron = Reactotron;
  } else {
    // eslint-disable-next-line no-console
    console.tron = {
      error: (): null => null,
      log: (): null => null,
    };
  }

  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

  const sagaEnhancer = applyMiddleware(sagaMiddleware);

  const enhancers = compose(..._.compact([sagaEnhancer, reactorEnhancer]));

  const persistedReducer = persistReducer(persistConfig, combinedReducer);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store = createStore(persistedReducer, initialState, enhancers as any);

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return { persistor, store };
};
