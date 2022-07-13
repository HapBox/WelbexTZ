import Token from 'database/models/final/token.model';
import User from 'database/models/final/user.model';
import { AuthInfoDto } from 'modules/dto/auth-info.dto';
import { throwError } from 'utils/http-exception';

export default class AuthService {
  static async registration(dto: AuthInfoDto) {
    let user = await User.findOne({
      where: {
        mail: dto.mail,
      },
    });

    if (user) {
      throwError({
        statusCode: 409,
        message: 'Пользователь с таким email уже зарегистрирован',
      });
    }

    user = await User.create({ ...dto });
    let token = await Token.create({
      userId: user.id,
    });

    return token.value;
  }

  static async login(dto: AuthInfoDto) {
    let user = await User.findOne({
      where: {
        mail: dto.mail,
        password: dto.password,
      },
    });

    if (!user) {
      throwError({
        statusCode: 401,
        message: 'Неверный логин или пароль',
      });
    }

    let token = await Token.create({
      userId: user.id,
    });

    return token.value
  }
}
