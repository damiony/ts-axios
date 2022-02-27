import { Interceptor, ResolvedFn, RejectedFn } from "../type/types";

export class InterceptorManager {
  private handlers: Array<Interceptor<any> | null>;

  constructor() {
    this.handlers = [];
  }

  use(resolved: ResolvedFn<any>, rejected: RejectedFn): number {
    this.handlers.push({
      resolved,
      rejected,
    });
    return this.handlers.length - 1;
  }

  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  forEach(fn: (h: Interceptor<any> | null) => void):void {
      this.handlers.forEach(h => fn(h));
  }
}
