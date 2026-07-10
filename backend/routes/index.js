import express from 'express'
import BackupRouter from './backupRoutes.js'
import authRouter from './router/auth.route.js'
import dataRouter from './router/data.route.js'
import userRouter from './router/user.route.js'

const sramsRoutes=express.Router()

//===== DATABASE BACKUP ROUTES
sramsRoutes.use('/backups', BackupRouter)

//===== AUTH ROUTES
sramsRoutes.use('/auth', authRouter)

//===== DATA ROUTES
sramsRoutes.use('/data', dataRouter)

//===== USER ROUTES
sramsRoutes.use('/users', userRouter)


export default sramsRoutes