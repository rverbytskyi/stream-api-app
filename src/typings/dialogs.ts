export type MessageId = string;

export type DialogHistoryItem = {
  messageId: MessageId;
  time: string;
};

export type Message = {
  role: 'user' | 'system';
  content: string;
};

export type ChatName = string;

export type Dialog = {
  chatName: ChatName;
  messages: Record<MessageId, Message>;
  history: Array<DialogHistoryItem>;
};
