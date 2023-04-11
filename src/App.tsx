import React, { memo } from 'react';
import { Provider } from 'react-redux';
import { configStore } from 'state/store';
import { PersistGate } from 'redux-persist/integration/react';
import { MainScreen } from 'containers/MainFlow';

const { store, persistor } = configStore();

const App = memo(() => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <MainScreen />
    </PersistGate>
  </Provider>
));

App.displayName = 'App';

export default App;
