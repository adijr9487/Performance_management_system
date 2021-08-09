import React, {useState} from 'react'

//component
import SignUp from './SignUp/SignUp'
import Login  from './Login/Login'

//classes
import classes from "./Form.css"
import Loading from '../../../util/Loading/Loading'

const Form = (props) => {

    const [formState, setFormState] = useState("login")

    const toggleHandler = (type)=>{
        setFormState(type)
    }

    return (
        <div className={classes.Form}>
            <div className={classes.Toggle}>
                <div style={{borderColor: formState === "login" ? "#574F7D" : "transparent"}} className={classes.Toggle1} onClick={()=>toggleHandler('login')}>Login</div>
                <div style={{borderColor: formState === "register" ? "#574F7D" : "transparent"}} className={classes.Toggle2} onClick={()=>toggleHandler('register')}>Register</div>
            </div>
            <form className={classes.form}>
            
                {formState === "register" ? <SignUp authenticateUser={props.authenticateUser}/> : (formState === "login" ? <Login authenticateUser={props.authenticateUser}/> : null) }
            </form>
        </div>
    )
}

export default Form
