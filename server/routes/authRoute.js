import express from 'express'
const router = express.Router();
import { signup, login, logout, getMe } from '../controllers/authController.js';
import protectRoute from '../middlewares/protectRoute.js';

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/me",protectRoute, getMe)

export default router