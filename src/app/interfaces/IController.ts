import { Request, Response } from 'express'

// INTERFACE PARA AUXÍLIO NA CONSTRUÇÃO DE CLASSES DE CONTROLLER //
export interface IController {
    create(req: Request, res: Response): Promise<Response>
    update(req: Request, res: Response): Promise<Response>
    findAll(req: Request, res: Response): Promise<Response>
    delete(req: Request, res: Response): Promise<Response>
}
