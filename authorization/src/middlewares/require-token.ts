import { NextFunction, Response } from 'express';
import Token from '../database/models/final/token.model';
import User from '../database/models/final/user.model';
import BaseRequest from '../modules/base/base.request';
import { Constants } from '../utils/constants';
import { throwError } from '../utils/http-exception';

export const requireToken = async (req: BaseRequest, res: Response, next: NextFunction) => {
  const xAccessToken = req.header(Constants.HEADER_X_ACCESS_TOKEN) as string;

  if (!xAccessToken) {
    throwError({
      statusCode: 401,
      message: 'Token not send',
    });
  }
  
  const tokenDB = await Token.findOne({
    where: {
      value: xAccessToken,
    },
    include: [
      {
        model: User,
      },
    ],
  });

  if (!tokenDB) {
    throwError({
      statusCode: 401,
      message: 'Wrong token',
    });
  }

  req.xAccessToken = xAccessToken;
  req.userId = tokenDB.user.id;

  next();
};
