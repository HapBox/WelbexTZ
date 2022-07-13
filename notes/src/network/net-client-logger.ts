import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Log from 'utils/utils-log';


export function logAxiosErrorInterceptor(error: any) {
  console.log('AXIOS LOG ERROR', error);
  return Promise.reject(error);
}

export function logRequestInterceptor(config: AxiosRequestConfig<any>) {
  console.log('AXIOS LOG REQUEST');
  const defaultHeaders = ['common', 'delete', 'get', 'head', 'post', 'put', 'patch'];
  const method = config.method?.toUpperCase();
  const headers: Record<string, any> = {};

  let logData = '\n' + Log.makeDate() + ' | ' + '---> ' + method + ' | ' + config.url;

  for (const key in config.headers) {
    if (!defaultHeaders.includes(key)) {
      headers[key] = config.headers[key];
      
    }
  }

  logData += '\n' + 'HEADERS: ' + JSON.stringify(headers, null, 2);
  logData += '\n' + 'QUERY: ' + JSON.stringify(config.params, null, 2);

  if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
    logData += '\n' + 'BODY: ' + JSON.stringify(config.data, null, 2);
  }
  logData += '\n' + '---> END ' + method;
  console.log(logData);

  return config;
}

export function logResponseInterceptor(response: AxiosResponse<any>) {
  console.log('AXIOS LOG RESPONSE');
  const method = response.config.method?.toUpperCase();

  let logData = '\n' + Log.makeDate() + ' | ' + '<--- ' + response.status + ' ' + method + ' | ' + response.config.url;
  logData += '\n' + 'HEADERS: ' + JSON.stringify(response.headers, null, 2);

  logData += '\n' + 'BODY: ' + JSON.stringify(response.data, null, 2);

  logData += '\n' + '<--- END HTTP';
  console.log(logData);

  return response;
}
