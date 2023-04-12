import { NativeEventEmitter, NativeModules } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const { HTTPStreamModule } = NativeModules;

export enum EventsKeys {
  ReceivedDataChunk = 'RECEIVED_DATA_CHUNK',
  TransferDataFinished = 'TRANSFER_DATA_FINISHED',
}

export type RequestData = {
  urlString: string;
  method:
    | 'GET'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'PURGE'
    | 'LINK'
    | 'UNLINK';
  headers: Record<string, any>;
  body?: Object;
};

export type EventsNames = Record<EventsKeys, string>;

export type StreamApiModel =
  | 'gpt-3.5-turbo'
  | 'text-davinci-003'
  | 'text-davinci-002'
  | 'code-davinci-002';

export type DataChunk = {
  dataString: string;
  streamId: string;
};

export type TransactionFinishedData = {
  errorString: string;
  streamId: string;
};

const eventEmitter = new NativeEventEmitter(HTTPStreamModule);

const prepareSendRequest =
  (streamId: string) =>
  ({ body, headers, method, urlString }: RequestData): void => {
    HTTPStreamModule.request(streamId, urlString, method, headers, body);
  };

const createHTTPStream = () => {
  const streamId = uuidv4();

  const eventsNames: EventsNames = HTTPStreamModule.getConstants();

  return {
    eventEmitter,
    eventsNames,
    sendRequest: prepareSendRequest(streamId),
    streamId,
  };
};

export default {
  createHTTPStream,
};
