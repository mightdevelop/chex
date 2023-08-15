import { Request as ExpressRequest } from 'express'
import { UserFromRequest } from './user-from-request'

export interface Response extends ExpressRequest {
    user: UserFromRequest
}