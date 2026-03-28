import React, { useState } from 'react'
import XSvg from '../../../components/X'
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { BASE_URL } from '../../../constant/url';




const Signup = () => {
    const BACKEND_URL = BASE_URL
    const [formData, setFormData] = useState({
        email:"",
        username:"",
        password:"",
        fullName:""
    })


    const queryClient = useQueryClient()
    const {mutate:signup, isPending ,isError, error} = useMutation({
        mutationFn : async (formData)=>{
            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/signup`,{
                    method : "POST",
                    credentials: "include",
                    headers :{
                        "Content-Type" : "application/json",
                        "Accept" : "application/json"
                    },
                    body:JSON.stringify(formData)
                })

                const data = await res.json()

                if(!res.ok){
                    throw new Error(data.error || "something went wrong")
                }
                return data
            } catch (error) {
                throw error
            }
        },
        onSuccess:()=>{
          toast.success("user created successfully")
          queryClient.invalidateQueries({
            queryKey : ["authUser"]
          })
        }
    })

    const handleInputChange = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleSubmit = (e)=>{
        e.preventDefault()
        signup(formData)
    }
    
  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
        <div className='flex-1 hidden lg:flex items-center justify-center'>
            <XSvg className='lg:w-2/3 fill-white '/>
        </div>
        <div className='flex-1 flex flex-col justify-center items-center'>
            <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
                <XSvg className= 'w-24 mx-auto lg:hidden fill-white'/>
                <h1 className='text-4xl font-extrabold text-white'>Jion today.</h1>
                <label htmlFor="email" className='input input-bordered rounded flex items-center gap-2'>
                    <MdOutlineMail />
                    <input 
                        name="email"
                        id='email'
                        className='grow'
                        value = {formData.email}
                        onChange={handleInputChange}
                        type="email"
                        placeholder='Email'
                        required
                    />

                </label>
                <div className='flex gap-4 flex-wrap'>
                    <label htmlFor="username" className='input input-bordered rounded flex items-center gap-2 flex-1'>
                        <FaUser />
                        <input 
                            type="text" 
                            id='username'
                            name='username'
                            className='grow '
                            placeholder='Username'
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label htmlFor="fullName" className='input input-bordered rounded flex items-center gap-2 flex-1'>
                        <MdOutlineDriveFileRenameOutline />
                        <input 
                            type="text" 
                            id='fullName'
                            name='fullName'
                            className='grow '
                            placeholder='Full Name'
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <label htmlFor="password" className='input input-bordered rounded flex items-center gap-2'>
                    <MdPassword />
                    <input 
                        type="password" 
                        name="password" 
                        className='grow '
                        id="password" 
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type='submit' className='btn btn-primary rounded-full text-white'>{isPending ? <LoadingSpinner size = "sm"/> : "signup"}</button>
                {isError&& <p className='text-red-500'>{error.message}</p>}
                
            </form>
            <div className='flex flex-col mt-4 gap-2 lg:w-2/3'>
                <p className='text-white text-lg'>Alreadt have an account?</p>
                <Link to="/login">
                    <button className='w-full btn btn-primary rounded-full text-white btn-outline'>Sign in</button>
                </Link>
            </div>
        </div>

    </div>
  )
}

export default Signup