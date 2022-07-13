import { ApiController, POST } from 'core/api-decorators';
import { NextFunction, Response } from 'express';
import { dtoValidator } from 'middlewares/validate';
import BaseRequest from 'modules/base/base.request';
import { AuthInfoDto } from 'modules/dto/auth-info.dto';
import AuthService from 'modules/services/auth.service';
import AuthModels from 'swagger/auth-models';
import SwaggerUtils from 'swagger/swagger-utils';

@ApiController('/auth')
class Controller {
  @POST('/login', {
    handlers: [dtoValidator(AuthInfoDto)],
    body: AuthModels.reqAuthInfo,
    responses: [SwaggerUtils.body200(AuthModels.resAccessToken)],
  })
  async login(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: AuthInfoDto = req.body;
    const token = await AuthService.login(dto);
    res.json(token);
  }

  @POST('/registration', {
    handlers: [dtoValidator(AuthInfoDto)],
    body: AuthModels.reqAuthInfo,
    responses: [SwaggerUtils.body200(AuthModels.resAccessToken)],
  })
  async registration(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: AuthInfoDto = req.body;
    const token = await AuthService.registration(dto);
    res.json(token);
  }
}

export default new Controller();
