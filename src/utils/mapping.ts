import { DataChunk } from 'modules/HTTPStream';
import { DeepPartial, StreamApiDataChunk } from 'typings';

const EMPTY_OBJ = {};

export const getDataFromStreamResponseString = (
  dataString: DataChunk['dataString'],
): StreamApiDataChunk | DeepPartial<StreamApiDataChunk> => {
  try {
    const jsonString = dataString.replace(/^data:/g, '');

    if (jsonString.trim() === '[DONE]') {
      return EMPTY_OBJ;
    }

    return JSON.parse(jsonString);
  } catch (e) {
    return EMPTY_OBJ;
  }
};
