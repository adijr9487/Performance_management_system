import React, { useEffect, useState } from 'react'

//classes
import classes from "./Slider.css"

const Slider = (props) => {
    
    const [Active, setActive] = useState(null)
    
    useEffect(() => { 
        setActive(props.options[props.initialsIndex])
        props.changed(props.options[props.initialsIndex])

    }, [])

    const clickHandler = (data) => {
        setActive(data)
        props.changed(data)
        console.log(data)
    }

    let themeStyleO = {
        border: "2px solid #707070"
    }
    let themeStyleI = {
        color:  "#707070",
    }

    return (
        <div style={props.theme === "dark" ? themeStyleO : themeStyleI} className={classes.Slider}>
            {props.options.map((option)=>{
                let activeStyle = {
                    backgroundColor: " #574F7D"
                }
                if(props.theme === "dark"){
                    activeStyle = {
                        backgroundColor: " #707070"
                    }
                }
                return <p key={option} style={option === Active ? activeStyle : null} onClick={()=>clickHandler(option)} className={option === Active ? classes.active : classes.Option}>{option.toUpperCase()}</p>
            })}
        </div>
    )
}

export default Slider
