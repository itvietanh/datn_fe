import { ResponseErrorModel } from './response-error.model';

export interface ResultState {
  result: any;
  success: any;
  error: ResponseErrorModel;
  loading: boolean;
  loaded: boolean;
}
