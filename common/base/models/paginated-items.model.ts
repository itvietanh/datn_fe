export interface PaginatedItems<T = any> {
  items: T[];
  meta: any;
}

export interface PaginatedMeta {
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}
