import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Response, Request } from 'express';
import { User } from '@src/models/user';
import { BaseController } from '.';
import mongoose from 'mongoose';
import AuthService from '@src/services/auth';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(
        res,
        error as mongoose.Error.ValidationError | Error,
      );
    }
  }

  @Post('authenticate')
  public async authenticate(
    req: Request,
    res: Response,
  ): Promise<Response | void> {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found!',
      });
    }

    if (!(await AuthService.comparePasswords(password, user.password))) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Password does not match',
      });
    }

    const token = AuthService.generateToken(user.toJSON());
    res.status(200).send({ token: token });
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response | void> {
    const email = req.decoded ? req.decoded.email : undefined;
    const user = await User.findOne({ email: email });

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found',
      });
    }
    return res.status(200).send({ user });
  }
}
