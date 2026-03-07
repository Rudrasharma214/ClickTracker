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
}