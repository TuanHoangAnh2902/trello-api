import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createNew = async (req, res, next) => {
	try {
		// điều hướng dữ liệu sang service
		const createdColumn = await columnService.createNew(req.body)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.CREATED).json(createdColumn)
	} catch (error) {
		next(error)
	}
}

const update = async (req, res, next) => {
	try {
		const columnId = req.params.id

		// điều hướng dữ liệu sang service
		const updatedColumn = await columnService.update(columnId, req.body)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.OK).json(updatedColumn)
	} catch (error) {
		next(error)
	}
}

const deleteColumn = async (req, res, next) => {
	try {
		const columnId = req.params.id

		// điều hướng dữ liệu sang service
		const result = await columnService.deleteColumn(columnId)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.OK).json(result)
	} catch (error) {
		next(error)
	}
}

export const columnController = {
	createNew,
	update,
	deleteColumn,
}
