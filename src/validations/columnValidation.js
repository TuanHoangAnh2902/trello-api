import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
	const correctCondition = Joi.object({
		boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
		title: Joi.string().required().min(3).max(50).trim().strict(),
	})

	try {
		await correctCondition.validateAsync(req.body, { abortEarly: false })
		next()
	} catch (error) {
		const errorMessage = new Error(error).message
		const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
		next(customError)
	}
}

const update = async (req, res, next) => {
	// update không dùng required
	const correctCondition = Joi.object({
		boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
		title: Joi.string().min(3).max(50).trim().strict(),
		cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
	})

	try {
		// chỉ định abortEarly: false để hiển thị tất cả các lỗi
		await correctCondition.validateAsync(req.body, {
			abortEarly: false,
			allowUnknown: true,
		})
		// đưa request đến Controller sau khi đã validate thành công
		next()
	} catch (error) {
		const errorMessage = new Error(error).message
		const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
		next(customError)
	}
}

const deleteColumn = async (req, res, next) => {
	const correctCondition = Joi.object({
		id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
	})

	try {
		await correctCondition.validateAsync(req.params)
		// đưa request đến Controller sau khi đã validate thành công
		next()
	} catch (error) {
		const errorMessage = new Error(error).message
		const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
		next(customError)
	}
}

export const columnValidation = {
	createNew,
	update,
	deleteColumn,
}
