export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(msg: string, code = "BAD_REQUEST") {
    return new ApiError(400, msg, code);
  }
  static unauthorized(msg = "Unauthorized", code = "UNAUTHORIZED") {
    return new ApiError(401, msg, code);
  }
  static forbidden(msg = "Forbidden", code = "FORBIDDEN") {
    return new ApiError(403, msg, code);
  }
  static notFound(msg = "Not found", code = "NOT_FOUND") {
    return new ApiError(404, msg, code);
  }
  static conflict(msg: string, code = "CONFLICT") {
    return new ApiError(409, msg, code);
  }
}
