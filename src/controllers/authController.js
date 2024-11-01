/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

const register = async (req, res, next) => {
	try {
		await authService.register(req.body)

		res.status(StatusCodes.CREATED).json({
			success: true,
			status: StatusCodes.CREATED,
			message: 'Register successfully',
		})
	} catch (error) {
		next(error)
	}
}

const login = async (req, res, next) => {
	try {
		const loginUser = await authService.login(req.body)

		const payload = {
			_id: loginUser._id,
			email: loginUser.email,
			fullname: loginUser.fullname,
			username: loginUser.username,
			avatar: loginUser.avatar,
		}

		const accessToken = jwt.sign(payload, env.JWT_SECRET, {
			expiresIn: '1d',
		})

		// thiết lập cookie HTTP-Only
		res.cookie('access_token', accessToken, {
			httpOnly: true,
			secure: env.BUILD_MODE === 'dev', // only use secure in production environment
			sameSite: 'strict', // protect against CSRF
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		})

		res.status(StatusCodes.OK).json({
			success: true,
			status: StatusCodes.OK,
			message: 'Login successfully',
			user: loginUser,
		})
	} catch (error) {
		next(error)
	}
}

const checkAuth = (req, res) => {
	try {
		const token = req.cookies.access_token

		if (!token) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				status: StatusCodes.UNAUTHORIZED,
				message: 'User not authenticated',
			})
		}

		const verified = jwt.verify(token, env.JWT_SECRET)

		res.status(StatusCodes.OK).json({
			success: true,
			status: StatusCodes.OK,
			user: verified, // Thông tin người dùng sau khi xác minh JWT
		})
	} catch (error) {
		res.status(StatusCodes.UNAUTHORIZED).json({
			success: false,
			status: StatusCodes.UNAUTHORIZED,
			message: 'Invalid token',
		})
	}
}

const logout = (req, res) => {
	try {
		res.clearCookie('access_token')

		res.status(StatusCodes.OK).json({
			success: true,
			message: 'logged out',
		})
	} catch (error) {
		throw error
	}
}

const getAll = async (req, res, next) => {
	try {
		const allBoard = await authService.getAll()

		res.status(StatusCodes.OK).json(allBoard)
	} catch (error) {
		next(error)
	}
}

export const authController = {
	login,
	getAll,
	register,
	checkAuth,
	logout,
}
