import express from 'express';
import { UrlController } from '../controllers/url.controller.js';
import { UrlService } from '../services/url.service.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const urlService = new UrlService();
const urlController = new UrlController(urlService);

const urlRoutes = express.Router();

/**
 * @route POST /api/urls/shorten
 * @desc Create a shortened URL
 * @access Private
 */
urlRoutes.post('/shorten', authenticate, urlController.createUrl);

/**
 * @route GET /api/urls
 * @desc Get all URLs for the authenticated user
 * @access Private
 */
urlRoutes.get('/', authenticate, urlController.getUserUrls);

/**
 * @route GET /api/urls/:id
 * @desc Get details of a specific URL
 * @access Private
 */
urlRoutes.get('/:id', authenticate, urlController.getUrlById);

/**
 * @route PATCH /api/urls/:id
 * @desc Update a URL (customAlias, isActive, expiresAt)
 * @access Private
 */
urlRoutes.patch('/:id', authenticate, urlController.updateUrl);

/**
 * @route DELETE /api/urls/:id
 * @desc Delete a URL
 * @access Private
 */
urlRoutes.delete('/:id', authenticate, urlController.deleteUrl);

export default urlRoutes;
