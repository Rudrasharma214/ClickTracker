import Url from '../models/url.model.js';
import AppError from '../utils/appError.js';
import { STATUS } from '../constant/statusCodes.js';

export class UrlRepository {
    // Create a new shortened URL
    async create(urlData) {
        try {
            const url = new Url(urlData);
            await url.save();
            return url;
        } catch (error) {
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new AppError(
                    `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
                    STATUS.CONFLICT
                );
            }
            throw new AppError(`Error creating URL: ${error.message}`, STATUS.INTERNAL_ERROR);
        }
    }

    // Find URL by shortCode
    async findByShortCode(shortCode) {
        try {
            const url = await Url.findOne({ shortCode: shortCode.toUpperCase() });
            return url;
        } catch (error) {
            throw new AppError(`Error finding URL by short code: ${error.message}`, STATUS.INTERNAL_ERROR);
        }
    }

    // Find URL by custom alias
    async findByCustomAlias(customAlias) {
        try {
            const url = await Url.findOne({ customAlias: customAlias.toLowerCase() });
            return url;
        } catch (error) {
            throw new AppError(`Error finding URL by custom alias: ${error.message}`, STATUS.INTERNAL_ERROR);
        }
    }

    // Find URL by ID
    async findById(id) {
        try {
            const url = await Url.findById(id).populate('userId', 'email name');
            return url;
        } catch (error) {
            throw new AppError(`Error finding URL by ID: ${error.message}`, STATUS.INTERNAL_ERROR);
        }
    }

    // Find all URLs by user ID
    async findByUserId(userId, filters = {}) {
        try {
            const query = { userId };

            // Apply filters
            if (filters.isActive !== undefined) {
                query.isActive = filters.isActive;
            }

            const urls = await Url.find(query)
                .sort({ createdAt: -1 })
                .limit(filters.limit || 50)
                .skip(filters.skip || 0);

            return urls;
        } catch (error) {
            throw new AppError(`Error finding URLs by user: ${error.message}`, STATUS.INTERNAL_ERROR);
        }
    }

    // Count all URLs by user ID
    async countByUserId(userId) {
        try {
            const count = await Url.countDocuments({ userId });
            return count;
        } catch (error) {
            throw new AppError(`Error counting URLs: ${error.message}`, STATUS.INTERNAL_ERROR);
        }
    }

    // Update URL by ID
    async updateById(id, updateData) {
        try {
            const url = await Url.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
            return url;
        } catch (error) {
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new AppError(
                    `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
                    STATUS.CONFLICT
                );
            }
            throw new AppError(`Error updating URL: ${error.message}`, STATUS.INTERNAL_ERROR);
        }
    }

    // Increment click count
    async incrementClicks(id) {
        try {
            const url = await Url.findByIdAndUpdate(id, { $inc: { totalClicks: 1 } }, { new: true });
            return url;
        } catch (error) {
            throw new AppError(`Error incrementing clicks: ${error.message}`, STATUS.INTERNAL_ERROR);
        }
    }

    // Delete URL by ID
    async deleteById(id) {
        try {
            const url = await Url.findByIdAndDelete(id);
            return url;
        } catch (error) {
            throw new AppError(`Error deleting URL: ${error.message}`, STATUS.INTERNAL_ERROR);
        }
    }

    // Deactivate URL by ID
    async deactivateById(id) {
        try {
            const url = await Url.findByIdAndUpdate(id, { isActive: false }, { new: true });
            return url;
        } catch (error) {
            throw new AppError(`Error deactivating URL: ${error.message}`, STATUS.INTERNAL_ERROR);
        }
    }

    // Find active URLs by user
    async findActiveByUserId(userId) {
        try {
            const urls = await Url.find({
                userId,
                isActive: true,
                $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
            }).sort({ createdAt: -1 });
            return urls;
        } catch (error) {
            throw new AppError(`Error finding active URLs: ${error.message}`, STATUS.INTERNAL_ERROR);
        }
    }
}
