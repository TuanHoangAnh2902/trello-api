import { GET_DB } from '~/config/mongodb'
const Joi = require('joi')
import bcrypt from 'bcrypt'

const USERS_COLLECTION_NAME = 'users'
const USERS_COLLECTION_SCHEMA = Joi.object({
	email: Joi.string().email().required().trim().strict(),
	username: Joi.string().required().min(3).max(30).trim().strict(),
	password: Joi.string().required().min(6).trim().strict(),
	fullname: Joi.string().required().min(3).max(50).trim().strict(),
	avatar: Joi.string().uri().required(),
	createdAt: Joi.date().timestamp('javascript').default(Date.now),
	updatedAt: Joi.date().timestamp('javascript').default(null),
	_destroy: Joi.boolean().default(false),
})

// Xác thực dữ liệu trước khi tạo mới người dùng
const validateBeforeCreate = async (data) => {
	return await USERS_COLLECTION_SCHEMA.validateAsync(data, {
		abortEarly: false,
	})
}

// Tìm người dùng theo ID
const findOneById = async (userId) => {
	try {
		return await GET_DB().collection(USERS_COLLECTION_NAME).findOne({ _id: userId })
	} catch (error) {
		throw new Error(error)
	}
}

// Tìm người dùng theo email
const findOneByEmail = async (email, includePassword = false) => {
	const projection = includePassword ? {} : { password: 0 } // Nếu includePassword là true thì không loại bỏ trường password
	try {
		return await GET_DB().collection(USERS_COLLECTION_NAME).findOne(
			{ email: email },
			{
				projection,
			},
		)
	} catch (error) {
		throw new Error(error)
	}
}

// Hàm đăng ký người dùng
const register = async (data) => {
	const saltRounds = 10
	try {
		// Xác thực dữ liệu đầu vào
		const validData = await validateBeforeCreate(data)

		// Kiểm tra xem email đã tồn tại chưa
		if (await findOneByEmail(validData.email)) {
			throw new Error('Email already exists')
		}

		const hashedPassword = await bcrypt.hash(validData.password, saltRounds)
		validData.password = hashedPassword
		// Tạo người dùng mới trong cơ sở dữ liệu
		const createUser = await GET_DB().collection(USERS_COLLECTION_NAME).insertOne(validData)

		return createUser
	} catch (error) {
		throw new Error(error)
	}
}

const login = async (data) => {
	try {
		const user = await findOneByEmail(data.email, true)

		if (!user) {
			throw new Error('Email not found')
		}

		const match = await bcrypt.compare(data.password, user.password)

		if (!match) {
			throw new Error('Password is incorrect')
		}

		return user
	} catch (error) {
		throw new Error(error)
	}
}

const getAll = async () => {
	const result = await GET_DB().collection(USERS_COLLECTION_NAME).find().toArray()

	return result
}

export const authModel = {
	register,
	findOneById,
	login,
	getAll,
}
