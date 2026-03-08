import { STATUS } from '../constant/statusCodes.js';
import { UserRepository } from '../repositories/user.repository.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/token.js';

const userRepo = new UserRepository();

export class AuthService {
  // Register a new user
  async signup(name, email, password) {
    try {
      const existingUser = await userRepo.findByEmail(email);
      if (existingUser) {
        return {
          success: false,
          status: STATUS.CONFLICT,
          message: 'User already exists',
        };
      }

      const hashedPassword = await hashPassword(password);

      const userData = { name, email, password: hashedPassword };
      const user = await userRepo.create(userData);

      return {
        success: true,
        status: STATUS.CREATED,
        message: 'User created successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      return {
        success: false,
        status: STATUS.INTERNAL_ERROR,
        message: 'An error occurred while signing up',
        error: error.message,
      };
    }
  }

  // Login user with email and password
  async login(email, password) {
    try {
      const user = await userRepo.findByEmail(email);
      if (!user) {
        return {
          success: false,
          status: STATUS.NOT_FOUND,
          message: 'Invalid credentials',
        };
      }

      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          status: STATUS.UNAUTHORIZED,
          message: 'Invalid credentials',
        };
      }

      const accessToken = generateToken({ id: user._id, email: user.email });
      const refreshToken = generateRefreshToken({ id: user._id, email: user.email });

      await userRepo.updateRefreshToken(user._id, refreshToken);

      return {
        success: true,
        status: STATUS.OK,
        message: 'Login successful',
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      return {
        success: false,
        status: STATUS.INTERNAL_ERROR,
        message: 'An error occurred while logging in',
        error: error.message,
      };
    }
  }

  // Logout user
  async logout(userId) {
    try {
      await userRepo.updateRefreshToken(userId, null);

      return {
        success: true,
        status: STATUS.OK,
        message: 'Logout successful',
      };
    } catch (error) {
      return {
        success: false,
        status: STATUS.INTERNAL_ERROR,
        message: 'An error occurred while logging out',
        error: error.message,
      };
    }
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      let decoded;
      try {
        decoded = verifyToken(refreshToken);
      } catch (error) {
        return {
          success: false,
          status: STATUS.UNAUTHORIZED,
          message: 'Invalid or expired refresh token',
          error: error.message,
        };
      }

      const user = await userRepo.findByUserIdAndRefreshToken(decoded.id, refreshToken);
      if (!user) {
        return {
          success: false,
          status: STATUS.UNAUTHORIZED,
          message: 'Refresh token not found in database',
        };
      }

      const newAccessToken = generateToken({ id: user._id, email: user.email });

      return {
        success: true,
        status: STATUS.OK,
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      return {
        success: false,
        status: STATUS.INTERNAL_ERROR,
        message: 'An error occurred while refreshing token',
        error: error.message,
      };
    }
  }
}
