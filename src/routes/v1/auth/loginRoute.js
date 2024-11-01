import express from 'express';
import { authController } from '~/controllers/authController';
import { authValidation } from '~/validations/authValidation';

const Router = express.Router();

Router.route('/').post(authValidation.login, authController.login);

export const loginRoute = Router;
