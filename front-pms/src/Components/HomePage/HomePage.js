import React from 'react'

//compoment

//classes
import classes from "./HomePage.css"

const HomePage = (props) => {
    return (
        <div className={classes.HomePage}>
            <h1 className={classes.greet}>
                Hi <span className={classes.name}>{props.user.name}!</span>
            </h1>
            <p>Welcome to our Feedback Management System.</p>
            <div className={classes.IntroContainer}>
                
            </div>
        </div>
    )
}

export default HomePage
