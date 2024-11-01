import express from 'express'

import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/').post(boardValidation.createNew, boardController.createNew)
Router.route('/favourite').put(boardValidation.addFavourite, boardController.addFavourite)

Router.route('/all/:userId').get(boardController.getAll)

Router.route('/:id').get(boardController.getDetails).put(boardValidation.update, boardController.update)
Router.route('/recently/:boardId').put(boardController.updateViewed)

Router.route('/supports/moving_card').put(
	boardValidation.moveCardToDifferentColumn,
	boardController.moveCardToDifferentColumn,
)

export const boardRoute = Router
