import { createAction } from '@reduxjs/toolkit';
import { RequestData } from 'modules/HTTPStream';

const streamRequested = createAction<RequestData>('streamApi/streamRequested');

const streamSucceeded = createAction('streamApi/streamSucceeded');

export default {
  streamRequested,
  streamSucceeded,
};
