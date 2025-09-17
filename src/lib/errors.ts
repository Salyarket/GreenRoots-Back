
export class HttpClientError extends Error {
    status: number;
    name: string;
  
    constructor(message: string, { status }: { status: number }) {
      super(message);
      this.name = this.constructor.name;
      this.status = status;
      Error.captureStackTrace?.(this, this.constructor); //méthode qui crée et personnalise la stack trace d’une erreur
    }
  }
  export class BadRequestError extends HttpClientError {
    constructor(message: string = "Bad Request") {
      super(message, { status: 400 });
    }
  }
  
  export class UnauthorizedError extends HttpClientError {
    constructor(message: string = "Unauthorized") {
      super(message, { status: 401 });
    }
  }
  
  export class ForbiddenError extends HttpClientError {
    constructor(message: string = "Forbidden") {
      super(message, { status: 403 });
    }
  }
  
  export class NotFoundError extends HttpClientError {
    constructor(message: string = "Not Found") {
      super(message, { status: 404 });
    }
  }
  
  export class ConflictError extends HttpClientError {
    constructor(message: string = "Conflict") {
      super(message, { status: 409 });
    }
  }
  