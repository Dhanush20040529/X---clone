export const formatDate = (createdAt)=>{
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt)

    const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000)
    const timeDifferentInMinutes = Math.floor((timeDifferenceInSeconds)/60)
    const timeDifferentInHours = Math.floor((timeDifferentInMinutes)/60)
    const timeDifferentInDays = Math.floor((timeDifferentInHours)/24)

    if(timeDifferentInDays > 1){
        return createdAtDate.toLocaleDateString("en-us",{month:"short" , day:"numeric"})
    } else if(timeDifferentInDays === 1){
        return "1d"
    } else if(timeDifferentInHours >= 1) {
        return `${timeDifferentInHours}h`
    } else if(timeDifferentInMinutes >=1){
        return `${timeDifferentInMinutes}m`
    }else {
        return "just now"
    }
}