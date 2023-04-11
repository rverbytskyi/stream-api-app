import sagaPlugin from 'reactotron-redux-saga';
import { NativeModules } from 'react-native';
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import ReactotronFlipper from 'reactotron-react-native/dist/flipper';

export const initReactotron = () => {
  const scriptURL: string = NativeModules.SourceCode.scriptURL;

  const scriptHostname = scriptURL.split('://')[1].split(':')[0];

  Reactotron.configure({
    createSocket: path => new ReactotronFlipper(path),
    host: scriptHostname,
  })
    .useReactNative?.()
    .use?.(reactotronRedux())
    .use?.(sagaPlugin({}))
    .connect?.()
    .clear?.();

  return Reactotron;
};
