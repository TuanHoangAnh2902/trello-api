import { authModel } from '~/models/authModel'

/* eslint-disable no-useless-catch */
const register = async (reqBody) => {
	try {
		const createdUser = await authModel.register(reqBody)

		// lấy bản ghi vừa tạo thành công, trả về cho frontend
		const getNewUser = await authModel.findOneById(createdUser.insertedId)

		return getNewUser
	} catch (error) {
		throw error
	}
}

const login = async (reqBody) => {
	try {
		const createdUser = await authModel.login(reqBody)

		return createdUser
	} catch (error) {
		throw error
	}
}

const getAll = async () => {
	try {
		let allBoard = await authModel.getAll()

		if (!allBoard) {
			allBoard = []
		}
		return allBoard
	} catch (error) {
		throw error
	}
}

export const authService = {
	register,
	login,
	getAll,
}
