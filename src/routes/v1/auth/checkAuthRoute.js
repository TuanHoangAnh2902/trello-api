import express from 'express';
import { authController } from '~/controllers/authController';

const Router = express.Router();

Router.route('/').get(authController.checkAuth);

export const checkAuthRoute = Router;
