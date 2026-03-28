import express from 'express'
import protectRoute from '../middlewares/protectRoute.js'
import { commentPost, createPost, deletePost, getAllPost, likePost, getLikedPosts, getFollowingPosts, getUserPosts } from '../controllers/postController.js'

const router = express.Router()

router.get('/all',protectRoute,getAllPost)
router.get("/following",protectRoute, getFollowingPosts)
router.get("/likes/:id", protectRoute,getLikedPosts)
router.get("/user/:username", protectRoute,getUserPosts)
router.post('/create',protectRoute,createPost)
router.post('/comment/:id',protectRoute, commentPost)
router.post('/like/:id',protectRoute, likePost)
router.delete('/delete/:id',protectRoute,deletePost)

export default router