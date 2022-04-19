// DEPENDENCIES //
import bcrypt from 'bcrypt'

/**
 * @author Pedro Augusto
 * @description Managment of encripty and decode of passwords.
 */
class PasswordSecurity {
    private salt: number

    public constructor () {
      this.salt = parseInt(process.env.BCRYPT_SALT) || 8
    }

    /**
    * @description Encript a string into a hashed password.
    * @param password The user's password.
    * @returns Returns a hashed password.
    */
    public hash (password: string): string {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(this.salt))
    }

    /**
    * @description Verify if the password is the same as the hashed one.
    * @param password The user's password.
    * @param hashedPassword The user's hashed password.
    * @returns Returns true if they are equivalent.
    */
    public verify (password: string, hashedPassword: string): boolean {
      return bcrypt.compareSync(password, hashedPassword)
    }
}

export default new PasswordSecurity()
