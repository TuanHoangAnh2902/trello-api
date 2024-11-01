import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards';
const CARD_COLLECTION_SCHEMA = Joi.object({
	boardId: Joi.string()
		.required()
		.pattern(OBJECT_ID_RULE)
		.message(OBJECT_ID_RULE_MESSAGE),
	columnId: Joi.string()
		.required()
		.pattern(OBJECT_ID_RULE)
		.message(OBJECT_ID_RULE_MESSAGE),

	title: Joi.string().required().min(3).max(50).trim().strict(),
	description: Joi.string().optional(),

	createdAt: Joi.date().timestamp('javascript').default(Date.now),
	updatedAt: Joi.date().timestamp('javascript').default(null),
	_destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createAt'];

// thêm các dữ liệu mặc định cho các trường cần thiết trước khi tạo mới bản ghi
const validateBeforeCreate = async (data) => {
	return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
		abortEarly: false,
	});
};

const createNew = async (data) => {
	try {
		const validData = await validateBeforeCreate(data);

		const newCardToAdd = {
			...validData,
			boardId: new ObjectId(validData.boardId),
			columnId: new ObjectId(validData.columnId),
		};

		const createdCard = await GET_DB()
			.collection(CARD_COLLECTION_NAME)
			.insertOne(newCardToAdd);
		return createdCard;
	} catch (error) {
		throw new Error(error);
	}
};

const findOneById = async (id) => {
	try {
		const result = await GET_DB()
			.collection(CARD_COLLECTION_NAME)
			.findOne({ _id: new ObjectId(id) });
		return result;
	} catch (error) {
		throw new Error(error);
	}
};

const update = async (cardId, updateData) => {
	try {
		Object.keys(updateData).forEach((fieldname) => {
			if (INVALID_UPDATE_FIELDS.includes(fieldname)) {
				delete updateData[fieldname];
			}
		});

		// biến đổi dữ liệu liên quan tới ObjectId
		if (updateData.columnId)
			updateData.columnId = new ObjectId(updateData.columnId);

		const result = await GET_DB()
			.collection(CARD_COLLECTION_NAME)
			.findOneAndUpdate(
				{ _id: new ObjectId(cardId) },
				{ $set: updateData },
				{ returnDocument: 'after' },
			);

		return result;
	} catch (error) {
		throw new Error(error);
	}
};

const deleteManyByColumnId = async (columnId) => {
	try {
		const result = await GET_DB()
			.collection(CARD_COLLECTION_NAME)
			.deleteMany({
				columnId: new ObjectId(columnId),
			});

		return result;
	} catch (error) {
		throw new Error(error);
	}
};

export const cardModel = {
	CARD_COLLECTION_NAME,
	CARD_COLLECTION_SCHEMA,
	deleteManyByColumnId,
	findOneById,
	createNew,
	update,
};