import Role from '../models/Role'
import ResponseManager from '../domains/ResponseManager'
import { Request, Response } from 'express'

class RoleController extends ResponseManager {
  public async findAll (req: Request, res: Response): Promise<Response> {
    const roles = await Role.findAll()
    if (roles && roles.length > 0) { return res }
  }
}

export default new RoleController()
