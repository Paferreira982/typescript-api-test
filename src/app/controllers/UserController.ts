import { Request, Response } from 'express'
import { object, string, ObjectSchema, array } from 'yup'
import { IUser } from '../interfaces/IUser'
import log from '../services/Logger'
import ResponseManager from '../services/ResponseManager'

import User from '../domains/User'
import Role from '../domains/Role'

class UserController {
  public async create (req: Request, res: Response) : Promise<Response> {
    log.debug('[UserController] Executing create method.')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const schema: ObjectSchema<IUser> = object({
      name: string().required(),
      username: string().required(),
      password: string().required(),
      email: string().notRequired(),
      telephone: string().notRequired(),
      roles: array().of(string()).notRequired()
    })

    const body = req.body
    let roles : Role[]

    try {
      // VALIDA O SCHEMA DESCRITO ACIMA //
      await schema.validate(body)

      if (body.roles) {
        for (const i in body.roles) {
          const name = body.roles[i]
          const role = await Role.findOne({ where: { name: name } })

          if (!role) throw ResponseManager.badRequest(`the role '${name}' does not exist`)

          if (!roles) roles = [role]
          else roles.push(role)
        }
      }

      await User.create(body).then((user) => {
        if (roles && roles.length > 0) user.setRoles(roles)
      })

      return ResponseManager.simpleResponse(res, {
        message: `User ${body.username} created with success.`,
        status: 201
      })
    } catch (error: unknown) {
      return ResponseManager.handleError(res, error)
    }
  }

  //   public findAll (req: Request, res: Response) : void {

  //   }

  //   public save (req: Request, res: Response) : void {

  //   }

  //   public delete (req: Request, res: Response) : void {

//   }
}

export default new UserController()
