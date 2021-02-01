export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// api error bad request 400
export class BadRequestError extends APIError {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

// api error unauthorized 401
export class UnauthorizedError extends APIError {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// api error forbidden 403
export class ForbiddenError extends APIError {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// api error not found 404
export class NotFoundError extends APIError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// api error user unauthorized 419
export class UserUnauthorizedError extends APIError {
  constructor(message: string) {
    super(message);
    this.name = 'UserUnauthorizedError';
  }
}

// api error invalid param 422
export class InvalidParametersError extends APIError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidParametersError';
  }
}

// all internal server errors
export class InternalServerError extends APIError {
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
  }
}

// impersonation command failed
export class ImpersonationFailed extends APIError {
  constructor(message: string) {
    super(message);
    this.name = 'ImpersonationFailed';
  }
}
