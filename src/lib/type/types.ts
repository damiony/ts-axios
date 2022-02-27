export type Method =
  | "get"
  | "GET"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "delete"
  | "DELETE"
  | "patch"
  | "PATCH"
  | "options"
  | "OPTIONS"
  | "head"
  | "HEAD";

export interface AxiosRequestConfig {
  url?: string;
  method?: Method;
  baseUrl?: string;
  params?: any;
  data?: any;
  timeout?: number;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];

  [propName: string]: any;
}

export interface AxiosRequest extends XMLHttpRequest {}

export interface AxiosResponse {
  data: any;
  status: number;
  statusText: string;
  header: any;
  config: AxiosRequestConfig;
  request: AxiosRequest;

  [propName: string]: any;
}

export interface ResolvedFn<T> {
  (v: T): T | Promise<T>;
}

export interface RejectedFn {
  (error: any): any;
}

export interface PromiseChain<T> {
  resolved:
    | ResolvedFn<T>
    | ((config: AxiosRequestConfig) => Promise<AxiosResponse>);
  rejected?: RejectedFn;
}

export interface Interceptor<T> {
  resolved: ResolvedFn<T>;
  rejected?: RejectedFn;
}

export interface AxiosTransformer {
  (data: any, header?: any) :any
}