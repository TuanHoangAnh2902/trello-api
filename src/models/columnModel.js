import Joi from 'joi'
import { ObjectId } from 'mongodb'

import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
	boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
	title: Joi.string().required().min(3).max(50).trim().strict(),

	// Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé
	cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

	createdAt: Joi.date().timestamp('javascript').default(Date.now),
	updatedAt: Joi.date().timestamp('javascript').default(null),
	_destroy: Joi.boolean().default(false),
})

// thêm các dữ liệu mặc định cho các trường cần thiết trước khi tạo mới bản ghi
const validateBeforeCreate = async (data) => {
	return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, {
		abortEarly: false,
	})
}

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createAt']

const createNew = async (data) => {
	try {
		const validData = await validateBeforeCreate(data)

		const newColumnToAdd = {
			...validData,
			boardId: new ObjectId(validData.boardId),
		}

		const createdBoard = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd)
		return createdBoard
	} catch (error) {
		throw new Error(error)
	}
}

const findOneById = async (id) => {
	try {
		const result = await GET_DB()
			.collection(COLUMN_COLLECTION_NAME)
			.findOne({ _id: new ObjectId(id) })
		return result
	} catch (error) {
		throw new Error(error)
	}
}

// push 1 giá trị cardId vào cuối mảng columnOrderIds của board
const pushCardOrderIds = async (card) => {
	try {
		const result = await GET_DB()
			.collection(COLUMN_COLLECTION_NAME)
			.findOneAndUpdate(
				{ _id: new ObjectId(card.columnId) },
				{ $push: { cardOrderIds: new ObjectId(card._id) } },
				{ returnDocument: 'after' },
			)

		return result
	} catch (error) {
		throw new Error(error)
	}
}

const update = async (columnId, updateData) => {
	try {
		Object.keys(updateData).forEach((fieldname) => {
			if (INVALID_UPDATE_FIELDS.includes(fieldname)) {
				delete updateData[fieldname]
			}
		})

		// biến đổi dữ liệu liên quan tới ObjectId
		if (updateData.cardOrderIds) {
			updateData.cardOrderIds = updateData.cardOrderIds.map((cardId) => new ObjectId(cardId))
		}

		const result = await GET_DB()
			.collection(COLUMN_COLLECTION_NAME)
			.findOneAndUpdate({ _id: new ObjectId(columnId) }, { $set: updateData }, { returnDocument: 'after' })

		return result
	} catch (error) {
		throw new Error(error)
	}
}

const deleteOneById = async (columnId) => {
	try {
		const result = await GET_DB()
			.collection(COLUMN_COLLECTION_NAME)
			.deleteOne({ _id: new ObjectId(columnId) })
		return result
	} catch (error) {
		throw new Error(error)
	}
}

export const columnModel = {
	COLUMN_COLLECTION_NAME,
	COLUMN_COLLECTION_SCHEMA,
	pushCardOrderIds,
	deleteOneById,
	findOneById,
	createNew,
	update,
}
