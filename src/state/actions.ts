import dialogsSlice from 'state/dialogs/dialogsSlice';
import streamApiActions from 'state/common/streamApiActions';

export default {
  dialogs: dialogsSlice.actions,
  streamApi: streamApiActions,
};
