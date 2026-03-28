import jwt from 'jsonwebtoken'
import User from '../models/User.js';

const protectRoute = async(req, res, next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(400).json({error:"unauthorized : No token provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            res.status(400).json({error : "invalid token"})
        }
        const user = await User.findOne({_id:decoded.userId}).select("-password")
        if(!user) {
            return res.status(400).json({error:"user not found"})
        }
        req.user = user;
        next()
    } catch (error) {
         console.log(`error in protect route middleware ${error}`)
        res.send(500).json({error:"internal server error"})
    }
}

export default protectRoute
