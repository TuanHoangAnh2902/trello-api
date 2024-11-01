/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { boardModel } from './boardModel'

const WORKSPACE_COLLECTION_NAME = 'workspaces'
const WORKSPACE_COLLECTION_SCHEMA = Joi.object({
	userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
	title: Joi.string().required().min(3).max(50).trim().strict(),
	slug: Joi.string().required().min(3).trim().strict(),
	description: Joi.string().required().min(3).max(255).trim().strict(),
	type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
	avatar: Joi.string().uri().required(),
	createAt: Joi.date().timestamp('javascript').default(Date.now()),
	updatedAt: Joi.date().timestamp('javascript').default(null),
	_destroy: Joi.boolean().default(false),
	members: Joi.array()
		.items(
			Joi.object({
				userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
				role: Joi.string().valid('owner', 'member').required(),
			}),
		)
		.default([]),
})

const INVALID_UPDATE_FIELDS = ['_id', 'createAt']

// thêm các dữ liệu mặc định cho các trường cần thiết trước khi tạo mới bản ghi
const validateBeforeCreate = async (data) => {
	return await WORKSPACE_COLLECTION_SCHEMA.validateAsync(data, {
		abortEarly: false,
	})
}

const getAll = async (userId) => {
	const result = GET_DB()
		.collection(WORKSPACE_COLLECTION_NAME)
		.find({ members: { $elemMatch: { userId: new ObjectId(userId) } } })
		.toArray()

	return result
}

const createNew = async (data) => {
	try {
		const validData = await validateBeforeCreate(data)

		const newWorkSpaceToAdd = {
			...validData,
			userId: new ObjectId(validData.userId),
			members: [
				{
					userId: new ObjectId(validData.userId),
					role: 'owner',
				},
			],
		}

		const createdWorkSpace = await GET_DB().collection(WORKSPACE_COLLECTION_NAME).insertOne(newWorkSpaceToAdd)
		return createdWorkSpace
	} catch (error) {
		throw new Error(error)
	}
}

const findOneById = async (id) => {
	try {
		const result = await GET_DB()
			.collection(WORKSPACE_COLLECTION_NAME)
			.findOne({ _id: new ObjectId(id) })
		return result
	} catch (error) {
		throw new Error(error)
	}
}

const getDetails = async (workSpaceId) => {
	try {
		const result = await GET_DB()
			.collection(WORKSPACE_COLLECTION_NAME)
			.aggregate([
				{
					$match: {
						_id: new ObjectId(workSpaceId),
						_destroy: false,
					},
				},
				{
					$lookup: {
						from: boardModel.BOARD_COLLECTION_NAME,
						localField: '_id',
						foreignField: 'workSpaceId',
						as: 'boards',
					},
				},
			])
			.toArray()

		return result[0] || null
	} catch (error) {
		throw new Error(error)
	}
}

const getAllDetails = async (userId) => {
	if (!ObjectId.isValid(userId)) {
		throw new Error('Invalid userId format')
	}

	try {
		const result = await GET_DB()
			.collection(WORKSPACE_COLLECTION_NAME)
			.aggregate([
				{
					$match: {
						members: {
							$elemMatch: { userId: new ObjectId(userId) },
						},
						_destroy: false,
					},
				},
				{
					$lookup: {
						from: boardModel.BOARD_COLLECTION_NAME,
						localField: '_id',
						foreignField: 'workSpaceId',
						as: 'boards',
					},
				},
			])
			.toArray()

		return result || []
	} catch (error) {
		throw new Error(`Error in getAllDetails: ${error.message}`)
	}
}

const updateMember = async (workSpaceId, updateData) => {
	try {
		Object.keys(updateData).forEach((fieldname) => {
			if (INVALID_UPDATE_FIELDS.includes(fieldname)) {
				delete updateData[fieldname]
			}
		})

		if (updateData.members) updateData.members.userId = new ObjectId(updateData.members.userId)

		const result = await GET_DB()
			.collection(WORKSPACE_COLLECTION_NAME)
			.findOneAndUpdate(
				{
					_id: new ObjectId(workSpaceId),
				},
				{ $push: { members: { ...updateData.members } } },
				{ $set: updateData.updatedAt },
				{ ReturnDocument: 'after' },
			)

		return result
	} catch (error) {
		throw new Error(error)
	}
}

export const workSpaceModel = {
	WORKSPACE_COLLECTION_NAME,
	WORKSPACE_COLLECTION_SCHEMA,
	getAll,
	createNew,
	getDetails,
	findOneById,
	updateMember,
	getAllDetails,
}
