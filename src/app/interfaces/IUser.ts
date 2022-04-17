// INTERFACE PARA AUXÍLIO DE MÉTODOS DE USER //
export interface IUser {
    id?: number
    name: string
    username: string
    password: string
    email?: string
    telephone?: string
    roles?: string[]
}

// INTERFACE PARA AUXÍLIO NA CONSTRUÇÃO DE MÉTODOS DE UPDATE DE USER //
export interface IUserUpdate {
    name?: string
    username?: string
    password?: string
    email?: string
    telephone?: string
    roles?: string[]
}
