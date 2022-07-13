import { ApiController, DELETE, GET, PATCH } from 'core/api-decorators';
import { NextFunction, Response } from 'express';
import { requireToken } from 'middlewares/require-token';
import { dtoValidator } from 'middlewares/validate';
import BaseRequest from 'modules/base/base.request';
import { UserPatchDto } from 'modules/dto/user-patch.dto';
import UserService from 'modules/services/user.service';
import SwaggerUtils from 'swagger/swagger-utils';
import UserModels from 'swagger/user-models';

@ApiController('/users')
class Controller {
  @GET('/me', {
    handlers: [requireToken],
    responses: [SwaggerUtils.body200(UserModels.resUserInfo)],
  })
  async getUser(req: BaseRequest, res: Response, next: NextFunction) {
    const token = await UserService.getUser(req.userId);
    res.json(token);
  }

  @PATCH('/me', {
    handlers: [requireToken, dtoValidator(UserPatchDto)],
    body: UserModels.reqUserInfo,
    responses: [SwaggerUtils.body200(UserModels.resUserInfo)],
  })
  async updateUser(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: UserPatchDto = {...req.body, id: req.userId};
    const token = await UserService.patchUser(dto);
    res.json(token);
  }

  @DELETE('/me', {
    handlers: [requireToken],
  })
  async deleteUser(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: UserPatchDto = req.body;
    const token = await UserService.deleteUser(req.userId);
    res.json(token);
  }
}

export default new Controller();
