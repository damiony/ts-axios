import { AxiosRequestConfig } from "../type/types";
import * as utils from "../helper/utils";

function mergeDirectKeys(val1: any, val2: any): any {
  return utils.merge(val1, val2);
}

function valueFromVal2(val1: any, val2: any): any {
  if (!utils.isUndefined(val2)) {
    return utils.merge(val2);
  }
}

function defaultToVal2(val1: any, val2: any): any {
  if (!utils.isUndefined(val2)) {
    return utils.merge(val2);
  }
  if (!utils.isUndefined(val1)) {
    return utils.merge(val1);
  }
}

const mergeMap: any = {
  url: valueFromVal2,
  method: valueFromVal2,
  data: valueFromVal2,
  baseURL: defaultToVal2,
  timeout: defaultToVal2,
};

export function mergeConfig(
  config1: AxiosRequestConfig,
  config2: AxiosRequestConfig
): AxiosRequestConfig {
  const config: any = {};
  for (let key in config2) {
    mergeField(config2[key]);
  }

  for (let key in config1) {
    if (!(key in config2)) {
      mergeField(config1[key]);
    }
  }

  function mergeField(key: string): void {
    const merge = mergeMap[key] || mergeDirectKeys;
    config[key] = merge(config1[key], config2[key]);
  }

  return config;
}
