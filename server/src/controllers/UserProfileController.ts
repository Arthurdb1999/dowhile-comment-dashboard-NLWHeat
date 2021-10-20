import { Request, Response } from 'express'
import { UserProfileService } from '../services/UserProfileService'

class UserProfileController {

    async handle(request: Request, response: Response) {
        const { user_id } = request
        const service = new UserProfileService()

        try {
            const result = await service.execute(user_id)

            return response.json(result)
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    }
}

export { UserProfileController }