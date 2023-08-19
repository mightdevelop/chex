import { Request as ExpressRequest } from 'express'
import { UserFromRequest } from './user-from-request'

export interface Request extends ExpressRequest {
    user: UserFromRequest
}