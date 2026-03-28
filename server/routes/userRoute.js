import express from 'express'
import protectRoute from '../middlewares/protectRoute.js'
import {followUnfollow, getProfile, getSuggestedUser, updateUser} from '../controllers/userController.js'
const router = express.Router()

router.get("/profile/:username",protectRoute ,getProfile)
router.post("/follow/:id",protectRoute ,followUnfollow)
router.get("/suggested", protectRoute, getSuggestedUser)
router.post("/update",protectRoute, updateUser)


export default router