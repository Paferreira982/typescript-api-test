import { Request, Response } from 'express'
import { object, string, ObjectSchema, number } from 'yup'

import { IController } from '../domains/interfaces/IController'
import { IUser } from '../domains/interfaces/IUser'

import log from '../services/Logger'
import ResponseManager from '../services/ResponseManager'

import User from '../models/User'
import Profile from '../models/Profile'

/**
 * @author Pedro Augusto
 * @description Managment of user's request and response.
 */
class UserController implements IController {
  /**
  * @description Persists an entity in the database.
  * @returns Return a payload of a simple response.
  */
  public async create (req: Request, res: Response): Promise<Response> {
    log.debug('[UserController] Executing create endpoint.')

    const body = req.body
    let profile: Profile

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const schema: ObjectSchema<IUser> = object({
      name: string().required().strict(),
      username: string().required(),
      password: string().required(),
      email: string().notRequired(),
      telephone: string().notRequired(),
      profile: string().strict().notRequired()
    })

    try {
      // VALIDA O SCHEMA DESCRITO ACIMA //
      await schema.validate(body)

      if (body.profile) {
        const name = body.profile
        profile = await Profile.findOne({ where: { name: name } })

        // DELEGA RESPOSTA DE ERRO PARA O SERVICE CASO NÃO ENCONTRE A ROLE MENCIONADA //
        if (!profile) throw ResponseManager.badRequest(`the profile '${name}' does not exist`)
      }

      // CRIA O USUÁRIO NO BANCO DE DADOS DE ACORDO COM OS PARÂMETROS PASSADOS //
      await User.create(body).then((user) => {
        if (profile) user.setProfile(profile)
      })

      // DELEGA RESPOSTA DE CASO BEM SUCEDIDO PARA O SERVICE //
      return ResponseManager.simpleResponse(res, {
        message: `User ${body.username} created with success.`,
        status: 201
      })
    } catch (error: unknown) {
      // DELEGA TRATAMENTO DE CASOS DE ERRO PARA O SERVICE //
      return ResponseManager.handleError(res, error)
    }
  }

  /**
  * @description Updates an existing entity in the database.
  * @returns Return a payload of a simple response.
  */
  public async update (req: Request, res: Response): Promise<Response> {
    log.debug('[UserController] Executing update endpoint.')

    const body = req.body

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const schema: ObjectSchema<IUser> = object({
      id: number().required().strict(),
      name: string().notRequired().strict(),
      username: string().notRequired(),
      password: string().notRequired(),
      email: string().notRequired(),
      telephone: string().notRequired(),
      profile: string().strict().notRequired()
    })

    try {
      // VALIDA O SCHEMA DESCRITO ACIMA //
      await schema.validate(body)

      const user = await User.findOne({ where: { id: body.id } })
      // DELEGA RESPOSTA DE ERRO PARA O SERVICE CASO NÃO ENCONTRE O USUÁRIO MENCIONADO //
      if (!user) throw ResponseManager.badRequest(`the user with id = ${body.id}, does not exist`)

      // ATUALIZA O USUÁRIO MENCIONADO COM OS PARÂMETROS ENVIADOS //
      await User.findOne({ where: { id: body.id }, include: Profile }).then(async (user) => {
        await user.update(body)

        if (body.profile) {
          const profile = await Profile.findOne({ where: { name: body.profile } })
          if (!profile) throw ResponseManager.badRequest(`the profile '${body.profile}' does not exist`)

          await user.setProfile(profile)
        }
      })

      // DELEGA RESPOSTA DE CASO BEM SUCEDIDO PARA O SERVICE //
      return ResponseManager.simpleResponse(res, {
        message: `User ${(body.username) ? body.username : body.id} updated with success.`,
        status: 200
      })
    } catch (error: unknown) {
      // DELEGA TRATAMENTO DE CASOS DE ERRO PARA O SERVICE //
      return ResponseManager.handleError(res, error)
    }
  }

  /**
  * @description Find an existing entity in the database.
  * @param req Recive a filter from request, otherwise returns all entitys.
  * @returns Return an list of user or an user if has an id param.
  */
  public async find (req: Request, res: Response): Promise<Response> {
    log.debug('[UserController] Executing find endpoint.')
    try {
      const params = req.query
      const response = await User.findAll({ where: params, include: Profile })

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!response || response.length === 0) throw ResponseManager.badRequest(`User with ${JSON.stringify(params).replaceAll('"', '').replaceAll('{', '').replaceAll('}', '').replaceAll(':', ': ')}, does not exist`)

      return res.status(200).json(response).end()
    } catch (error: unknown) {
      // DELEGA TRATAMENTO DE CASOS DE ERRO PARA O SERVICE //
      return ResponseManager.handleError(res, error)
    }
  }

  /**
  * @description Delete an existing entity in the database.
  * @param req Require an id param inside the request.
  * @returns Return a payload of a simple response.
  */
  public async delete (req: Request, res: Response): Promise<Response> {
    log.debug('[UserController] Executing delete endpoint.')
    try {
      const id = req.params.id
      const deleted = (await User.destroy({ where: { id: id } }) > 0)

      // DELEGA RESPOSTA DE ERRO PARA O SERVICE CASO NÃO ENCONTRE O USUÁRIO MENCIONADO //
      if (!deleted) throw ResponseManager.badRequest(`User with id: ${id}, does not exist`)

      // DELEGA RESPOSTA DE CASO BEM SUCEDIDO PARA O SERVICE //
      return ResponseManager.simpleResponse(res, {
        message: `User with ${id} deleted with success.`,
        status: 200
      })
    } catch (error: unknown) {
      // DELEGA TRATAMENTO DE CASOS DE ERRO PARA O SERVICE //
      return ResponseManager.handleError(res, error)
    }
  }
}

export default new UserController()
