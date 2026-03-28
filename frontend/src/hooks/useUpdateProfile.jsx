import React from 'react'
import toast from 'react-hot-toast'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import { BASE_URL } from '../constant/url'

const BACKEND_URL = BASE_URL



const useUpdateProfile = () => {
    const queryclient = useQueryClient()
  const {mutateAsync:updateProfile, isPending: isUpdating, error} = useMutation({
		mutationFn: async (formData)=>{
			try {
				
				const res = await fetch(`${BACKEND_URL}/api/user/update`,{
					method: "POST",
					credentials: "include",
					headers:{
						"Content-Type":"application/json"
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
			toast.success("profile update successfully")
            Promise.all([
				queryclient.invalidateQueries(["getUser"]),
				queryclient.invalidateQueries(["authUser"])
			])
            
		},
		onError:(error)=>{
			console.log(error.message)
			toast.error(error.message || "something went wrong")
		}

	})
    return {updateProfile, isUpdating}
}

export default useUpdateProfile