/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Item<T = any> {
  key?: string | number;
  label: string;
  icon: string;
  link: string;
  data?: T;
}

export interface Group<T = Item> {
  key?: string | number;
  label: string;
  icon?: string;
  items: T[];
}
