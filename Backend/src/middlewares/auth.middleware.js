import { verifyToken } from '../utils/token.js';
import { sendErrorResponse } from '../utils/response.js';
import { STATUS } from '../constant/statusCodes.js';

export const authenticate = (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      sendErrorResponse(res, STATUS.UNAUTHORIZED, 'Access token required');
      return;
    }

    try {
      const decoded = verifyToken(accessToken);
      req.user = decoded;
      next();
    } catch (error) {
      sendErrorResponse(res, STATUS.UNAUTHORIZED, 'Invalid or expired access token', error.message);
    }
  } catch (error) {
    sendErrorResponse(res, STATUS.INTERNAL_ERROR, 'Internal Server Error', error.message);
  }
};
