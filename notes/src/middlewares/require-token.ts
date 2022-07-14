import { NextFunction, Response } from 'express';
import BaseRequest from '../modules/base/base.request';
import { Constants } from '../utils/constants';
import { throwError } from '../utils/http-exception';
import jwt from 'jsonwebtoken';
import UtilsENVConfig from 'utils/utils-env-config';

export const requireToken = async (req: BaseRequest, res: Response, next: NextFunction) => {
  const xAccessToken = req.header(Constants.HEADER_X_ACCESS_TOKEN) as string;

  if (!xAccessToken) {
    throwError({
      statusCode: 401,
      message: 'Token not send',
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(xAccessToken, UtilsENVConfig.getProcessEnv().SECRET_STRING);
  } catch (e) {
    throwError({
      statusCode: 403,
      message: 'Wrong token',
    });
  }
  
  req.userId = (<any>decoded).id;
  next();
};
