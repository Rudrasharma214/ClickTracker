import { STATUS } from '../constants/statusCodes.js';

export default class AppError extends Error {
    constructor(message, statusCode = STATUS.INTERNAL_ERROR) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}