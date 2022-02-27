import * as utils from "./utils";

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}

export function transformURL(
  url: string,
  baseURL: string,
  params: any,
  paramsSerializer: any
): string {
  if (baseURL && !isAbsoluteURL(url)) {
    url = combineURL(url, baseURL);
  }
  return buildURL(url, params, paramsSerializer);
}

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

export function combineURL(url: string, baseURL: string): string {
  return url
    ? baseURL.replace(/\/+$/, "") + "/" + url.replace(/^\/+/, "")
    : baseURL;
}

export function buildURL(
  url: string,
  params: any,
  paramsSerializer: any
): string {
  if (!params) {
    return url;
  }

  let serializedParams: string;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    const parts: Array<any> = [];
    function fn(val: any, key: string): void {
      if (val === null || val === undefined) {
        return;
      }
      if (utils.isArray(val)) {
        key += "[]";
      } else {
        val = [val];
      }

      val.forEach((v: any) => {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + "=" + encode(v));
      });
    }

    if (utils.isArray(params)) {
      params.forEach((val, key) => {
        fn(val, String(key));
      });
    } else if (utils.isPlainObject(params)) {
      for (const key in params) {
        fn(params[key], key);
      }
    }

    serializedParams = parts.join("&");
  }

  return serializedParams;
}
