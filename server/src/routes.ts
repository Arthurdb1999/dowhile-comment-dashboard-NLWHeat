import { Router } from 'express'
import { AuthenticateUserController } from './controllers/AuthenticateUserController'
import { CreateMessageController } from './controllers/CreateMessageController'
import { GetLastThreeMessagesController } from './controllers/GetLastThreeMessagesController'
import { UserProfileController } from './controllers/UserProfileController'
import { ensureAuthenticated } from './middleware/ensureAuthenticated'

const router = Router()

router.post('/authenticate', new AuthenticateUserController().handle)

router.post('/messages', ensureAuthenticated, new CreateMessageController().handle)

router.get('/messages/lastThree', new GetLastThreeMessagesController().handle)

router.get('/profile', ensureAuthenticated, new UserProfileController().handle)

export { router }