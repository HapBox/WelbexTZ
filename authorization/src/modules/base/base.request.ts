import { Request } from 'express';

export default interface BaseRequest extends Request {
  value: string;
  userId: string;
  xAccessToken: string;
}
