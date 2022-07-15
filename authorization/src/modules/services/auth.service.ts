import User from 'database/models/final/user.model';
import { AuthInfoDto } from 'modules/dto/auth-info.dto';
import { throwError } from 'utils/http-exception';
import UtilsENVConfig from 'utils/utils-env-config';
import  jwt  from 'jsonwebtoken'
import  kafka  from 'kafka-node';

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

    const client = new kafka.KafkaClient({kafkaHost: UtilsENVConfig.getProcessEnv().KAFKA_BOOTSTRAP_SERVER})
    const producer = new kafka.Producer(client);
    producer.send([{topic: UtilsENVConfig.getProcessEnv().KAFKA_TOPIC, messages: dto.mail}], (err, data) => {
      if(err) console.log(err);
      else  console.log(data);
    })

    user = await User.create({ ...dto });
    const token = jwt.sign({ id: user.id }, UtilsENVConfig.getProcessEnv().SECRET_STRING);
    return token;
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

    const token = jwt.sign({ id: user.id }, UtilsENVConfig.getProcessEnv().SECRET_STRING);
    return token;
  }
}
