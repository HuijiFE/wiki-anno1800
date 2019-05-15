/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Basic<T = any> {
  key?: string | number;
  label: string;
  icon: string;
  link: string;
  data?: T;
}

export interface Group<T = Basic> {
  key?: string | number;
  label: string;
  icon?: string;
  items: T[];
}
