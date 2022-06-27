import AuthService from '@src/services/auth';
import { NextFunction, Response, Request } from 'express';

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction,
): void {
  const token = req.headers?.['x-access-token'];
  try {
    const decoded = AuthService.decodeToken(token as string);
    req.decoded = decoded;
  } catch (e: unknown) {
    res.status?.(401).send({
      code: 401,
      error: (e as Error).message,
    });
  }
  next();
}
