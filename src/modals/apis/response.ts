export interface IResponse {
  isSuccess: boolean;
  errorCode: number;
  message: string;
  data: any;
  messageCode: string;
}

export interface IResponseData<T> {
  isSuccess: boolean;
  errorCode: number;
  message: string;
  messageCode: string;
  data: T | null;
}

// class ResponseModel implements IResponse {
//   isSuccess = false;
//   errorCode = 0;
//   message = '';
//   data = null;
//   messageCode = '';
// }