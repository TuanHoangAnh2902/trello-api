import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
	try {
		// điều hướng dữ liệu sang service
		const createdBoard = await boardService.createNew(req.body)
		console.log('🚀 ~ createNew ~ req.body:', req.body)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.CREATED).json({
			success: true,
			status: StatusCodes.CREATED,
			message: 'Create board successfully',
			createdBoard,
		})
	} catch (error) {
		next(error)
	}
}

const getAll = async (req, res, next) => {
	try {
		const userId = req.params.userId
		const allBoard = await boardService.getAll(userId)

		res.status(StatusCodes.OK).json(allBoard)
	} catch (error) {
		next(error)
	}
}

const getDetails = async (req, res, next) => {
	try {
		const boardId = req.params.id

		// điều hướng dữ liệu sang service
		const board = await boardService.getDetails(boardId)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.OK).json(board)
	} catch (error) {
		next(error)
	}
}

const update = async (req, res, next) => {
	try {
		const boardId = req.params.id

		// điều hướng dữ liệu sang service
		const updatedBoard = await boardService.update(boardId, req.body)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.OK).json(updatedBoard)
	} catch (error) {
		next(error)
	}
}

const updateViewed = async (req, res, next) => {
	try {
		const boardId = req.params.boardId

		// điều hướng dữ liệu sang service
		const updatedBoard = await boardService.updateViewed(boardId)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.OK).json(updatedBoard)
	} catch (error) {
		next(error)
	}
}

const moveCardToDifferentColumn = async (req, res, next) => {
	try {
		// điều hướng dữ liệu sang service
		const result = await boardService.moveCardToDifferentColumn(req.body)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.OK).json(result)
	} catch (error) {
		next(error)
	}
}

const addFavourite = async (req, res, next) => {
	try {
		const { boardId, favourite } = req.body

		const updateFavouriteBoard = await boardService.addFavourite(boardId, favourite)
		res.status(StatusCodes.OK).json(updateFavouriteBoard)
	} catch (error) {
		next(error)
	}
}

export const boardController = {
	moveCardToDifferentColumn,
	updateViewed,
	addFavourite,
	getDetails,
	createNew,
	update,
	getAll,
}
