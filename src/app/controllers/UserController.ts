import { Request, Response } from 'express'
import { object, string, ObjectSchema } from 'yup'
import log from '../services/Logger'
import { IUser } from '../interfaces/IUser'
import User from '../domains/User'
import ResponseManager from '../services/ResponseManager'

class UserController {
  public async create (req: Request, res: Response) : Promise<Response> {
    log.debug('[UserController] Executing create method.')

    const service = new ResponseManager()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const schema: ObjectSchema<IUser> = object({
      name: string().required(),
      username: string().required(),
      password: string().required(),
      email: string().nullable(),
      telephone: string().nullable()
    })

    try {
      await schema.validate(req.body)
      await User.create(req.body)
      return service.simpleResponse(res, {
        message: `User ${req.body.username} created with success.`,
        status: 201
      })
    } catch (err: unknown) {
      if (err.toString().includes('ValidationError')) {
        return service.simpleResponse(res, {
          message: `${err}`.replace('ValidationError:', 'BadRequest:'),
          status: 400
        })
      }
      log.error(`[UserController] ${err}`)
      return service.simpleResponse(res, {
        message: `Internal server error: ${err}`,
        status: 500
      })
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
