// DEPENDENCIES //
import jwt, { JwtPayload } from 'jsonwebtoken'

/**
 * @author Pedro Augusto
 * @description Managment of jwt methods.
 */
class JwtSecurity {
    private secret : string
    private expiresIn : number | string

    constructor () {
      this.secret = process.env.JWT_SECRET || 'ritter@secret'
      this.expiresIn = process.env.JWT_EXPIRES || 600
    }

    /**
    * @description Capture a payload to codify in a jwt token.
    * @param payload User payload.
    * @returns Returns a jwt token.
    */
    public sign (payload: Record<string, unknown>): string {
      return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn })
    }

    /**
    * @description Captura a token and verify if its valid.
    * @param token A jwt token.
    * @returns Returns a string containing an error of a JwtPayload object.
    */
    public verify (token: string | string[]) : string | JwtPayload {
      if (token instanceof Array) token = token[0]

      let decoded: string | JwtPayload
      jwt.verify(token, this.secret, (err, payload) => {
        if (err) decoded = ''
        else decoded = payload
      })

      return decoded
    }
}

export default new JwtSecurity()
