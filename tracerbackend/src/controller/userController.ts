//here we will only update the user details like delete the user , change its profile image , change its info
//fot https we have to set up tls , so what we will be using is http://
//localhost:3000
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';

import prisma from '../lib/prisma';
export const signoutUser = async (req: Request, res: Response) => {
  const token = req.cookies?.token;
  try {
    if (!token) {
      throw new Error('the request does not have token cookie');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    //other way without using is throw error for undefined JWT_SECRET value
    //we had to write to make the decoded type correct

    await prisma.user.delete({
      where: {
        id: decoded.id,
      },
    });

    res.status(200).json({
      status: 'success',
      data: '',
    });
  } catch (error) {
    console.log('error occured while implmenting signout user ', error);
  }
};
