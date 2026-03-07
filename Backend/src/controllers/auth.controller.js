import { sendErrorResponse, sendResponse } from '../utils/response.js';

export class AuthController {
  constructor(authService) {
    this.authService = authService;
    this.signup = this.signup.bind(this);
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
}
