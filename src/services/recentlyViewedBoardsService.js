import { boardModel } from '~/models/boardModel'
import { recentlyViewedBoardsModal } from '~/models/recentlyViewedBoardsModal'

/* eslint-disable no-useless-catch */
const recentlyViewedBoards = async (reqBody) => {
	try {
		const dataId = { ...reqBody }

		const createRecentlyViewedBoards = await recentlyViewedBoardsModal.recentlyViewedBoards(dataId)

		const getNewViewedBoards = await boardModel.findOneById(createRecentlyViewedBoards.boardId)

		return getNewViewedBoards
	} catch (error) {
		throw error
	}
}

const getRecentViewedById = async (userId) => {
	try {
		let allRecentViewedBoard = await recentlyViewedBoardsModal.getRecentViewedById(userId)

		if (!allRecentViewedBoard) {
			allRecentViewedBoard = []
		}
		return allRecentViewedBoard
	} catch (error) {
		throw error
	}
}

export const recentlyViewedBoardsService = {
	recentlyViewedBoards,
	getRecentViewedById,
}
