export interface IMessagesResponse {
  content: IContent[];
  totalElements: number;
  pageNo?: number;
  pageSize?: number;
  totalPages?: number;
  last?: boolean;
}

export interface IContent {
  id?: string;
  requestmessage: string;
  responsemessage: IResponseMessage[];
  date: string;
}

export interface ISendMessageResponse {
  message: string;
  data: IData;
}

export interface IData {
  id: string;
  conversationname: string;
  responsemessage: IResponseMessage[];
  date: string;
}

export interface IResponseMessage {
  text: string;
}
