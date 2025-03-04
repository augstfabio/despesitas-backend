import express from 'express';
import { login, me, register } from '../controllers/AuthController.js';



export const auth = express.Router();

auth.post('/register', register);
auth.post ('/login', login)
auth.get('/me', me)


