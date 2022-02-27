import {
  Method,
  AxiosRequestConfig,
  AxiosResponse,
  PromiseChain,
} from "../type/types";
import { xhrAdapter } from "../adapter/xhrAdapter";
import { mergeConfig } from "./mergeConfig";
import { InterceptorManager } from "./interceptorManager";

class Axios {
  defaultConfig: AxiosRequestConfig;
  interceptors: {
    requests: InterceptorManager;
    response: InterceptorManager;
  };

  constructor(config: AxiosRequestConfig) {
    this.defaultConfig = config;
    this.interceptors = {
      requests: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }

  request(
    url: string | AxiosRequestConfig,
    config?: any
  ): Promise<AxiosResponse> {
    if (typeof url == "string") {
      config = config || {};
      config.url = url;
    } else {
      config = url;
    }

    config = mergeConfig(this.defaultConfig, config);
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaultConfig.method) {
      config.method = this.defaultConfig.method.toLowerCase();
    } else {
      config.method = "get";
    }

    const chains: PromiseChain<any>[] = [];
    chains.push({
      resolved: xhrAdapter,
      rejected: undefined,
    });

    this.interceptors.requests.forEach((interceptor) => {
      if (interceptor) {
        chains.unshift({
          resolved: interceptor.resolved,
          rejected: interceptor.rejected,
        });
      }
    });

    this.interceptors.response.forEach((interceptor) => {
      if (interceptor) {
        chains.push({
          resolved: interceptor.resolved,
          rejected: interceptor.rejected,
        });
      }
    });

    let promise = Promise.resolve(config);
    while (chains.length > 0) {
      promise.then(chains[0].resolved, chains[0].rejected);
      chains.shift();
    }

    return promise;
  }

  get(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.requestMethodNoData("get", url, config);
  }

  delete(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.requestMethodNoData("delete", url, config);
  }

  head(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.requestMethodNoData("head", url, config);
  }

  options(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.requestMethodNoData("options", url, config);
  }

  post(
    url: string,
    data: any,
    config: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return this.requestMethodWithData("post", url, data, config);
  }

  patch(
    url: string,
    data: any,
    config: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return this.requestMethodWithData("patch", url, data, config);
  }

  put(
    url: string,
    data: any,
    config: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return this.requestMethodWithData("put", url, data, config);
  }

  private requestMethodNoData(
    method: Method,
    url: string | AxiosRequestConfig,
    config: any
  ): Promise<AxiosResponse> {
    return this.request(
      Object.assign(config, {
        url: url,
        method: method,
      })
    );
  }

  private requestMethodWithData(
    method: Method,
    url: string | AxiosRequestConfig,
    data: any,
    config: any
  ): Promise<AxiosResponse> {
    return this.request(
      Object.assign(config, {
        url: url,
        method: method,
        data: data,
      })
    );
  }
}
