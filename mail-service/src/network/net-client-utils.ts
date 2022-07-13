import { AxiosResponse } from 'axios';
import { INetResult } from './net-client-types';

//Дефолтные заголовки для отправки файлов на сервер
export const MEDIA_HEADERS = {
  'Content-Type': 'multipart/form-data',
};

export function handleAxiosSuccess<T = any>(response: AxiosResponse<T, any>): INetResult<T> {
  console.log('NetClient: handleSuccess = ', response.data);
  return {
    isSuccess: true,
    code: response.status,
    data: response.data,
  };
}

//обработчик ошибок
export function handleAxiosError<T = any>(err: any): INetResult<T> {
  console.log('NetClient: handleError = ', err.response);

  const result: INetResult<T> = {
    isSuccess: false,
    code: 500,
    message: 'Произошла неизвестная ошибка',
    errorData: null,
  };

  //Если там в ошибке нихрена нет -> сразу отдаем данные об этом
  if (err.response) {
    //Достаем код
    if (typeof err.response.status === 'number') {
      result.code = err.response.status;
    }
    //Достаем сообщение + данные
    if (err.response.data) {
      //Если в ошибке есть сообщение
      if (typeof err.response.data.message === 'string') {
        result.message = err.response.data.message;
      }

      //Если в ошибке есть errorData
      if (err.response.data.errorData) {
        result.errorData = err.response.data.errorData;
      }
    }
  }

  return result;
}
