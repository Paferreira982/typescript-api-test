// DEPENDENCIES //
import { Request, Response } from 'express'

/**
 * @author Pedro Augusto
 * @description Standard interface for entity controllers.
 */
export interface IController {
    create(req: Request, res: Response): Promise<Response>
    update(req: Request, res: Response): Promise<Response>
    find(req: Request, res: Response): Promise<Response>
    delete(req: Request, res: Response): Promise<Response>
}
