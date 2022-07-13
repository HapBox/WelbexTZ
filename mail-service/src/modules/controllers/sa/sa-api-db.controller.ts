import { ApiController, GET } from 'core/api-decorators';
import { dropDB } from 'database/client';
import { NextFunction, Response } from 'express';
import BaseRequest from 'modules/base/base.request';

@ApiController('/sa/api/db')
class Controller {
  @GET('/wipe', {
    summary: 'Метод для вайпа БД(Сброс таблиц)',
  })
  async wipe(req: BaseRequest, res: Response, next: NextFunction) {
    await dropDB();
    res.json({
      message: 'test',
    });
  }
}

export default new Controller();
