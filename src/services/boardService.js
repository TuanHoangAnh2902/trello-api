/* eslint-disable no-useless-catch */
import { cloneDeep } from 'lodash'

import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
	try {
		// xử lý logic dữ liệu tùy thuộc đặc thù dự án
		const newBoard = {
			...reqBody,
			slug: slugify(reqBody.title),
		}

		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		const createdBoard = await boardModel.createNew(newBoard)

		// lấy bản ghi vừa tạo thành công, trả về cho frontend
		const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

		//trả kết quả về, trong Service luôn có return
		return getNewBoard
	} catch (error) {
		throw error
	}
}

const getDetails = async (boardId) => {
	try {
		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		let board = await boardModel.getDetails(boardId)
		if (!board) {
			board = []
		}

		const resBoard = cloneDeep(board)
		// đưa card vào từng column
		resBoard?.columns?.forEach((column) => {
			column.cards = resBoard.cards.filter(
				// .equals là phương thức của MongoDB
				(card) => card.columnId.equals(column._id),

				// (card) => card.columnId.toString() === column._id.toString(),
			)
		})

		// xóa mảng cards ở board ban đầu
		delete resBoard.cards

		//trả kết quả về, trong board Service luôn có return
		return resBoard
	} catch (error) {
		throw error
	}
}

const getAll = async (userId) => {
	try {
		let allBoard = await boardModel.getAll(userId)

		if (!allBoard) {
			allBoard = []
		}
		return allBoard
	} catch (error) {
		throw error
	}
}

const update = async (boardId, reqBody) => {
	try {
		const updateData = { ...reqBody, updatedAt: Date.now() }
		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		const updatedBoard = await boardModel.update(boardId, updateData)

		//trả kết quả về, trong Service luôn có return
		return updatedBoard
	} catch (error) {
		throw error
	}
}

const updateViewed = async (boardId) => {
	try {
		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		const updatedBoard = await boardModel.updateViewed(boardId)

		//trả kết quả về, trong Service luôn có return
		return updatedBoard
	} catch (error) {
		throw error
	}
}

const moveCardToDifferentColumn = async (reqBody) => {
	try {
		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database

		// B1: cập nhật lại cardOrderIds của column cũ chứa nó
		await columnModel.update(reqBody.prevColumnId, {
			cardOrderIds: reqBody.prevCardOrderIds,
			updatedAt: Date.now(),
		})
		// B2: cập nhật lại cardOrderIds của column mới chứa nó
		await columnModel.update(reqBody.nextColumnId, {
			cardOrderIds: reqBody.nextCardOrderIds,
			updatedAt: Date.now(),
		})
		// B3: cập nhật lại columnId của card được kéo
		await cardModel.update(reqBody.currentCardId, {
			columnId: reqBody.nextColumnId,
		})

		//trả kết quả về, trong Service luôn có return
		return { updateResult: 'success' }
	} catch (error) {
		throw error
	}
}

const addFavourite = async (boardId, favourite) => {
	try {
		const updateData = { favourite, updatedAt: Date.now() }
		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		const updateFavouriteBoard = await boardModel.addFavourite(boardId, updateData)

		//trả kết quả về, trong Service luôn có return
		return updateFavouriteBoard
	} catch (error) {
		throw error
	}
}

export const boardService = {
	moveCardToDifferentColumn,
	addFavourite,
	updateViewed,
	getDetails,
	createNew,
	update,
	getAll,
}
