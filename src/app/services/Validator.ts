import { Request, Response } from 'express'

import JwtSecurity from './security/JwtSecurity'
import User from '../models/User'
import Profile from '../models/Profile'
import Action from '../models/Action'

class Validator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async validateRequest (req: Request, res: Response, next: any) : Promise<Response<any, Record<string, any>>> {
    const token = req.headers['x-access-token']
    if (!token) return res.status(401).json({ status: 401, message: 'Unauthorized: You need to be autenticated to access this endpoint.' }).end()

    const decoded = JwtSecurity.verify(token)
    if (typeof decoded === 'string') { return res.status(401).json({ status: 401, message: 'Unauthorized: Jwt token is invalid.' }).end() }

    const verifyPermition = async (userId: number): Promise<boolean> => {
      const user = await User.findByPk(userId)
      if (!user) return false

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const profile = await Profile.findByPk(user.ProfileId, { include: Action })
      let hasPermition = false

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      profile.Actions.forEach(action => {
        if (action.path === req.baseUrl) {
          hasPermition = true
        }
      })

      return hasPermition
    }

    if (!await verifyPermition(decoded.userId)) {
      return res.status(403).json({ status: 403, message: 'Forbiden: You dont have access to this endpoint.' })
    }

    next()
  }
}

export default new Validator()
