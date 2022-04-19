// DEPENDENCIES //
import { Response } from 'express'
import { ValidationError } from 'yup'
import { UniqueConstraintError } from 'sequelize'

// INTERFACES //
import { ISimpleReponse } from '../interfaces/IRespose'

// SERVICES //
import log from './Logger'

// DOMAINS //
import UnauthorizedError from '../domains/UnauthorizedError'

/**
 * @author Pedro Augusto
 * @description Managment of common response and erros to API.
 */
class ResponseManager {
  /**
  * @description Produces a simple response to API's endpoints.
  * @param res The express response.
  * @param object An object from ISimpleResponse interface.
  * @returns Return a response to API.
  */
  public simpleResponse (res: Response, object: ISimpleReponse): Response {
    log.debug(`[ResponseManager] ${object.message}`)

    // RESPOSTA SIMPLES DA API //
    return res.status(object.status).json({
      message: object.message,
      status: object.status
    }).end()
  }

  /**
  * @description Produces an invalidation error instance for BadRequest clasule.
  * @param message A simple describe of the error.
  * @returns Returns a ValidationError instance from yup.
  */
  public badRequest (message: string): ValidationError {
    return new ValidationError(message)
  }

  /**
  * @description Handle the know error cases from API's endpoints.
  * @param res The express response.
  * @param error The error clasule from catch.
  * @returns Return a response to API.
  */
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
