import bcrypt from 'bcrypt'

class PasswordSecurity {
    private salt : number

    public constructor () {
      this.salt = parseInt(process.env.BCRYPT_SALT) || 8
    }

    public hash (password : string) : string {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(this.salt))
    }

    public verify (password : string, hashedPassword : string) : boolean {
      return bcrypt.compareSync(password, hashedPassword)
    }
}

export default new PasswordSecurity()
