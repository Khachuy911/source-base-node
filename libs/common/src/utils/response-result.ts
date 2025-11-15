export class ResponseResult<T> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
  requestDate: Date;

  constructor({
    statusCode = 200,
    message = 'Success',
    data,
    success = true,
    requestDate = new Date(),
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
    this.requestDate = requestDate;
  }

  static success<T>(data: T = {} as any, message = 'Success') {
    if (data === null) data = undefined;

    return new ResponseResult<T>({
      data,
      message,
    });
  }

  static tempSuccess(data?: any) {
    const message =
      'Request to device successfully.Please wait for a response from the device via the socket.';

    return new ResponseResult({
      data,
      message,
    });
  }

  static error(message = 'Error', statusCode = 400) {
    return new ResponseResult({
      statusCode,
      message,
      data: {},
      success: false,
      requestDate: new Date(),
    });
  }
}
