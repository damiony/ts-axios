import { AxiosRequestConfig, AxiosResponse } from "../type/types";
import { createError } from "../helper/error";

export const xhrAdapter = function (
  config: AxiosRequestConfig
): Promise<AxiosResponse> {
  const { url, method, data, timeout } = config;

  return new Promise<AxiosResponse>((resolve, reject) => {
    let xhr: any = new XMLHttpRequest();

    xhr.open(method!, url!, true);

    xhr.timeout = timeout || 0;

    xhr.send(data);

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          data: xhr.response,
          status: xhr.status,
          statusText: xhr.statusText,
          header: xhr.getAllResponseHeaders(),
          config: config,
          request: xhr,
        });
      } else {
        reject(createError("request error", config, "ECONNABORIED", xhr));
      }
    };

    xhr.onerror = () => {
      reject(createError("Network Error", config, "ECONNABORTED", xhr));
      xhr = null;
    };

    xhr.ontimeout = () => {
      if (!xhr) {
        return;
      }
      reject(createError(
        "timeout of " + config.timeout + "ms exceeded",
        config,
        "TIMEOUT",
        xhr
      ));
      xhr = null;
    };
  });
};
