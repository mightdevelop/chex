import { Response as ExpressResponse } from 'express'
import { UserFromRequest } from './user-from-request'

export interface Response extends ExpressResponse {
    user: UserFromRequest
}