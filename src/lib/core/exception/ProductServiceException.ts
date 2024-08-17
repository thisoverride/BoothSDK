import BaseException from './BaseException';

export default class ProductServiceException extends BaseException {
  constructor(message: string, status: number) {
    super(message,status);
  }
}
