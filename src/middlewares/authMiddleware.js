import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { env } from '~/config/environment';

const authMiddleware = (req, res, next) => {
	// Extract token from headers or cookies

	const token =
		(req.cookies && req.cookies.access_token) ||
		(req.header('Authorization')
			? req.header('Authorization').replace('Bearer ', '')
			: '');

	if (!token) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			success: false,
			status: StatusCodes.UNAUTHORIZED,
			message: 'Access denied. No token provided.',
		});
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		// Handle different types of errors
		if (error.name === 'TokenExpiredError') {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				status: StatusCodes.UNAUTHORIZED,
				message: 'Token has expired.',
			});
		}
		if (error.name === 'JsonWebTokenError') {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				status: StatusCodes.BAD_REQUEST,
				message: 'Invalid token.',
			});
		}
		// Handle other errors
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			message: 'Something went wrong.',
		});
	}
};

export default authMiddleware;
