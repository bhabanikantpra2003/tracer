/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});
//using .strict
const comparePassword = async (
  clientPassword: string,
  userPassword: string,
) => {
  return await bcrypt.compare(clientPassword, userPassword);
};
const createtoken = (id: any) => {
  const secret: string = process.env.JWT_SECRET as string;
  const token = jwt.sign({ id }, secret, {
    expiresIn: '1h',
  });
  return token;
};

const sendtoken = (user: any, statuscode: number, res: Response) => {
  const jwttoken = createtoken(user.id);
  //console.log('setting cookie jwt:', jwttoken);
  res.status(201).json({
    status: 'success',
    user,
    token: jwttoken,
  });
};

export const login = async (req: Request, res: Response) => {
  //first what will the user will give - name and email
  //check by email  if such user exist , if exist then proceed and if not then return error
  //if the email exists , then create a token for him and thats it
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!existingUser) {
    return console.log('i will send the error later');
  }
  if (await comparePassword(req.body.password, existingUser.password)) {
    sendtoken(existingUser, 200, res);
  } else {
    return console.log("password didn't match");
  }

  //here catch the error and send it in the form of response json format
};

export const signup = async (req: Request, res: Response) => {
  // eslint-disable-next-line prefer-const
  let { name, email, password } = req.body;

  try {
    const validateuser = userSchema.parse({ name, email, password });
    //parse vs safeparse
    password = await bcrypt.hash(password, 12);
    validateuser.password = password;
    const user = await prisma.user.create({
      data: validateuser,
    });

    sendtoken(user, 201, res);
  } catch (e) {
    console.log('error found while implementing signup ', e);
  }
};
export const forgetpassword = async (req: Request, res: Response) => {
  //what we have to do
  //check if the user with that email exists and only proceed if the user exits
  //now we have to send an email on the client email containing the link to the resetpassword end point
  //so here create the link and send the email
  //okay with mailtrap and nodemailer email part is 90 percent done now only have to structure it in a file
  //now to create a link , we will create a token with crypto library and store it in the db and in the reset link confirm the link
  try {
    const validuser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (!validuser) {
      throw new Error('the user is not valid');
    }
    //create the token and store it in the db
    //create the token
    //hash the token
    //store it in the db
    const resettoken = crypto.randomBytes(32).toString('hex');
    const hashedresettoken = crypto
      .createHash('sha256')
      .update(resettoken)
      .digest('hex');

    await prisma.user.update({
      where: { email: req.body.email },
      data: {
        resettoken: hashedresettoken,
      },
    });

    //now have to create a url link that will have the endpoint to resetpassword token
    const url = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resettoken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${url}.\nIf you didn't forget your password, please ignore this email!`;

    //now send this url and message with nodemailer and mailtrap to test it
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    //now creating the mailoptions
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: `${validuser.name} <${validuser.email}>`,
      replyTo: validuser.email,
      subject: 'password recovery',
      text: message,
    };

    //now send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    //send the json and message
    res.status(200).json({
      status: 'success',
      message: 'email sent successfully',
    });
  } catch (e) {
    console.log('error while implementing the forget password: ', e);
  }
};
export const resetpassword = async (req: Request, res: Response) => {
  //get the token from the parameters
  //check the token and compare it with resettoken
  //if no token exist  or comparison fails then send error
  try {
    const hashedtoken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await prisma.user.findUnique({
      where: { resettoken: hashedtoken },
    });

    if (!user) {
      throw new Error('error happened at reset password endpoint');
    }
    const updateuser = await prisma.user.update({
      where: { resettoken: hashedtoken },
      data: {
        resettoken: undefined,
        password: req.body.password,
      },
    });

    sendtoken(updateuser, 200, res);
  } catch (e) {
    console.log(
      'error occured while implementing the reset password token: ',
      e,
    );
  }
};
export const updatepassword = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (!user) {
      throw new Error('user of such password does not exist');
    }
    const validpassowrd = await comparePassword(
      req.body.password,
      user?.password,
    );
    if (validpassowrd) {
      const updatepassword = await prisma.user.update({
        where: { email: user.email },
        data: {
          password: req.body.password,
        },
      });

      res.status(201).json({
        status: 'success',
        user: updatepassword,
      });
    } else {
      throw new Error('valid password is needed');
    }
  } catch (e) {
    console.log('error occured while implementing the update password', e);
  }
};

//validating via zod is done , now have to implemnet the signup
//signup
//take the user body
//validate using the zod
//create the obect
//hash the password and store it in the place of original password
//create the user in the db
//create and send a jwt token
//in the frontend before going to the main page of usagae check the token
export const userdetail = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('token from header is ', token);
    if (!token) {
      throw new Error('no token of name jwt exist');
    }

    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    res.status(200).json({
      status: 'success in getting user details',
      data: {
        user,
      },
    });
  } catch (e) {
    console.log('error happened while implementing userdetail ', e);
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized or Token missing',
    });
  }
};
