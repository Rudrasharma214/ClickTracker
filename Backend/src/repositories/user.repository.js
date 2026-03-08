import User from '../models/user.model.js';
import AppError from '../utils/appError.js';
import { STATUS } from '../constant/statusCodes.js';

export class UserRepository {
  // Create a new user
  async create(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      throw new AppError(`Error creating user: ${error.message}`, STATUS.INTERNAL_ERROR);
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      const user = await User.findById(id).select('-password');
      return user;
    } catch (error) {
      throw new AppError(`Error finding user by ID: ${error.message}`, STATUS.INTERNAL_ERROR);
    }
  }

  // Find user by email
  async findByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw new AppError(`Error finding user by email: ${error.message}`, STATUS.INTERNAL_ERROR);
    }
  }

  // Update refresh token for user
  async updateRefreshToken(userId, refreshToken) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { refresh_token: refreshToken },
        { new: true }
      ).select('-password');
      return user;
    } catch (error) {
      throw new AppError(`Error updating refresh token: ${error.message}`, STATUS.INTERNAL_ERROR);
    }
  }

  // Find user by ID and refresh token
  async findByUserIdAndRefreshToken(userId, refreshToken) {
    try {
      const user = await User.findOne({ _id: userId, refresh_token: refreshToken }).select(
        '-password'
      );
      return user;
    } catch (error) {
      throw new AppError(
        `Error finding user by ID and refresh token: ${error.message}`,
        STATUS.INTERNAL_ERROR
      );
    }
  }
}
