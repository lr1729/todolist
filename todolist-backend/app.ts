import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from "./logger";
import { authMiddleware } from './middleware';
import { generateToken, verifyToken, hashPassword, verifyPassword } from './auth';

const app = express();
require('dotenv').config();
const port = process.env.PORT;

app.use(cors());
app.options('*', cors());

app.get( "/", ( req, res ) => {
    res.send( "This is the todolist API!" );
});

// Parse JSON bodies
app.use(bodyParser.json());

interface RequestWithUser extends Request {
  user?: {
    userId: number;
  };
}

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
};

app.use(errorHandler);

app.listen( port, () => {
    logger.debug( `server started at port: ${ port }` );
});

var usersRouter = require('./routes/users');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRouter);
