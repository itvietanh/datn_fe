
export class ResponseModel<T = PagedListModel> {
  data?: T;
  errors?: any;
  code?: string;
}

export interface PagingModel {
  page?: number;
  size?: number;
  total?: number;
  orderBy?: string;
  hasNextPage?: boolean;
}

export interface PagedListModel<T = any> {
  items: T[] | [];
  meta: PagingModel;
}

export interface PagedListTreeModel<T = any> extends PagedListModel {
  parents: T[] | [];
}


export interface ErrorModel {
  key: string;
  value: any;
}
