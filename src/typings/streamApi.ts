import { StreamApiModel } from 'modules/HTTPStream';

export type StreamApiPostMessageData = {
  model?: StreamApiModel;
  prompt: string;
};

export type StreamApiDataChunk = {
  id: string;
  object: string;
  created: number;
  choices: {
    text: string;
    index: number;
    logprobs: string[] | null;
    finish_reason: string | null;
  }[];
  model: StreamApiModel;
};
