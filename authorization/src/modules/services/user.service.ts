import Token from 'database/models/final/token.model';
import User from 'database/models/final/user.model';
import { AuthInfoDto } from 'modules/dto/auth-info.dto';
import { UserPatchDto } from 'modules/dto/user-patch.dto';
import { throwError } from 'utils/http-exception';

export default class UserService {
  static async getUser(userId: string) {
    const user = await User.findByPk(userId, { attributes: ['id', 'mail', 'firstName', 'lastName', 'description'] });
    return user;
  }

  static async patchUser(dto: UserPatchDto) {
    let user = await User.findByPk(dto.id);

    if (!user) {
      throwError({
        statusCode: 404,
        message: 'Not Found',
      });
    }

    await user.update({ ...dto });

    return user;
  }

  static async deleteUser(userId: string) {
    const user = await User.findByPk(userId);

    if (!user) {
      throwError({
        statusCode: 404,
        message: 'Not found',
      });
    }

    const tokens = await Token.findAll({
      where: {
        userId: userId,
      },
    });

    await tokens.forEach(token => token.destroy());
    await user.destroy();
    return 'Ваш профиль удален';
  }
}
