export interface TableQueryParams {
  page?: number;
  size?: number;
  sort?: {
    key: string;
    value: 'ascend' | 'descend' | null;
  };
  filter?: { [key: string]: any };
}