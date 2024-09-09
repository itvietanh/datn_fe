import { ResponseErrorModel } from './response-error.model';

export interface ResponseModel<T = any> {
  error: ResponseErrorModel;
  data: T;
}
