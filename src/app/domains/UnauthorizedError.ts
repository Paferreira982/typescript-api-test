/**
 * @author Pedro Augusto
 * @description Define a personalized exception clasule for unauthorized condition.
 */
class UnauthorizedError extends Error {
  constructor (msg: string) {
    super(msg)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export default UnauthorizedError
