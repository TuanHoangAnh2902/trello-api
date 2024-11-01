import express from 'express'
import { recentlyViewedBoardsController } from '~/controllers/recentlyViewedBoardsController'
import { recentlyViewedBoardsValidation } from '~/validations/recentlyViewedBoardsValidation'

const Router = express.Router()

Router.route('/').post(
	recentlyViewedBoardsValidation.recentlyViewedBoards,
	recentlyViewedBoardsController.recentlyViewedBoards,
)

Router.route('/:userId').get(
	recentlyViewedBoardsValidation.getRecentViewedById,
	recentlyViewedBoardsController.getRecentViewedById,
)

export const recentlyViewedBoardsRoute = Router
