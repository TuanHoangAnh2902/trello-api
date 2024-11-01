import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'
import { registerRoute } from './auth/registerRoute'
import { loginRoute } from './auth/loginRoute'
import authMiddleware from '~/middlewares/authMiddleware'
import { checkAuthRoute } from './auth/checkAuthRoute'
import { logoutRoute } from './auth/logoutRoute'
import { workSpaceRoute } from './workSpaceRoute'
import { recentlyViewedBoardsRoute } from './recentlyViewedBoardsRoute'
import { usersRoute } from './auth/usersRoute'

const Router = express.Router()

/**Check APIs v1 status */
Router.get('/status', (req, res) => {
	res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

/** workSpace API */
Router.use('/workspaces', workSpaceRoute)

/**Board APIs */
Router.use('/boards', boardRoute)

/**Columns APIs */
Router.use('/columns', authMiddleware, columnRoute)

/**Cards APIs */
Router.use('/cards', authMiddleware, cardRoute)

/** Register */
Router.use('/auth/register', registerRoute)

/** User */
Router.use('/users', usersRoute)

/** Login */
Router.use('/auth/login', loginRoute)

/**Logout */
Router.use('/auth/logout', logoutRoute)

Router.use('/auth/check', checkAuthRoute)

// recently viewed boards
Router.use('/viewed', recentlyViewedBoardsRoute)

export const APIs_V1 = Router
