import express from 'express';
import { UrlController } from '../controllers/url.controller.js';
import { UrlService } from '../services/url.service.js';

const urlService = new UrlService();
const urlController = new UrlController(urlService);

const redirectRoutes = express.Router();

/**
 * @route GET /:code
 * @desc Redirect to original URL by short code or custom alias
 * @access Public
 */
redirectRoutes.get('/:code', urlController.getUrlByCode);

export default redirectRoutes;
