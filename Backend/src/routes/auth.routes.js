import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();
const authController = new AuthController(authService);

const authRoutes = express.Router();

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 */
authRoutes.post(
    '/signup',
    authController.signup
);

// /**
//  * @route POST /api/auth/login
//  * @desc Authenticate user and return token
//  * @access Public
//  */
// authRoutes.post(
//     '/login',
//     authController.login
// );

// /**
//  * @route POST /api/auth/forgot-password
//  * @desc Send password reset email
//  * @access Public
//  */
// authRoutes.post(
//     '/forgot-password',
//     authController.forgotPassword
// );

// /**
//  * @route POST /api/auth/reset-password
//  * @desc Reset user password
//  * @access Public
//  */
// authRoutes.post(
//     '/reset-password',
//     authController.resetPassword
// );

// /**
//  * @route POST /api/auth/logout
//  * @desc Logout user and invalidate token
//  * @access Private
//  */
// authRoutes.post(
//     '/logout',
//     authController.logout
// );

// /**
//  * @route POST /api/auth/refresh-token
//  * @desc Refresh access token using refresh token
//  * @access Private
//  */
// authRoutes.post(
//     '/refresh-token',
//     authController.refreshToken
// );

export default authRoutes;