import React, { useEffect, useState } from 'react'
import {NavLink, Link} from "react-router-dom"
import {useHistory} from "react-router-dom"
//component

//classes
import classes from "./Navbar.css"

const Navbar = (props) => {

    const [IsActive, setIsActive] = useState(null)
    let history = useHistory() 
    useEffect(() => {
        
        if(IsActive === "authentication"){
            props.logoutHandler()
        }

    }, [IsActive])
    console.log(props.user)
    return (
        <div className={classes.Navbar}>
            <div className={classes.Logo}>
            <Link onClick={()=>setIsActive("")} to="/" className={classes.Logo}>LOGO</Link>
            </div>
            <div className={classes.Options}>
                <NavLink to={`/${props.user.uid}/portfolio`} onClick={()=>setIsActive("portfolio")} className={IsActive === "portfolio" ? classes.Option+" "+classes.active : classes.Option} >Portfolio</NavLink>
                <NavLink to={`/${props.user.uid}/create`} onClick={()=>setIsActive("create")} className={IsActive === "create" ? classes.Option+" "+classes.active : classes.Option} >Create</NavLink>
                <NavLink to={`/${props.user.uid}/join`} onClick={()=>setIsActive("join")} className={IsActive === "join" ? classes.Option+" "+classes.active : classes.Option} >Join</NavLink>
                <NavLink to={`/${props.user.uid}/profile`} onClick={()=>setIsActive("profile")} className={IsActive === "profile" ? classes.Option+" "+classes.active : classes.Option} >Profile</NavLink>
                <NavLink to={`/${props.user.uid}/authentication`} onClick={()=>setIsActive("authentication")} className={IsActive === "authentication" ? classes.Option+" "+classes.active : classes.Option} >Logout</NavLink>
            </div>
        </div>
    )
}

export default Navbar
