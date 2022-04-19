import { Response } from 'express'
import { ISimpleReponse } from '../interfaces/IRespose'
import { ValidationError } from 'yup'
import { UniqueConstraintError } from 'sequelize'
import UnauthorizedError from '../domains/UnauthorizedError'

// SERVICES //
import log from './Logger'

class ResponseManager {
  public simpleResponse (res: Response, object: ISimpleReponse): Response {
    log.debug(`[ResponseManager] ${object.message}`)

    // RESPOSTA SIMPLES DA API //
    return res.status(object.status).json({
      message: object.message,
      status: object.status
    }).end()
  }

  public badRequest (message: string): ValidationError {
    // EMITE UM 'THROW' PARA TRATAMENTO DE CASOS DE ERRO 'BAD REQUEST'
    return new ValidationError(message)
  }

  public handleError (res: Response, error: unknown): Response {
    // INSTANCIA DE ERRO DE VALIDAÇÃO DO YUP //
    if (error instanceof ValidationError) {
      return this.simpleResponse(res, {
        message: `BadRequest: ${error.errors}`,
        status: 400
      })
    }

    // INSTANCIA DE ERRO DO SEQUELIZE, CASO DE VIOLÃO DA CONSTRAINT UNIQUE //
    if (error instanceof UniqueConstraintError) {
      return this.simpleResponse(res, {
        message: `BadRequest: ${error.errors[0].message}`,
        status: 400
      })
    }

    if (error instanceof UnauthorizedError) {
      return this.simpleResponse(res, {
        message: `Unauthorized: ${error.message}`,
        status: 401
      })
    }

    // INSTANCIA DE ERRO DESCONHECIDA //
    log.error(`[UserController] ${error}`)
    return this.simpleResponse(res, {
      message: 'Internal server error',
      status: 500
    })
  }
}

export default new ResponseManager()
