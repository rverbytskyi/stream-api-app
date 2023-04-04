import {NativeModules} from 'react-native';
import _ from 'lodash';

const {HTTPStreamModule} = NativeModules;

type EventsNames = {
  RECEIVED_DATA_CHUNK: string;
  TRANSFER_DATA_FINISHED: string;
};

type RequestData = {
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

const requestData = (
  streamId: string,
  {body, headers, method, urlString}: RequestData,
): void => {
  HTTPStreamModule.request(streamId, urlString, method, headers, body);
};

const createHTTPStream = async () => {
  const streamId = _.uniqueId();

  const eventsNames: EventsNames = await HTTPStreamModule.getEventsNames(
    streamId,
  );

  console.log('eventsNames', eventsNames);

  return {
    streamId,
    eventsNames,
    requestData,
  };
};

export default {
  createHTTPStream,
};
