import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/auth/signup/Signup.jsx'
import LoginPage from './pages/auth/login/Login.jsx'
import HomePage from './pages/home/Home.jsx'
import Sidebar from './components/common/Sidebar.jsx'
import RightPanel from './components/common/Rightpanel.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'
import { useQuery } from '@tanstack/react-query'

import {LoaderIcon, Toaster} from "react-hot-toast"
import LoadingSpinner from './components/common/LoadingSpinner.jsx'
import { BASE_URL } from './constant/url.js'





const App = () => {
  const BACKEND_URL = BASE_URL

  const {data:authUser, isLoading} = useQuery({
    queryKey : ["authUser"],
    queryFn : async ()=>{
     try {
       const res =  await fetch(`${BACKEND_URL}/api/auth/me`,{
        method:"GET",
        credentials:"include",
        headers:{
          "Content-Type" : "application/json"
        }
      })
      
      const data = await res.json()
      if(data.error){
        return null
      }
      if(!res.ok) {
        throw new Error(data.error || "something went wrong")
      }
  
      return data
     } catch (error) {

       throw error
     }
    },
    retry:false

  })
 
  if(isLoading){
    return(
      <div className='flex justify-center items-center h-screen'>
          <LoadingSpinner size='lg'/>
      </div>
    )
  }

  return (
    <div className='flex w-full max-w-8xl mx-auto'>
     {authUser &&<Sidebar/>}
      
      <Routes>
        <Route path='/' element={authUser?<HomePage/> : <Navigate to="/login"/>}/>
        <Route path='/login' element={!authUser ?<LoginPage/> : <Navigate to="/"/>}/>
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to = "/"/>}/>
        <Route path='/notifications' element={authUser ? <NotificationPage/> : <Navigate to="/login"/>}/>
        <Route path='/profile/:username' element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
      </Routes>
      {authUser && <RightPanel/>}
      <Toaster/>
    </div>
  )
}

export default App