export interface Option<T> {
  map<R>(cb: (v:T) => R): Option<R>
  isEmpty(): boolean
  isDefined(): boolean
  get(): T
  getOr(cb:()=>T): T
}

export function optionOf<T>(v?:T): Option<T> {
  if(v === null || v === undefined) {
    return new None<T>();
  }
  return new Some<T>(v);
}

export function some<T>(v:T): Option<T> {
  return new Some(v);
}
export function empty<T>(): Option<T> {
  return new None();
}

export class Some<T> implements Option<T> {
  public value: T;
  constructor(value: T) {
    this.value = value;
  }
  map<R>(cb: (v:T) => R): Option<R> {
    return optionOf(cb(this.value));
  }
  isEmpty(): boolean {
    return false;
  }
  isDefined(): boolean {
    return true;
  }
  get(): T {
    return this.value;
  }
  getOr(cb:()=>T): T {
    return this.value;
  }
}

export class None<T> implements Option<T> {
  map<R>(cb: (v:T) => R): Option<R> {
    return empty<R>()
  }
  isEmpty(): boolean {
    return true;
  }
  isDefined(): boolean {
    return false;
  }
  get(): T {
    throw new Error("value is none");
  }
  getOr(cb:()=>T): T {
    return cb();
  }
}