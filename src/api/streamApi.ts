import { RequestData } from 'modules/HTTPStream';
import { StreamApiPostMessageData } from 'typings';

const HEADERS = {
  Authorization: 'Bearer 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',
  'Content-Type': 'application/json',
};

export default {
  postMessage: ({ prompt, model }: StreamApiPostMessageData): RequestData => ({
    body: {
      max_tokens: 16,
      model: model || 'text-davinci-003',
      prompt,
      stream: true,
      temperature: 1,
    },
    headers: HEADERS,
    method: 'POST',
    urlString: 'https://api.openai.com/v1/completions',
  }),
};
