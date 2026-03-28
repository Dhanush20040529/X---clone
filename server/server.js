import express from 'express'
import authRoute from './routes/authRoute.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cloudinary from 'cloudinary'
import dns from 'dns'
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import notificationRoute from './routes/notificationRoute.js'
import cors from 'cors'
import path from 'path'


const app = express()
dotenv.config()
const __dirname = path.resolve();

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET_KEY
})

app.use(cors({
    origin: "http://localhost:5174",
    credentials : true
}))
app.use(express.json( {
    limit:"5mb"
}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api/auth", authRoute)
app.use('/api/user', userRoute)
app.use("/api/post", postRoute)
app.use("/api/notification", notificationRoute)

const connectDB = async ()=>{
    try {
       await mongoose.connect(process.env.MONGO_URL)
        console.log("mongo DB connected")
    } catch (error) {
        console.log(error)
    }
}

 if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "..", "frontend", "dist")))
    app.get(/.*/,(req, res)=>{
        res.sendFile(path.join(__dirname, "..", "frontend", "dist","index.html"))
    })
 }

app.listen(3000,()=>{
    console.log('server is running on port 3000')
    connectDB()
})