import User from "../models/User.js";
import bcrypt from 'bcrypt'
import generateToken from "../utils/generateToken.js";

export const signup = async (req,res)=>{
    try {
        const {username, password, email, fullName} = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({error:"invalid email format"})
        }

        const existingEmail = await User.findOne({email})
        const existingUsername = await User.findOne({username}) 
        if(existingUsername || existingEmail){
           return res.status(400).json({error:"username or email already exist"})
          
        }

        if(password.length <6){
            return res.status(400).json({error:"passwprd must b e 6 characters"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            fullName,
            password : hashedPassword,
            email

        })

        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save()
            res.status(200).json({
                newUser
            })
        }else {
                res.status(400).json({error:'invalid user data'})
        }

       
    } catch (error) {
        res.status(500).json({error:"internal server error"})
        console.log(`error in signup controller : ${error}`)
    }
    
}

export const login = async (req, res)=>{
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({error:"user not found"})
        }

        const matchedPassword = await bcrypt.compare(password, user.password)
        if(!matchedPassword){
            return res.status(400).json({error:"invaild password"})
        }
        generateToken(user._id,res)
        res.status(200).json({
            user
        })
    } catch (error) {
        res.status(500).json({error:"internal server error"})
        console.log(`error in login controller ${error}`)
    }

  
}

export const logout = async(req, res)=>{
    try {
       res.cookie("jwt",'',{maxAge:0})
       res.status(200).json({message:"logout successfully"})
    } catch (error) {
        console.log(`error in logout controller ${error}`)
        res.send(500).json({error:"internal server error"})
    }
}
 
export const getMe = async(req, res)=>{
    try {
        const user = await User.findOne({_id:req.user._id}).select("-password");
        res.status(200).json(user)
    } catch (error) {
        console.log(`error in get me controller ${error}`)
        res.status(500).json({error:"internal server error"})
    }
}
