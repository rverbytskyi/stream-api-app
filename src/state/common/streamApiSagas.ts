import { NativeEventEmitter } from 'react-native';
import { call, spawn, take } from 'typed-redux-saga';
import { buffers } from 'redux-saga';
import actions from 'state/actions';
import streamApi from 'api/streamApi';
import HTTPStream, {
  DataChunk,
  EventsNames,
  TransactionFinishedData,
} from 'modules/HTTPStream';
import { eventChannel } from 'redux-saga';
import { getDataFromStreamResponseString } from 'utils';

type EventChannelData = {
  streamId: ReturnType<typeof HTTPStream.createHTTPStream>['streamId'];
  dataString?: string;
  errorString?: string;
  transferFinished?: boolean;
};

export function* streamApiSaga() {
  while (true) {
    const { payload }: ReturnType<typeof actions.streamApi.streamRequested> =
      yield take(actions.streamApi.streamRequested.type);

    const { eventEmitter, eventsNames, sendRequest, streamId } = yield* call(
      HTTPStream.createHTTPStream,
    );

    yield* spawn(
      sendDataRequest,
      payload,
      eventEmitter,
      eventsNames,
      sendRequest,
      streamId,
    );
  }
}

function* sendDataRequest(
  payload: ReturnType<typeof actions.streamApi.streamRequested>['payload'],
  eventEmitter: NativeEventEmitter,
  eventsNames: EventsNames,
  sendRequest: ReturnType<typeof HTTPStream.createHTTPStream>['sendRequest'],
  streamId: ReturnType<typeof HTTPStream.createHTTPStream>['streamId'],
) {
  const requestData = yield* call(streamApi.postMessage, payload);

  const channel = yield* call(
    createHTTPStreamEventChannel,
    eventEmitter,
    eventsNames,
    streamId,
  );

  // in order to not block saga execution send request is called without yield or yield call
  sendRequest(requestData);

  while (true) {
    const eventData = yield* take(channel);

    if (eventData?.transferFinished) {
      if (eventData?.errorString) {
        console.error(eventData.errorString);
      }

      channel.close();

      return;
    }

    const data = getDataFromStreamResponseString(eventData?.dataString || '{}');

    console.log(data);

    if (data?.choices?.[0]?.text === undefined) {
      console.log('text === undefined', eventData);
    }
  }
}

function createHTTPStreamEventChannel(
  emitter: NativeEventEmitter,
  eventsNames: EventsNames,
  streamId: ReturnType<typeof HTTPStream.createHTTPStream>['streamId'],
) {
  return eventChannel<EventChannelData>(emit => {
    const onReceivedDataChunk = (data: DataChunk) => {
      if (!emit) {
        return;
      }

      if (data.streamId === streamId) {
        emit(data);
      }
    };

    const onTransferDataFinished = (data: TransactionFinishedData) => {
      if (!emit) {
        return;
      }

      if (data.streamId === streamId) {
        emit({
          errorString: data.errorString,
          streamId: data.streamId,
          transferFinished: true,
        });
      }
    };

    const onReceivedDataChunkSubscription = emitter.addListener(
      eventsNames.RECEIVED_DATA_CHUNK,
      onReceivedDataChunk,
    );

    const onTransferDataFinishedSubscription = emitter.addListener(
      eventsNames.TRANSFER_DATA_FINISHED,
      onTransferDataFinished,
    );

    return () => {
      onReceivedDataChunkSubscription.remove();

      onTransferDataFinishedSubscription.remove();
    };
  }, buffers.expanding(10));
}
