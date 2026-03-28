import express from 'express'
import protectRoute from '../middlewares/protectRoute.js'
import { deleteNotification, getNotification } from '../controllers/notificationController.js'

const router =  express.Router()

router.get("/",protectRoute, getNotification)
router.delete("/",protectRoute, deleteNotification)

export default router