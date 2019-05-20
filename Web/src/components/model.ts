/* eslint-disable @typescript-eslint/no-explicit-any */

export interface BaseModel<TData = any> {
  key?: string | number;
  label: string;
  description?: string;
  icon?: string;
  data?: TData;
}

export interface Basic<TData = any> extends BaseModel<TData> {
  link: string;
}

export interface Group<TItem = Basic, TData = any> extends BaseModel<TData> {
  items: TItem[];
}
