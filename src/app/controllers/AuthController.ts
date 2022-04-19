// DEPENDENCIES //
import { object, string, ObjectSchema } from 'yup'
import { Request, Response } from 'express'
import { IAuth } from '../interfaces/IUser'

// SERVICES //
import PasswordSecurity from '../services/security/PasswordSecurity'
import ResponseManager from '../services/ResponseManager'
import JwtSecurity from '../services/security/JwtSecurity'

// DOMAINS //
import User from '../domains/User'
import Role from '../domains/Role'

class AuthController {
  public async login (req: Request, res: Response): Promise<Response> {
    const body = req.body

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const schema: ObjectSchema<IAuth> = object({
      username: string().required(),
      password: string().required()
    })

    try {
      // VALIDA O SCHEMA DESCRITO ACIMA //
      await schema.validate(body)

      const user = await User.findOne({ where: { username: body.username }, include: Role })
      if (!user || !PasswordSecurity.verify(body.password, user.password)) throw ResponseManager.badRequest('wrong username or password.')

      const token = JwtSecurity.sign({ userId: user.id })

      return res.status(200).json({
        token: token,
        message: 'Success: Login successful',
        user: user.username
      })
    } catch (error: unknown) {
      // DELEGA TRATAMENTO DE CASOS DE ERRO PARA O SERVICE //
      return ResponseManager.handleError(res, error)
    }
  }
}

export default new AuthController()
