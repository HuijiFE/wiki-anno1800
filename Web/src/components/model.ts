export interface Item {
  label: string;
  icon: string;
  link: string;
}

export interface Group {
  label: string;
  icon?: string;
  items: Item[];
}
