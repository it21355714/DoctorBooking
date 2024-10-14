import express from 'express';
import  { signup, login } from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);

export default router;
