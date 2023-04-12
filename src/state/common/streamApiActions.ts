import { createAction } from '@reduxjs/toolkit';
import { StreamApiPostMessageData } from 'typings';

const streamRequested = createAction<StreamApiPostMessageData>(
  'streamApi/streamRequested',
);

const streamSucceeded = createAction('streamApi/streamSucceeded');

const streamDataChunkReceived = createAction<string>(
  'streamApi/streamDataChunkReceived',
);

export default {
  streamDataChunkReceived,
  streamRequested,
  streamSucceeded,
};
