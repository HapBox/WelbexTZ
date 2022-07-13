export interface INetResult<T = any> {
  isSuccess: boolean;
  code: number;
  message?: string;
  data?: T | undefined;
  errorData?: any;
}

export enum RequestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export class NetRequest {
  public requestType?: RequestType = RequestType.GET;
  public headers?: any = {};
  public url?: string = '';
  public params?: any = {};
  public data?: any = {};
}