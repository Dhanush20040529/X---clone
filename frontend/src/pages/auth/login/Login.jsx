import { useState } from "react";
import { Link } from "react-router-dom";
import XSvg from "../../../components/X";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../constant/url";




const LoginPage = () => {
    const BACKEND_URL = BASE_URL
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

    const queryClient  = useQueryClient()
    const {mutate:login , isPending, isError, error} = useMutation({
        mutationFn: async (formData)=>{
            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/login`,{
                    method : "POST",
                    credentials: "include",
                    headers : {
                        "Content-Type":"application/json",
                        "Accept": "application/json"
                        
                    },
                    body: JSON.stringify(formData)

                })

                const data = await res.json()

                if(!res.ok) {
                    throw new Error(data.error || "something went wrong")
                }

                
                return data
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        onSuccess:()=>{
            toast.success("Login successfuliy")
            queryClient.invalidateQueries({
                queryKey:["authUser"]
            })
        }
    })

	const handleSubmit = (e) => {
		e.preventDefault();
		login(formData)
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};



	return (
		<div className="max-w-screen-xl flex mx-auto h-screen px-10">
            <div className="flex-1 hidden lg:flex justify-center items-center">
                <XSvg className = 'lg:w-2/3 fill-white'/>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
                <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
                    <XSvg  className='lg:hidden w-24 fill-white'/>
                    <h1 className="text-4xl font-extrabold text-white">let's go.</h1>
                    <label className="input  input-bordered rounded flex items-center gap-2" htmlFor="username">
                        <FaUser/>
                        <input 
                            type="text" 
                            placeholder="Username"
                            className="grow"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />

                    </label>
                    <label htmlFor="password" className="input input-bordered rounded flex items-center gap-2">
                        <MdPassword/>
                        <input 
                            type="password" 
                            placeholder="password"
                            className="grow"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </label>

                    <button type="submit" className="w-full btn text-white btn-primary  rounded-full">{isPending? <LoadingSpinner size= "sm"/>:"Login"}</button>
                    {isError && <p className="text-red-500">{error.message}</p>}

                </form>
                <div className="mt-4 flex flex-col gap-2">
                    <p className="text-lg text-white">{"Don't"} have an account?</p>
                    <Link to='/signup'>
                        <button className="w-full btn text-white btn-primary btn-outline rounded-full">Sign up</button>
                    </Link>
                </div>
            </div>
        </div>
	);
};
export default LoginPage;