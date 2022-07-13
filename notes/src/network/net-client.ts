import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logAxiosErrorInterceptor, logRequestInterceptor, logResponseInterceptor } from './net-client-logger';
import { INetResult, NetRequest, RequestType } from './net-client-types';
import { handleAxiosError, handleAxiosSuccess } from './net-client-utils';

//Класс обертка над axios
export class NetClient {
  // TODO : add type Headers
  private targetHost: string = '';
  private axiosInstance: AxiosInstance = axios.create();
  private requestLogNumber: number = -1; //Идентификатор для логирования ЗАПРОСА
  private responseLogNumber: number = -1; //Идентификатор для логирования ОТВЕТА
  private onRequestError?: (err: any) => Promise<boolean>;

  //Работа с логированием
  enableLogs() {
    //Логирование - ЗАПРОСА
    this.requestLogNumber = this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig<any>) => logRequestInterceptor(config),
      (error) => logAxiosErrorInterceptor(error)
    );

    //Логирование - ОТВЕТА
    this.responseLogNumber = this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<any>) => logResponseInterceptor(response),
      (error) => logAxiosErrorInterceptor(error)
    );
    return this;
  }

  disableLogs() {
    if (this.requestLogNumber !== -1) {
      this.axiosInstance.interceptors.request.eject(this.requestLogNumber);
    }

    if (this.responseLogNumber !== -1) {
      this.axiosInstance.interceptors.response.eject(this.responseLogNumber);
    }
    return this;
  }

  addRequestInterceptor(
    onConfig?: (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any> | Promise<AxiosRequestConfig<any>>,
    onError?: (error: any) => any
  ) {
    this.axiosInstance.interceptors.request.use(onConfig, onError);
    return this;
  }

  addResponseInterceptor(
    onResponse: (response: AxiosResponse<any>) => AxiosResponse<any> | Promise<AxiosResponse<any>>,
    onError: (error: any) => any
  ) {
    this.axiosInstance.interceptors.response.use(onResponse, onError);
    return this;
  }

  setHost(host: string) {
    this.targetHost = host;
    return this;
  }

  setOnRequestError(onRequesError: (error: any) => Promise<boolean>) {
    this.onRequestError = onRequesError;
    return this;
  }

  async get<T = any>(request: NetRequest = new NetRequest()) {
    request.requestType = RequestType.GET;
    return await this.makeRequest<T>(request);
  }

  async post<T = any>(request: NetRequest = new NetRequest()) {
    request.requestType = RequestType.POST;
    return await this.makeRequest<T>(request);
  }

  async put<T = any>(request: NetRequest = new NetRequest()) {
    request.requestType = RequestType.PUT;
    return await this.makeRequest<T>(request);
  }

  async patch<T = any>(request: NetRequest = new NetRequest()) {
    request.requestType = RequestType.PATCH;
    return await this.makeRequest<T>(request);
  }

  async delete<T = any>(request: NetRequest = new NetRequest()) {
    request.requestType = RequestType.DELETE;
    return await this.makeRequest<T>(request);
  }

  // async makeRequest<T = any>(requestPromise: Promise<AxiosResponse<T, any>>) {
  async makeRequest<T = any>(request: NetRequest): Promise<INetResult<T>> {
    try {
      let requestPromise;
      switch (request.requestType) {
        case RequestType.POST:
          requestPromise = this.axiosInstance.post<T>(`${this.targetHost}${request.url}`, request.data, {
            params: request.params,
            headers: request.headers,
          });
          break;
        case RequestType.PUT:
          requestPromise = this.axiosInstance.put<T>(`${this.targetHost}${request.url}`, request.data, {
            params: request.params,
            headers: request.headers,
          });
          break;
        case RequestType.PATCH:
          requestPromise = this.axiosInstance.patch<T>(`${this.targetHost}${request.url}`, request.data, {
            params: request.params,
            headers: request.headers,
          });
          break;
        case RequestType.DELETE:
          requestPromise = this.axiosInstance.delete<T>(`${this.targetHost}${request.url}`, {
            params: request.params,
            headers: request.headers,
          });
          break;

        //default is GET
        default:
          requestPromise = this.axiosInstance.get<T>(`${this.targetHost}${request.url}`, {
            params: request.params,
            headers: request.headers,
          });
          break;
      }

      const response = await requestPromise;
      return handleAxiosSuccess<T>(response);
    } catch (error: any) {
      console.log('ERR = ', error);
      if (this.onRequestError) {
        const needToRepeatRequest = await this.onRequestError(error)
          .then((val) => val)
          .catch((_) => false);

        if (needToRepeatRequest) {
          return await this.makeRequest(request);
        }
      }

      return handleAxiosError<T>(error);
    }
  }
}