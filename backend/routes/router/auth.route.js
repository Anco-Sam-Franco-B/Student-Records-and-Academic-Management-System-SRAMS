import express from 'express'
import { createAccount, getCurrentUser, login, logout } from '../../controllers/auth.controller.js'
import { authenticate } from '../../middleware/auth.middleware.js'

const authRouter=express.Router()

authRouter.post('/register', createAccount)                     //Create new account into SRAMS
authRouter.post('/login', login)                                //Login into your account for SRAMS
authRouter.post('/logout', logout)                              //Logout in SRAMS
authRouter.get('/me', authenticate, getCurrentUser)        //Get your profile in SRAMS

export default authRouter