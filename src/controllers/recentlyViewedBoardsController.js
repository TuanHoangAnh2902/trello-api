import { StatusCodes } from 'http-status-codes'
import { recentlyViewedBoardsService } from '~/services/recentlyViewedBoardsService'

const recentlyViewedBoards = async (req, res, next) => {
	try {
		// điều hướng dữ liệu sang service
		const updataViewedBoards = await recentlyViewedBoardsService.recentlyViewedBoards(req.body)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.CREATED).json(updataViewedBoards)
	} catch (error) {
		next(error)
	}
}

const getRecentViewedById = async (req, res, next) => {
	const userId = req.params.userId

	try {
		// điều hướng dữ liệu sang service
		const getViewedBoards = await recentlyViewedBoardsService.getRecentViewedById(userId)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.CREATED).json(getViewedBoards)
	} catch (error) {
		next(error)
	}
}

export const recentlyViewedBoardsController = {
	recentlyViewedBoards,
	getRecentViewedById,
}
