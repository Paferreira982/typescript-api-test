import { Request, Response } from 'express'
import { object, string, ObjectSchema, array, number } from 'yup'
import { IController } from '../interfaces/IController'
import { Op } from 'sequelize'
import { IUser, IUserUpdate } from '../interfaces/IUser'
import log from '../services/Logger'
import ResponseManager from '../services/ResponseManager'

import User from '../domains/User'
import Role from '../domains/Role'

class UserController implements IController {
  public async create (req: Request, res: Response): Promise<Response> {
    log.debug('[UserController] Executing create endpoint.')

    const body = req.body
    let roles: Role[]

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const schema: ObjectSchema<IUser> = object({
      name: string().required().strict(),
      username: string().required(),
      password: string().required(),
      email: string().notRequired(),
      telephone: string().notRequired(),
      roles: array().of(string().strict()).notRequired()
    })

    try {
      // VALIDA O SCHEMA DESCRITO ACIMA //
      await schema.validate(body)

      // VERIFICA SE ROLES FOI PASSADO COMO PARÂMETRO DENTRO DO BODY //
      // SE SIM, PREENCHE UMA LISTA DE OBJETO 'ROLE' //
      if (body.roles) {
        for (const i in body.roles) {
          const name = body.roles[i]
          const role = await Role.findOne({ where: { name: name } })

          // DELEGA RESPOSTA DE ERRO PARA O SERVICE CASO NÃO ENCONTRE A ROLE MENCIONADA //
          if (!role) throw ResponseManager.badRequest(`the role '${name}' does not exist`)

          if (!roles) roles = [role]
          else roles.push(role)
        }
      }

      // CRIA O USUÁRIO NO BANCO DE DADOS DE ACORDO COM OS PARÂMETROS PASSADOS //
      await User.create(body).then((user) => {
        if (roles && roles.length > 0) user.setRoles(roles)
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
      roles: array().of(string().strict()).notRequired()
    })

    try {
      // VALIDA O SCHEMA DESCRITO ACIMA //
      await schema.validate(body)

      const user = await User.findOne({ where: { id: body.id } })
      // DELEGA RESPOSTA DE ERRO PARA O SERVICE CASO NÃO ENCONTRE O USUÁRIO MENCIONADO //
      if (!user) throw ResponseManager.badRequest(`the user with id = ${body.id}, does not exist`)

      // PREENCHE OBJETO DE REQUISIÇÃO DESCRITO PELA INTERFACE //
      const updatedUser: IUserUpdate = {}
      if (body.name) updatedUser.name = body.name
      if (body.username) updatedUser.username = body.username
      if (body.password) updatedUser.password = body.password
      if (body.email) updatedUser.email = body.email
      if (body.telephone) updatedUser.telephone = body.telephone
      if (body.roles) updatedUser.roles = body.roles

      // ATUALIZA O USUÁRIO MENCIONADO COM OS PARÂMETROS ENVIADOS //
      await User.findOne({ where: { id: body.id }, include: Role }).then(async (user) => {
        await user.update(updatedUser)

        const whereClasule = []
        if (updatedUser.roles) {
          for (const i in updatedUser.roles) {
            whereClasule.push({ name: updatedUser.roles[i] })
          }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const roles = await Role.findAll({ where: { [Op.or]: whereClasule } })
        await user.setRoles(roles)
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

  public async findAll (req: Request, res: Response): Promise<Response> {
    try {
      // BUSCA TODOS OS ELEMENTOS DA BASE SEM FILTRO //
      User.findAll().then((users) => {
        res.status(200).json(users).end()
      })
    } catch (error: unknown) {
      // DELEGA TRATAMENTO DE CASOS DE ERRO PARA O SERVICE //
      return ResponseManager.handleError(res, error)
    }
  }

  public async delete (req: Request, res: Response): Promise<Response> {
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
