import bcrypt from 'bcrypt'

class PasswordSecurity {
    private salt: number

    public constructor () {
      this.salt = parseInt(process.env.BCRYPT_SALT) || 8
    }

    public hash (password: string): string {
      // ENCRIPTA UMA SENHA PARA MAIOR SEGURANÇA NA BASE DE DADOS //
      return bcrypt.hashSync(password, bcrypt.genSaltSync(this.salt))
    }

    public verify (password: string, hashedPassword: string): boolean {
      // COMPARA UMA STRING NÃO ENCRIPTADA COM SUA RESPECTIVA STRING ENCRIPTADA DA BASE //
      return bcrypt.compareSync(password, hashedPassword)
    }
}

export default new PasswordSecurity()
