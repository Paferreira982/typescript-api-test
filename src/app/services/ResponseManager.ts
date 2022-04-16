import { Response } from 'express'
import { ISimpleReponse } from '../interfaces/IRespose'
import log from './Logger'

class ResponseManager {
  protected simpleResponse (res: Response, object: ISimpleReponse) : Response {
    log.info(`[${this.constructor.name}] ${object.message}`)

    return res.json({
      message: object.message,
      status: object.status
    }).status(object.status).end()
  }
}

export default ResponseManager
