import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';

const register = async (req, res, next) => {
	const correctCondition = Joi.object({
		fullname: Joi.string().required().min(3).max(50).trim().strict(),
		username: Joi.string().required().min(3).max(30).trim().strict(),
		password: Joi.string().required().min(6).trim().strict(),
		email: Joi.string().email().required(),
		avatar: Joi.string().uri().required(),
	});

	try {
		await correctCondition.validateAsync(req.body, {
			abortEarly: false,
		});
		next();
	} catch (error) {
		const errorMessage = new Error(error).message;
		const customError = new ApiError(
			StatusCodes.UNPROCESSABLE_ENTITY,
			errorMessage,
		);
		next(customError);
	}
};

const login = async (req, res, next) => {
	const correctCondition = Joi.object({
		password: Joi.string().required().min(6).trim().strict(),
		email: Joi.string().email().required(),
	});

	try {
		await correctCondition.validateAsync(req.body, {
			abortEarly: false,
		});
		next();
	} catch (error) {
		const errorMessage = new Error(error).message;
		const customError = new ApiError(
			StatusCodes.UNPROCESSABLE_ENTITY,
			errorMessage,
		);
		next(customError);
	}
};

export const authValidation = {
	login,
	register,
};
