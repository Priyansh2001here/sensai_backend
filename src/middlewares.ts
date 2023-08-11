import { NextFunction, Request, Response } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import ErrorResponse from './interfaces/ErrorResponse';
import { ZodError } from 'zod';
import { RequestValidator } from './interfaces/RequestValidator';
import { SECRET_KEY } from '.';
import { JWTSign } from './interfaces/JwtSign';
import {findById} from './api/users/user.service';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}


export const validationHandler = (validators: RequestValidator) => {

  return async (req: Request, res: Response, next: NextFunction) => {

    try {

      if (validators.body)
        req.body= await validators.body.parseAsync(req.body);
      
        next();
      }

      catch (error) {

        if (error instanceof ZodError){
          res.status(400);
      }

      next(error)
    }
  }
}


export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
  
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return next()
    }
 
    const decoded = jwt.verify(token, SECRET_KEY) as JWTSign;
    req.user = await findById(parseInt(decoded.id));

    next();
}