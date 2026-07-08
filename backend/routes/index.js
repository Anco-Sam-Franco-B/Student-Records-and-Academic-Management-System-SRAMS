import expres from 'express'
import BackupRouter from './backupRoutes.js'
import authRouter from './router/auth.route.js'

const sramsRoutes=expres.Router()

//===== DATABASE BACKUP ROUTES
sramsRoutes.use('/backups', BackupRouter)

//===== AUTH ROUTES
sramsRoutes.use('/auth', authRouter)

export default sramsRoutes