/* eslint-disable @typescript-eslint/no-require-imports */
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import sdk, { ID } from 'node-appwrite';
import { createWorker } from 'tesseract.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import twilio from 'twilio';
const { InputFile } = require('node-appwrite/file');
const client = new sdk.Client();
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('680d3933003c3924209a')
  .setKey(`${process.env.APPWRITE_SECRET}`);

const storage = new sdk.Storage(client);
export const getAllImages = async (req: Request, res: Response) => {
  try {
    const allresults = await prisma.image.findMany();
    if (allresults.length > 0) {
      res.status(200).json({
        status: 'success',
        data: {
          imagedetails: allresults,
        },
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'no images found , please use this application first',
        data: {
          images: allresults,
        },
      });
    }
  } catch (e) {
    console.log('error occured while implementing get all images feature ', e);
  }
};
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.image.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: 'success',
      data: '',
    });
  } catch (e) {
    console.log('error occured while implementing delete a image feature ', e);
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const imageId: number = parseInt(req.params.id);
    const imagedetails = await prisma.image.findUnique({
      where: {
        id: imageId,
      },
    });

    res.status(200).json({
      imagedetail: imagedetails,
    });
  } catch (error) {
    console.log(
      'error occured while implementing the get image functionality ',
      error,
    );
  }
};

export const fileUpload = async (req: Request, res: Response) => {
  //setup the appwrite account and configuration with the api keys since we will be using appwrite-admin sdk
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('no token found in headers ');
    }
    const decodedId = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    console.log('the file received is: ', req.file);
    const BlobFile = req.file?.buffer;
    const nodeFile = InputFile.fromBuffer(BlobFile, req.file?.originalname);
    const result = await storage.createFile(
      '680db7e300386f107c0b',
      ID.unique(),
      nodeFile,
    );

    // now store into db about image details ,first check what each row of the user table needs

    //first find the user

    const user = await prisma.user.findUnique({
      where: {
        id: decodedId.id,
      },
    });

    if (!user) {
      throw new Error('user is not found');
    }

    //create a new image document

    const imageFile = await prisma.image.create({
      data: {
        name: req.file?.originalname || '',
        ownerId: user?.id,
      },
    });

    res.json({
      result:
        'file uploaded successfully  , check the appwrite storage and saved to db successfully',
      data: {
        result,
        imagedetails: imageFile,
      },
    });
  } catch (e) {
    console.log('error occured while implementing fileUpload: ', e);
  }
};

export const extracttext = async (req: Request, res: Response) => {
  //here the req.file?.buffer will give the buffer of the file
  try {
    if (!req.file?.buffer) {
      throw new Error('please provide a file lawde');
    }
    const worker = await createWorker('eng');
    const data = await worker.recognize(req.file.buffer);
    //console.log('the data is ', data);
    res.status(200).json({
      status: 'success',
      data: data.data.text,
    });
  } catch (e) {
    console.log('error occured while extracting the text: ', e);
  }
};

export const sendmessage = async (req: Request, res: Response) => {
  try {
    const client = twilio(process.env.ACCOUNTSID, process.env.TWILIOAUTHTOKEN);
    const result = await client.messages.create({
      body: req.body.messagetext,
      to: '+91' + req.body.to, // number in string
      from: process.env.TWILIONUMBER,
    });

    res.status(200).json({
      status: 'success',
      result,
    });
  } catch (e) {
    console.log('error occured while sending the text from server ', e);
  }
};
