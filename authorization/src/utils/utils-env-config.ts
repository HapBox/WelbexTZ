import { plainToClass } from 'class-transformer';
import { ENVTypes } from './constants';

class ProcessENV {
  public CUSTOM_ENV: ENVTypes = ENVTypes.DEV;

  //Порты для запуска самого сервера
  public PORT: number = 3000;

  //URL
  public URL: string = '';

  public SECRET_STRING: string = '';
  public KAFKA_BOOTSTRAP_SERVER: string = '';
  public KAFKA_TOPIC: string = '';

  //Всё что касается основной БД
  public DB_URL: string = 'postgres';
  public DB_PORT: number = 5432;
  public DB_NAME: string = 'authorization_db';
  public DB_USERNAME: string = 'postgres';
  public DB_PASSWORD: string = 'postgres';
}

export default class UtilsENVConfig {
  private static processENV: ProcessENV | null = null;

  static getProcessEnv(): ProcessENV {
    if (this.processENV === null) {
      this.processENV = plainToClass(ProcessENV, process.env);
    }
    return this.processENV;
  }

  static isAvailable(...availableTypes: ENVTypes[]): boolean {
    return availableTypes.includes(this.getProcessEnv().CUSTOM_ENV);
  }
}
