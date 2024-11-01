import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
	const correctCondition = Joi.object({
		userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
		workSpaceId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
		title: Joi.string().required().min(3).max(50).trim().strict(),
		description: Joi.string().required().min(3).max(255).trim().strict(),
		type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
		bgImage: Joi.string().uri().required(),
		favourite: Joi.boolean().valid(true, false).default(false),
		members: Joi.array()
			.items(
				Joi.object({
					userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
					role: Joi.string().valid('owner', 'member').default('member').required(),
				}),
			)
			.default([]),
	})

	try {
		// chỉ định abortEarly: false để hiển thị tất cả các lỗi
		await correctCondition.validateAsync(req.body, { abortEarly: false })
		// đưa request đến Controller sa khi đã validate thành công
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
		title: Joi.string().min(3).max(50).trim().strict(),
		description: Joi.string().min(3).max(255).trim().strict(),
		type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
		columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
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

const moveCardToDifferentColumn = async (req, res, next) => {
	const correctCondition = Joi.object({
		currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
		prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
		prevCardOrderIds: Joi.array()
			.required()
			.items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
		nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
		nextCardOrderIds: Joi.array()
			.required()
			.items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
	})

	try {
		// chỉ định abortEarly: false để hiển thị tất cả các lỗi
		await correctCondition.validateAsync(req.body, {
			abortEarly: false,
		})
		// đưa request đến Controller sau khi đã validate thành công
		next()
	} catch (error) {
		const errorMessage = new Error(error).message
		const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
		next(customError)
	}
}

const addFavourite = async (req, res, next) => {
	// update không dùng required
	const correctCondition = Joi.object({
		favourite: Joi.boolean().valid(true, false).default(false),
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

export const boardValidation = {
	moveCardToDifferentColumn,
	addFavourite,
	createNew,
	update,
}
