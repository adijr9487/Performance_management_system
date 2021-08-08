import React from 'react'

//classes
import classes from "./Button.css"

const Button = (props) => {

    const clickedHandler = () => {
        console.log("ButtonClicked")
    }

    return (
        <div onClick={clickedHandler} className={classes.Button}>
            {props.children}
        </div>
    )
}

export default Button
