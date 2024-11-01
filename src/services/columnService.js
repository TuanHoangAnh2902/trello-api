/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes';
import { boardModel } from '~/models/boardModel';
import { cardModel } from '~/models/cardModel';
import { columnModel } from '~/models/columnModel';
import ApiError from '~/utils/ApiError';

const createNew = async (reqBody) => {
	try {
		const newColumn = { ...reqBody };

		// gọi tới tầng Model để xử lý lưu bản ghi newColumn vào trong Database
		const createdColumn = await columnModel.createNew(newColumn);

		// lấy bản ghi vừa tạo thành công, trả về cho frontend
		const getNewColumn = await columnModel.findOneById(
			createdColumn.insertedId,
		);

		if (getNewColumn) {
			getNewColumn.cards = [];

			// cập nhật mảng columnOrderIds của collection board
			await boardModel.pushColumnOrderIds(getNewColumn);
		}

		//trả kết quả về, trong Service luôn có return
		return getNewColumn;
	} catch (error) {
		throw error;
	}
};

const update = async (columnId, reqBody) => {
	try {
		const updateData = { ...reqBody, updatedAt: Date.now() };
		// gọi tới tầng Model để xử lý lưu bản ghi newColumn vào trong Database
		const updatedColumn = await columnModel.update(columnId, updateData);

		//trả kết quả về, trong Service luôn có return
		return updatedColumn;
	} catch (error) {
		throw error;
	}
};

const deleteColumn = async (columnId) => {
	try {
		const targetColumn = await columnModel.findOneById(columnId);
		if (!targetColumn) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found');
		}

		// xoá column
		await columnModel.deleteOneById(columnId);
		// xoá các card trong column
		await cardModel.deleteManyByColumnId(columnId);

		await boardModel.pullColumnOrderIds(targetColumn);
		return { deleteResult: 'Column and its Cards deleted successfully' };
	} catch (error) {
		throw error;
	}
};

export const columnService = {
	createNew,
	update,
	deleteColumn,
};
