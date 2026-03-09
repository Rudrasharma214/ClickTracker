import User from '../models/user.model.js';

export class UserRepository {
  // Create a new user
  async create(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  // Find user by ID
  async findById(id) {
    const user = await User.findById(id).select('-password');
    return user;
  }

  // Find user by email
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  // Update refresh token for user
  async updateRefreshToken(userId, refreshToken) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { refresh_token: refreshToken } },
      { returnDocument: 'after' }
    ).select('-password');
    return user;
  }

  // Find user by ID and refresh token
  async findByUserIdAndRefreshToken(userId, refreshToken) {
    const user = await User.findOne({ _id: userId, refresh_token: refreshToken }).select(
      '-password'
    );
    return user;
  }
}
