import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const recentlyViewedBoards = async (req, res, next) => {
	const correctCondition = Joi.object({
		userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
		boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
	})

	try {
		await correctCondition.validateAsync(req.body, {
			abortEarly: false,
		})
		next()
	} catch (error) {
		const errorMessage = new Error(error).message
		const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
		next(customError)
	}
}

const getRecentViewedById = async (req, res, next) => {
	const correctCondition = Joi.object({
		userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
	})

	try {
		await correctCondition.validateAsync(req.body, {
			abortEarly: false,
		})
		next()
	} catch (error) {
		const errorMessage = new Error(error).message
		const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
		next(customError)
	}
}

export const recentlyViewedBoardsValidation = {
	recentlyViewedBoards,
	getRecentViewedById,
}
