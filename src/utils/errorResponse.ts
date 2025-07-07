export class errorResponse<T> extends Error {
    statusCode: number;
    details?: T;
  
    constructor(message: string, statusCode = 500, details?: T) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
    }
  }
  