import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatName, Dialog, Message, MessageId } from 'typings';

export type DialogsState = Dialog;

const INITIAL_DIALOGS_STATE: DialogsState = {
  chatName: '',
  history: [],
  messages: {},
};

const dialogsSlice = createSlice({
  initialState: INITIAL_DIALOGS_STATE,
  name: 'dialogsSlice',
  reducers: {
    completeMessage: (
      state,
      {
        payload,
      }: PayloadAction<{
        messageId: MessageId;
        content: Message['content'];
      }>,
    ) => {
      const { content, messageId } = payload;

      const currMessageContent = state.messages[messageId].content ?? '';

      state.messages[messageId] = {
        ...state.messages[messageId],
        content: currMessageContent.concat(content),
      };
    },
    startDialog: (
      state,
      {
        payload,
      }: PayloadAction<{
        chatName: ChatName;
        messageId: MessageId;
        message: Message;
        time: string;
      }>,
    ) => {
      const { chatName, messageId, message, time } = payload;

      state.chatName = chatName;

      state.history = [{ messageId, time }, ...state.history];

      state.messages[messageId] = message;
    },
  },
});

export const dialogsActions = dialogsSlice.actions;

export default dialogsSlice;
