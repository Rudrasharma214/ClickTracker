import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();
const authController = new AuthController(authService);

const authRoutes = express.Router();

/**
 * @route POST /auth/signup
 * @desc Register a new user
 * @access Public
 */
authRoutes.post(
    '/signup',
    authController.signup
);

export default authRoutes;