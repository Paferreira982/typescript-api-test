// DEPENDENCIES //
import { Request, Response } from 'express'

import JwtSecurity from './security/JwtSecurity'

class Validator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validateJWT (req: Request, res: Response, next: any) : void {
    const token = req.headers['x-access-token']
    // const response = JwtSecurity.verify(token.toString())

    // console.log(response)

    console.log('........................')
    console.log(req.baseUrl)

    // next()
    res.json(200).end()
  }
}

export default new Validator()
