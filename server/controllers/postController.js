import Notification from "../models/Notification.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinary from 'cloudinary'

export const createPost = async(req,res)=>{
    try {
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id
        const user  = await User.findOne({_id : userId})

        if(!user) {
            return res.status(404).json({error:"user not found"})
        }

        if(!text && !img) {
            return res.status(400).json({error:"Post mush have image or text"})
        }

        if(img) {
            const upladedResponse = await cloudinary.uploader.upload(img)
            img = upladedResponse.secure_url;
        }
        const newPost = new Post({
            user : userId,
            text,
            img
        })

        await newPost.save()

        user.posts.push(newPost._id)
         await user.save()

        res.status(201).json(newPost)
    } catch (error) {
        console.log(`error in create post in user controller : ${error}`)
        res.status(500).json({error:"internal server error"})
    }
}

export const deletePost = async(req,res)=>{
    try {
        const {id} = req.params;
        const userId = req.user._id;
        const post  = await Post.findOne({_id:id})
        if(!post) { 
            return res.status(404).json({error: "post not found"})
        }
        if(post.user.toString() !== userId.toString()){
            return res.status(401).json({error:"you are not authorized to delete this post"})
        }

        if(post.img){
            await cloudinary.uploader.destroy(post.img.split('/').pop().split('.')[0])
        }

        await Post.findOneAndDelete({_id:id});
        res.status(200).json({message:"post deleted successfully"});

    } catch (error) {
        console.log(`error in delete post in user controller : ${error}`)
        res.status(500).json({error:"internal server error"})
    }
}

export const commentPost = async(req,res) =>{
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        const user = await User.findOne({_id:userId}).select("-password -following -followers -bio -link -email")

        const post = await Post.findOne({_id:postId}).populate({
                path:"comments.user",
                select:["-password","-following","-followers","-bio","-link","-email"]
            })
        if(!post){
            return res.status(440).json({error:"post not found"})
        }  

        if(!text){
            return res.status(400).json({error:"comment text is required"})
        }

        post.comments.push({text,user})
        await post.save()
        console.log(post)
        res.status(200).json(post)
       

    } catch (error) {
        console.log(`error in comment post in user controller : ${error}`)
        res.status(500).json({error:"internal server error"})
    }
    
}

export const likePost = async (req, res)=>{
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const user = await User.findOne({_id:userId});
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        const post = await Post.findOne({_id:postId})
        if(!post) {
            return res.status(404).json({error:"post not found"})
        }
        const userLikedPost = post.likes.includes(userId)
        if(userLikedPost){
            await Post.updateOne({_id:postId},{$pull:{likes:userId}})
            await User.updateOne({_id:userId},{$pull:{likedPost:postId}})

            const updatedLikes = post.likes.filter((id)=> id.toString() !== user._id.toString())


            res.status(200).json(updatedLikes)
        }
        else{
           post.likes.push(userId)
            await User.updateOne({_id:userId},{$push:{likedPost:postId}})
           await post.save()

           console.log(user._id,post.user)
           
        if(user._id.toString() !== post.user.toString()){
            const newNotification = new Notification({
                from:userId,
                to:post.user,
                type:"like"
           })
           await newNotification.save();
        }
           

           
           const updatedLikes = post.likes
           res.status(200).json(updatedLikes)
        }
    } catch (error) {
        console.log(`error in like post in user controller : ${error}`)
        res.status(500).json({error:"internal server error"})
    }
}

export const getAllPost  =  async(req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt : -1}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:["-password","-following","-followers","-bio","-link","-email"]
        })
        if(posts.length === 0){
            return res.status(200).json([])
        }
        res.status(200).json(posts)
    } catch (error) {
        console.log(`error in get all post in user controller : ${error}`)
        res.status(500).json({error:"internal server error"})
    }
}

export const getLikedPosts = async(req, res)=>{
    try {
        const userId = req.params.id;
        const user = await User.findOne({_id:userId});
        if(!user){
            return res.status(404).json({error:"user not found"});
        }
        const likedPosts = await Post.find({_id:{$in:user.likedPost}})
            .populate({
                path:"user",
                select:"-password"
            })
            .populate({
                path:"comments.user",
                select:["-password","-following","-followers","-bio","-link","-email"]
            })
            res.status(200).json(likedPosts)
    } catch (error) {
        console.log(`error in get liked post in user controller : ${error}`)
        res.status(500).json({error:"internal server error"})
    }
    
}

export const getFollowingPosts = async(req,res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findOne({_id:userId});
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        const feedPost = await Post.find({user:{$in:user.following}}).sort({createdAt:-1})
            .populate({
                path:"user",
                select : "-password"
            })
            .populate({
                path:"comments.user",
                select:"-password"
            })
        res.status(200).json(feedPost)
    } catch (error) {
        console.log(`error in get liked post in user controller : ${error}`)
        res.status(500).json({error:"internal server error"})
    }
    
}

export const getUserPosts = async(req,res) =>{
    try {
        const username =  req.params.username;
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        const posts = await Post.find({user:user._id}).sort({createdAt:-1})
            .populate({
                path:"user",
                select:"-password"
            })
            .populate({
                path:"comments.user",
                select:"-password"
            })
        res.status(200).json(posts)
    } catch (error) {
        console.log(`error in get liked post in user controller : ${error}`)
        res.status(500).json({error:"internal server error"})
    }
    
}