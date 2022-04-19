// DEPENDENCIES //
import { Request, Response } from 'express'

// SERVICES //
import ResponseManager from '../services/ResponseManager'

// DOMAINS //
import Role from '../domains/Role'

class RoleController {
  public async findAll (req: Request, res: Response): Promise<Response> {
    const roles = await Role.findAll()
    if (roles && roles.length > 0) { return res }
  }
}

export default new RoleController()
