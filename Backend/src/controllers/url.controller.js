import { sendErrorResponse, sendResponse } from '../utils/response.js';
import { STATUS } from '../constant/statusCodes.js';

export class UrlController {
  constructor(urlService) {
    this.urlService = urlService;
    this.createUrl = this.createUrl.bind(this);
    this.getUserUrls = this.getUserUrls.bind(this);
    this.getUrlById = this.getUrlById.bind(this);
    this.updateUrl = this.updateUrl.bind(this);
    this.deleteUrl = this.deleteUrl.bind(this);
  }

  // Create shortened URL
  async createUrl(req, res, next) {
    try {
      const userId = req.user?.id;
      const { longUrl, customAlias, expiresAt } = req.body;

      if (!longUrl) {
        sendErrorResponse(res, STATUS.BAD_REQUEST, 'Long URL is required');
        return;
      }

      const result = await this.urlService.createUrl(userId, longUrl, customAlias, expiresAt);

      if (!result.success) {
        sendErrorResponse(res, result.status, result.message, result.error);
        return;
      }

      sendResponse(res, result.status, result.message, result.data);
    } catch (error) {
      next(error);
    }
  }

  // Get all URLs for user
  async getUserUrls(req, res, next) {
    try {
      const userId = req.user?.id;
      const { limit = 50, skip = 0, isActive } = req.query;

      const filters = {
        limit: Math.min(parseInt(limit) || 50, 100),
        skip: parseInt(skip) || 0,
      };

      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      const result = await this.urlService.getUserUrls(userId, filters);

      if (!result.success) {
        sendErrorResponse(res, result.status, result.message, result.error);
        return;
      }

      sendResponse(res, result.status, result.message, result.data);
    } catch (error) {
      next(error);
    }
  }

  // Get URL details by ID
  async getUrlById(req, res, next) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      const result = await this.urlService.getUrlById(id, userId);

      if (!result.success) {
        sendErrorResponse(res, result.status, result.message);
        return;
      }

      sendResponse(res, result.status, result.message, result.data);
    } catch (error) {
      next(error);
    }
  }

  // Update URL
  async updateUrl(req, res, next) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const updateData = req.body;

      const result = await this.urlService.updateUrl(id, userId, updateData);

      if (!result.success) {
        sendErrorResponse(res, result.status, result.message);
        return;
      }

      sendResponse(res, result.status, result.message, result.data);
    } catch (error) {
      next(error);
    }
  }

  // Delete URL
  async deleteUrl(req, res, next) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      const result = await this.urlService.deleteUrl(id, userId);

      if (!result.success) {
        sendErrorResponse(res, result.status, result.message);
        return;
      }

      sendResponse(res, result.status, result.message);
    } catch (error) {
      next(error);
    }
  }
}
