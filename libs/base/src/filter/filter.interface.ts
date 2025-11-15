export type IFilter<T extends Record<string, any>> =
  | {
      [P in keyof T]?: T[P] | IFilter<T[P]>;
    }
  | {
      [P in keyof T]?: T[P] | IFilter<T[P]>;
    }[];

export interface IOtherOptions {
  selects?: string[];
  relations?: string[];
}
