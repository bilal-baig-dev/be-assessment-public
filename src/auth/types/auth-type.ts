import { Request } from 'express';

export interface IAuthenticatedUserPayload {
  id: number;
}

export interface IAuthenticatedUserRequest extends Request {
  user: IAuthenticatedUserPayload;
}
