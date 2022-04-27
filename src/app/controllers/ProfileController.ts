import { Request, Response } from 'express'
import { object, string, ObjectSchema, number, array } from 'yup'

import { IController } from '../domains/interfaces/IController'
import { IProfile } from '../domains/interfaces/IProfile'

import log from '../services/Logger'
import ResponseManager from '../services/ResponseManager'

import User from '../models/User'
import Profile from '../models/Profile'
import Action from '../models/Action'

/**
 * @author Pedro Augusto
 * @description Managment of profile's request and response.
 */
class ProfileController implements IController {
  /**
  * @description Persists an entity in the database.
  * @returns Return a payload of a simple response.
  */
  public async create (req: Request, res: Response): Promise<Response> {
    log.debug('[ProfileController] Executing create endpoint.')

    const body = req.body
    let profile: Profile

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const schema: ObjectSchema<IProfile> = object({
      name: string().required(),
      actions: array().of(string()).notRequired()
    })

    try {
      await schema.validate(body)

      const name = body.name
      profile = await Profile.findOne({ where: { name: name } })

      if (profile) throw ResponseManager.badRequest(`the profile '${name}' already exists.`)

      profile = Profile.build({ name: name })
      await profile.save()

      if (body.actions) {
        body.actions.forEach(async actionName => {
          const action = await Action.findOne({ where: { name: actionName } })
          if (!action) throw ResponseManager.badRequest(`the action '${actionName}' does not exist.`)

          await profile.setActions(action)
        })
      }

      // DELEGA RESPOSTA DE CASO BEM SUCEDIDO PARA O SERVICE //
      return ResponseManager.simpleResponse(res, {
        message: `Profile '${name}' created with success.`,
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
    log.debug('[ProfileController] Executing update endpoint.')

    const body = req.body

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const schema: ObjectSchema<IProfile> = object({
      id: number().required().strict(),
      name: string().notRequired(),
      actions: array().of(string()).notRequired()
    })

    try {
      await schema.validate(body)

      const profile = await Profile.findByPk(body.id)
      if (!profile) throw ResponseManager.badRequest(`the profile with id = ${body.id}, does not exist.`)

      // ATUALIZA O USUÁRIO MENCIONADO COM OS PARÂMETROS ENVIADOS //
      await Profile.findByPk(body.id, { include: Action }).then(async (profile) => {
        await profile.update(body)

        if (body.actions) {
          await profile.setActions([])
          body.actions.forEach(async actionName => {
            const action = await Action.findOne({ where: { name: actionName } })
            if (!action) throw ResponseManager.badRequest(`the action '${actionName}' does not exist.`)

            await profile.setActions(action)
          })
        }
      })

      return ResponseManager.simpleResponse(res, {
        message: `Profile ${body.id} updated with success.`,
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

export default new ProfileController()
