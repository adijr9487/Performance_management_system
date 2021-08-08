import React, { useEffect, useState } from 'react'
import axios from "axios"
//component

//classes
import classes from "./Profile.css"


const Profile = (props) => {

    const [UserData, setUserData] = useState(null)
    const [showErr, setShowErr] = useState(null)

    useEffect(()=>{

        axios
        .get(`http://localhost:5000/user/getUserData/${props.uid}`)
        .then(res=>{
            setUserData({...res.data, see_password: new Array(res.data.password.length).fill("*").join("")})
        })
        .catch(err=>{
            console.log(err)
            setShowErr({message: err.message})
        })

    }, [])


    return (
        UserData && <div className={classes.Profile}>
        <div className={classes.Container}>
            {showErr && <p>{showErr.message}</p>}
            <div className={classes.Personal}>
                <label>Personal</label>
                <div className={classes.Entry}>
                    <lable>Name</lable>
                    <p>{UserData.name}</p>
                </div>
                <div className={classes.Entry}>
                    <lable>Email</lable>
                    <p>{props.uid}</p>
                </div>
                <div className={classes.Entry}>
                    <lable>Password</lable>
                    <p>{UserData.see_password}</p>
                </div>
            </div>

            <div className={classes.Status}>
                <label>Status</label>
                <div className={classes.Entry}>
                    <lable>Total feedback created</lable>
                    <p>{UserData.feedback.length}</p>
                </div>
                <div className={classes.Entry}>
                    <lable>Total feedback Responded</lable>
                    <p>{UserData.response.length}</p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Profile
