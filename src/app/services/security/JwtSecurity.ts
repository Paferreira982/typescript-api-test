import jwt, { JwtPayload } from 'jsonwebtoken'

class JwtSecurity {
    private secret : string
    private expiresIn : number | string

    constructor () {
      this.secret = process.env.JWT_SECRET || 'ritter@secret'
      this.expiresIn = process.env.JWT_EXPIRES || 600
    }

    public sign (payload: Record<string, unknown>): string {
      return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn })
    }

    public verify (token: string) : string | JwtPayload {
      return jwt.verify(token, this.secret)
    }
}

export default new JwtSecurity()
