/**
 * @author Pedro Augusto
 * @description Default interface for user object methods.
 */
export interface IUser {
    id?: number
    name: string
    username: string
    password: string
    email?: string
    telephone?: string
    roles?: string[]
}

/**
 * @author Pedro Augusto
 * @description Standard interface for authentication methods.
 */
export interface IAuth {
    username: string,
    password: string
}
