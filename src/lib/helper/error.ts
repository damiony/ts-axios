import { AxiosRequest, AxiosResponse, AxiosRequestConfig } from "../type/types";

export class AxiosError extends Error {
  config: AxiosRequestConfig;
  code: string;
  request?: AxiosRequest;
  response?: AxiosResponse;
  isAxiosError: boolean;

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code: string,
    request?: AxiosRequest,
    response?: AxiosResponse
  ) {
    super(message);
    this.config = config;
    this.code = code;
    this.request = request;
    this.response = response;
    this.isAxiosError = true;
  }
}

export function createError(
  message: string,
  config: AxiosRequestConfig,
  code: string,
  request?: AxiosRequest,
  response?: AxiosResponse
): AxiosError {
  return new AxiosError(message, config, code, request, response);
}
