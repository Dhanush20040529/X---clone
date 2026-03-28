import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeletons.jsx";
import { POSTS } from "../../utiles/db/dummy.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { BASE_URL } from "../../constant/url.js";


const Posts = ({feedType, username, userId}) => {
	const BACKEND_URL= BASE_URL

	const getURL = ()=>{
		switch(feedType){
			case "forYou" : return `${BACKEND_URL}/api/post/all`;
			case "following" : return `${BACKEND_URL}/api/post/following`;
			case "posts" : return `${BACKEND_URL}/api/post/user/${username}`;
			case "likes" : return `${BACKEND_URL}/api/post/likes/${userId}`
			default : return `${BACKEND_URL}/api/post/all`;
		}
	}
	
	const URL = getURL()

	const {data:posts,isLoading , refetch, isRefetching, error} = useQuery({
		queryKey : ["posts"],
		queryFn : async ()=>{
			try {
				const res = await fetch(`${URL}`,{
					method : "GET",
					credentials : "include",
					headers:{
						"Content-Type" : "application/json"
					}
				})
				const data = await res.json()

				if(!res.ok){
					throw new Error( data.error || "something went wrong")
				}
				
				return data
			} catch (error) {
				throw error
			}
		}
	})

	useEffect(()=>{
		refetch()
	},[feedType, refetch, username])

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;