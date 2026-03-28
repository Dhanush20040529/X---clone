import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import toast from 'react-hot-toast'
import { data } from 'react-router-dom'
import { BASE_URL } from '../constant/url'

const useFollow = () => {
    const BACKEND_URL = BASE_URL

    const quertClient = useQueryClient()

 const {mutate:follow, isPending, variables} = useMutation({
    mutationFn: async(userId)=>{
        try {
            const res = await fetch(`${BACKEND_URL}/api/user/follow/${userId}`,{
                method:"POST",
                credentials :"include",
                headers : {
                    "Content-Type" : "application/json"
                }
            })

            const data = await res.json()
            if(!res.ok) {
                throw new Error(data.error || "something went wrong")
            }
            

            return data
        } catch (error) {
            throw error
        }
    },
    onSuccess:()=>{
        Promise.all(
            quertClient.invalidateQueries({queryKey:["suggestedUser"]}),
            quertClient.invalidateQueries({queryKey:["authUser"]}),
            quertClient.invalidateQueries({querykey:["getUser3"]})
        )
    },
    onError:()=>{
        toast.error(error.message)
    }
 })
 return {follow, isPending, variables}
}

export default useFollow