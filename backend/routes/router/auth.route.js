import express from 'express'
import { createAccount } from '../../controllers/auth.controller.js'

const authRouter=express.Router()

authRouter.post('/register', createAccount)

export default authRouter