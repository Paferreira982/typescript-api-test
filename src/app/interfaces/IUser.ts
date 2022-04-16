export interface IUser {
    id?: number
    name: string
    username: string
    password: string
    email?: string
    telephone?: string
    roles?: string[]
}

export interface IUserUpdate {
    name?: string
    username?: string
    password?: string
    email?: string
    telephone?: string
    roles?: string[]
}
