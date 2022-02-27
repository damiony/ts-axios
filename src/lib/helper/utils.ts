const toString = Object.prototype.toString;

export function isUndefined(value: any): value is undefined {
  return typeof value === "undefined";
}

export function isObject(value: any): value is Object {
  return typeof value === "object";
}

export function isPlainObject(obj: any): obj is Object {
  return toString.call(obj) === "[object Object]";
}

export function isArray(obj: any): obj is any[] {
  return Array.isArray(obj);
}

export function isURLSearchParams(value: any): value is URLSearchParams {
  return toString.call(value) === "[object URLSearchParams]";
}

export function isDate(value: any): value is Date {
  return toString.call(value) === "[object Date]";
}

export function merge(...objs: any[]): any {
  const result = Object.create(null);
  objs.forEach((obj) => {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        if (isPlainObject(result[key]) && isPlainObject(obj[key])) {
          result[key] = merge(result[key], obj[key]);
        } else if (isPlainObject(obj[key])) {
          result[key] = merge(obj[key]);
        } else if (isArray(obj[key])) {
          result[key] = merge(obj[key]);
        } else {
          result[key] = obj[key];
        }
      });
    }
  });
}
