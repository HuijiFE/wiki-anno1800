/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Item<T = any> {
  label: string;
  icon: string;
  link: string;
  data?: T;
}

export interface Group<T = Item> {
  label: string;
  icon?: string;
  items: T[];
}
