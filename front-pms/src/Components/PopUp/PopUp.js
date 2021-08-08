import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"

//component
import copy from "./copy-regular"

//classes
import classes from "./PopUp.css"

const PopUp = (props) => {

    const [Share, setShare] = useState(null)

    useEffect(()=>{

        if(props.linkData){
            setShare({
                code: props.linkData.code,
                link: props.linkData.link
            })
        }
        
    }, [props.linkData])

    const dropOnChange = () => {
        return
    }

    return(
        Share 
        && <div className={classes.PopUp}>
            <div className={classes.Header}>
                <p>Feedback form successfully created</p> 
            </div>
            <div className={classes.Main}>
                <p>When you send someone a code for joining a feedback, 
                they can join directly—you won’t get a join request. </p>
                <div className={classes.section}>
                    <label>Code</label>
                    <div className={classes.subSection}>
                        <input onChange={dropOnChange} value={Share.code} className={classes.popInput}></input>
                        <button className={classes.copyButton} onClick={()=>navigator.clipboard.writeText(Share.code)}>{copy(15)}</button>
                    </div>
                </div>
                <div className={classes.section}>
                    <label>Link</label>
                    <div className={classes.subSection}>
                        <input onChange={dropOnChange} value={Share.link} className={classes.popInput}></input>
                        <button className={classes.copyButton} onClick={()=>navigator.clipboard.writeText(Share.link)}>{copy(15)}</button>
                    </div>
                </div>
                <p>Your invitees can also join the form just by clicking on this link</p>
                <Link className={classes.Redirect} to="/">REDIRECT TO HOME</Link>
            </div>
        </div>
    )
}

export default PopUp
