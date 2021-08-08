import React from 'react'

//component
import Join from "../Feedback/Join/Join"

//classes
import classes from "./JoinPage.css"

const JoinPage = (props) => {
    return (
        <div className={classes.JoinPage}>
            <Join uid={props.uid}/>
        </div>
    )
}

export default JoinPage
