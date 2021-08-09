import React, { useState } from 'react'
import Slider from '../Button/Slider/Slider'

//compoment
import Portfolio from "./Portfolio.jpg"
import Join from "./Join.jpg"
import G_V from "./G-V.jpg"
import Create from "./Create.jpg"

//images


//classes
import classes from "./HomePage.css"

const HomePage = (props) => {

    const [changeQuid, setChangeQuid] = useState("Portfolio")

    

    return (
        <div className={classes.HomePage}>
            <h1 className={classes.greet}>
                Hi <span className={classes.name}>{props.user.name}!</span>
            </h1>
            <p>Welcome to our Feedback Management System.</p>
            <div className={classes.IntroContainer}>
                <Slider changed={(data)=>setChangeQuid(data)} options={["Portfolio", "Create", "Join", "G/V"]} initialsIndex={0} />
                <img src={changeQuid === "Portfolio" ? Portfolio : (changeQuid === "Create" ? Create : ((changeQuid === "Join" ? Join : (G_V))))} className={classes.quide}/>
            </div>
        </div>
    )
}

export default HomePage
