import { xhrAdapter } from "../adapter/xhrAdapter";
import { AxiosRequestConfig, AxiosResponse } from "../type/types";
import { transformData } from "./transformData";
import { transformURL } from "../helper/url";
import * as utils from "../helper/utils";

export function throwIfCancellationRequested(
  config: AxiosRequestConfig
): void {}

export function throwIfdispatchRequest(
  config: AxiosRequestConfig
): Promise<AxiosResponse> {
  config.header = config.header || {};
  config.url = transformURL(
    config.url!,
    config.baseUrl!,
    config.params,
    config.paramsSerializer
  );
  config.data = transformData(
    config.data,
    config.header,
    config.transformRequest
  );
  config.header = utils.merge(
    config.header.common || {},
    config.header[config.method!] || {},
    config.header
  );

  [
    "get",
    "delete",
    "put",
    "post",
    "patch",
    "options",
    "head",
    "common",
  ].forEach((method) => {
    delete config.header[method];
  });

  return xhrAdapter(config).then(
    response => {
      throwIfCancellationRequested(config);
      response.data = transformData(
        response.data,
        response.header,
        response.transformResponse
      );
      return response;
    },
    (error) => {
        return Promise.reject(error);
    }
  );
}
