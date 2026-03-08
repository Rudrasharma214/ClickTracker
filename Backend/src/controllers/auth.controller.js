import { STATUS } from '../constant/statusCodes.js';
import { sendErrorResponse, sendResponse } from '../utils/response.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
};

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000, // 15 minutes for access token
};

export class AuthController {
  constructor(authService) {
    this.authService = authService;
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  // Register a new user
  async signup(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await this.authService.signup(name, email, password);

      if (!user.success) {
        sendErrorResponse(res, user.status, user.message, user.error);
        return;
      }

      sendResponse(res, user.status, user.message, user.data);
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);

      if (!user.success) {
        sendErrorResponse(res, user.status, user.message, user.error);
        return;
      }

      res.cookie('accessToken', user.tokens.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
      res.cookie('refreshToken', user.tokens.refreshToken, COOKIE_OPTIONS);

      sendResponse(res, user.status, user.message, null);
    } catch (error) {
      next(error);
    }
  }

  // Logout user
  async logout(req, res, next) {
    try {
      const userId = req.user?.id;
      const result = await this.authService.logout(userId);

      if (!result.success) {
        sendErrorResponse(res, result.status, result.message, result.error);
        return;
      }

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      sendResponse(res, result.status, result.message);
    } catch (error) {
      next(error);
    }
  }

  // Refresh access token
  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        sendErrorResponse(res, STATUS.UNAUTHORIZED, 'Refresh token required');
        return;
      }

      const result = await this.authService.refreshToken(refreshToken);

      if (!result.success) {
        sendErrorResponse(res, result.status, result.message, result.error);
        return;
      }

      res.cookie('accessToken', result.data.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

      sendResponse(res, result.status, result.message, null);
    } catch (error) {
      next(error);
    }
  }
}
