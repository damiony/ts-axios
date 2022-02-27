import { AxiosTransformer } from "../type/types";
import * as utils from "../helper/utils";

export function transformData(
  data: any,
  header: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (utils.isUndefined(fns)) {
    return data;
  }
  if (!utils.isArray(fns)) {
    fns = [fns];
  }
  fns.forEach((fn) => {
    data = fn(data, header);
  });

  return data;
}
