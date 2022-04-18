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
