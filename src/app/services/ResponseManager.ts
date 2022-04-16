import { Response } from 'express'
import { ISimpleReponse } from '../interfaces/IRespose'
import log from './Logger'

class ResponseManager {
  public simpleResponse (res: Response, object: ISimpleReponse) : Response {
    log.info(`[ResponseManager] ${object.message}`)

    return res.status(object.status).json({
      message: object.message,
      status: object.status
    }).end()
  }
}

export default ResponseManager
