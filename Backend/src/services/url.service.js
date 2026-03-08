import { STATUS } from '../constant/statusCodes.js';
import { UrlRepository } from '../repositories/url.repository.js';
import env from '../config/env.js';

const urlRepo = new UrlRepository();

// Generate random short code
const generateShortCode = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  for (let i = 0; i < length; i++) {
    shortCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return shortCode;
};

export class UrlService {
  // Create a shortened URL
  async createUrl(userId, longUrl, customAlias = null, expiresAt = null) {
    try {
      // Check if custom alias is already taken
      if (customAlias) {
        const existingAlias = await urlRepo.findByCustomAlias(customAlias);
        if (existingAlias) {
          return {
            success: false,
            status: STATUS.CONFLICT,
            message: 'Custom alias already taken',
          };
        }
      }

      // Generate unique short code
      let shortCode;
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 5;

      while (!isUnique && attempts < maxAttempts) {
        shortCode = generateShortCode();
        const existing = await urlRepo.findByShortCode(shortCode);
        if (!existing) {
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        return {
          success: false,
          status: STATUS.INTERNAL_ERROR,
          message: 'Failed to generate unique short code',
        };
      }

      // Build short URL
      const shortUrl = `${env.SHORT_URL_DOMAIN || 'http://localhost:3000'}/${shortCode}`;

      // Create URL document
      const urlData = {
        userId,
        longUrl,
        shortCode,
        shortUrl,
        customAlias: customAlias || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      };

      const newUrl = await urlRepo.create(urlData);

      return {
        success: true,
        status: STATUS.CREATED,
        message: 'URL shortened successfully',
        data: newUrl,
      };
    } catch (error) {
      return {
        success: false,
        status: STATUS.INTERNAL_ERROR,
        message: 'Error creating shortened URL',
        error: error.message,
      };
    }
  }

  // Get URL by short code or custom alias and increment clicks
  async getUrlByCode(code) {
    try {
      // Try to find by shortCode first, then by customAlias
      let url = await urlRepo.findByShortCode(code);

      if (!url) {
        url = await urlRepo.findByCustomAlias(code);
      }

      if (!url) {
        return {
          success: false,
          status: STATUS.NOT_FOUND,
          message: 'URL not found',
        };
      }

      // Check if URL is active
      if (!url.isActive) {
        return {
          success: false,
          status: STATUS.GONE,
          message: 'This URL has been deactivated',
        };
      }

      // Check if URL is expired
      if (url.isExpired) {
        return {
          success: false,
          status: STATUS.GONE,
          message: 'This URL has expired',
        };
      }

      // Increment click count
      url = await urlRepo.incrementClicks(url._id);

      return {
        success: true,
        status: STATUS.OK,
        message: 'URL retrieved successfully',
        data: {
          longUrl: url.longUrl,
          totalClicks: url.totalClicks,
        },
      };
    } catch (error) {
      return {
        success: false,
        status: STATUS.INTERNAL_ERROR,
        message: 'Error retrieving URL',
        error: error.message,
      };
    }
  }

  // Get all URLs for a user
  async getUserUrls(userId, filters = {}) {
    try {
      const urls = await urlRepo.findByUserId(userId, filters);
      const totalCount = await urlRepo.countByUserId(userId);

      return {
        success: true,
        status: STATUS.OK,
        message: 'URLs retrieved successfully',
        data: {
          urls,
          totalCount,
          limit: filters.limit || 50,
          skip: filters.skip || 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        status: STATUS.INTERNAL_ERROR,
        message: 'Error retrieving URLs',
        error: error.message,
      };
    }
  }

  // Get URL details by ID
  async getUrlById(id, userId) {
    try {
      const url = await urlRepo.findById(id);

      if (!url) {
        return {
          success: false,
          status: STATUS.NOT_FOUND,
          message: 'URL not found',
        };
      }

      // Check if user owns this URL
      if (url.userId.toString() !== userId) {
        return {
          success: false,
          status: STATUS.FORBIDDEN,
          message: 'Not authorized to access this URL',
        };
      }

      return {
        success: true,
        status: STATUS.OK,
        message: 'URL details retrieved successfully',
        data: url,
      };
    } catch (error) {
      return {
        success: false,
        status: STATUS.INTERNAL_ERROR,
        message: 'Error retrieving URL details',
        error: error.message,
      };
    }
  }

  // Update URL
  async updateUrl(id, userId, updateData) {
    try {
      const url = await urlRepo.findById(id);

      if (!url) {
        return {
          success: false,
          status: STATUS.NOT_FOUND,
          message: 'URL not found',
        };
      }

      // Check if user owns this URL
      if (url.userId.toString() !== userId) {
        return {
          success: false,
          status: STATUS.FORBIDDEN,
          message: 'Not authorized to update this URL',
        };
      }

      // Only allow updating certain fields
      const allowedUpdates = ['customAlias', 'isActive', 'expiresAt'];
      const updatedFields = {};

      Object.keys(updateData).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          updatedFields[key] = updateData[key];
        }
      });

      const updatedUrl = await urlRepo.updateById(id, updatedFields);

      return {
        success: true,
        status: STATUS.OK,
        message: 'URL updated successfully',
        data: updatedUrl,
      };
    } catch (error) {
      return {
        success: false,
        status: STATUS.INTERNAL_ERROR,
        message: 'Error updating URL',
        error: error.message,
      };
    }
  }

  // Delete URL
  async deleteUrl(id, userId) {
    try {
      const url = await urlRepo.findById(id);

      if (!url) {
        return {
          success: false,
          status: STATUS.NOT_FOUND,
          message: 'URL not found',
        };
      }

      // Check if user owns this URL
      if (url.userId.toString() !== userId) {
        return {
          success: false,
          status: STATUS.FORBIDDEN,
          message: 'Not authorized to delete this URL',
        };
      }

      await urlRepo.deleteById(id);

      return {
        success: true,
        status: STATUS.OK,
        message: 'URL deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        status: STATUS.INTERNAL_ERROR,
        message: 'Error deleting URL',
        error: error.message,
      };
    }
  }
}
