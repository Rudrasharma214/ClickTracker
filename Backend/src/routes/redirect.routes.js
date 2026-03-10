import express from 'express';
import { RedirectController } from '../controllers/redirect.controller.js';
import { RedirectService } from '../services/redirect.service.js';

const redirectService = new RedirectService();
const redirectController = new RedirectController(redirectService);

const redirectRoutes = express.Router();

/**
 * @route GET /r/:shortCode
 * @desc Redirect to original URL and track click
 * @access Public
 */
redirectRoutes.get('/:shortCode', redirectController.handleRedirect);

export default redirectRoutes;
