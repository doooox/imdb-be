import { NextFunction, Request, Response } from 'express';
import { responseMessage } from '../../utils/helpers';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    next();
  } else {
    responseMessage(401, res, 'User not authenticated!');
  }
};

export const isNotAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    next();
  } else {
    responseMessage(403, res, 'User already authenticated');
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user.isAdmin) {
    next();
  } else {
    responseMessage(403, res, 'You are not an admin');
  }
};
