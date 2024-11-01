import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { boardModel } from './boardModel'

// Define Collection (name & schema)
const VIEWED_COLLECTION_NAME = 'recentlyViewedBoards'
const VIEWED_COLLECTION_SCHEMA = Joi.object({
	userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
	boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
})

// thêm các dữ liệu mặc định cho các trường cần thiết trước khi tạo mới bản ghi
const validateBeforeCreate = async (data) => {
	return await VIEWED_COLLECTION_SCHEMA.validateAsync(data, {
		abortEarly: false,
	})
}

const recentlyViewedBoards = async (dataId) => {
	try {
		const validData = await validateBeforeCreate(dataId)

		// Bước 1: Thêm boardId vào danh sách nếu chưa tồn tại
		await GET_DB()
			.collection(VIEWED_COLLECTION_NAME)
			.updateOne(
				{ userId: new ObjectId(validData.userId) },
				{
					$addToSet: { viewedBoards: new ObjectId(validData.boardId) }, // Thêm boardId nếu chưa tồn tại
				},
				{ upsert: true }, // Tạo mới nếu chưa tồn tại
			)

		// Bước 2: Giới hạn danh sách chỉ giữ lại 10 bảng gần nhất
		const updateViewed = await GET_DB()
			.collection(VIEWED_COLLECTION_NAME)
			.updateOne(
				{ userId: new ObjectId(validData.userId) },
				{
					$push: {
						viewedBoards: {
							$each: [], // Không thêm mới phần tử
							$slice: -4, // Giữ lại 4 bảng gần nhất
						},
					},
				},
			)

		return { ...updateViewed, boardId: dataId.boardId }
	} catch (error) {
		throw new Error(error.message || error)
	}
}

const getRecentViewedById = async (userId) => {
	const now = new Date()
	try {
		// Đợi kết quả từ findOne
		const getBoardIdByUserId = await GET_DB()
			.collection(VIEWED_COLLECTION_NAME)
			.findOne({
				userId: new ObjectId(userId),
			})

		// Kiểm tra nếu không tìm thấy bản ghi
		if (!getBoardIdByUserId) return

		// Chuyển đổi viewedBoards thành ObjectId
		let objectIdArray = getBoardIdByUserId.viewedBoards?.map((id) => new ObjectId(id))

		const result = await GET_DB()
			.collection(boardModel.BOARD_COLLECTION_NAME)
			.find({ _id: { $in: objectIdArray } }) // Sử dụng toán tử $in
			.toArray()

		// Bước 3: Cập nhật thời gian viewedAt trong collection boardModel.BOARD_COLLECTION_NAME
		await GET_DB()
			.collection(boardModel.BOARD_COLLECTION_NAME)
			.updateOne(
				{ _id: { $in: objectIdArray } }, // Điều kiện để cập nhật các board trong objectIdArray
				{
					$set: { viewedAt: now }, // Cập nhật trường viewedAt
				},
			)

		return result
	} catch (error) {
		throw new Error(`Error fetching viewed boards: ${error.message}`)
	}
}

export const recentlyViewedBoardsModal = {
	recentlyViewedBoards,
	getRecentViewedById,
}
