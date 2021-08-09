import React, { useState } from 'react'
import axios from "axios"
import { useHistory } from 'react-router'
// Component
import Form from "./Form/Form"
import Input from "./Form/Input/Input"

// classes
import classes from "./EntryPage.css"
import { VALIDATOR_MINLENGTH } from '../../util/Validator'
import Loading from '../../util/Loading/Loading'

const EntryPage = (props) => {
    const history = useHistory()
    const [JoinCode, setJoinCode] = useState({
        code: {
            value: null,
            isCorrect: false,
            isTouched: false,
        }
    })

    const onChangeHandler = (data) => {
        //data = {field: value}
        console.log(data)
        setJoinCode(data)
    }

    const clickHandler = (e) => {
        e.preventDefault()
        console.log(JoinCode)
        axios
        .post("/anonymous/join", {code: JoinCode.code.value})
        .then(res=>{
            props.AnonymousFeedbackData({...res.data})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const createFormHandler = () => {
        history.push("/anonymous/create_feedback")
    }

    return (
        <div className={classes.EntryPage}>
            
            <div className={classes.Left}>
                <div className={classes.LeftMain}>
                    <h1>FEEDBACK / PERFORMANCES MANAGEMENT SYSTEM</h1>
                    <p>Self improvement tool for educational institute.</p>

                    <div className={classes.Join}>
                        <form className={classes.JoinForm}>
                            <Input joinCode validators={[VALIDATOR_MINLENGTH(5)]} value={JoinCode.code} field="code" name="Code" type="text" changed={onChangeHandler} />
                            <button disabled={!JoinCode.code.value} className={classes.ButtonJoin} onClick={clickHandler}>Join</button>
                        </form>
                        <p>Join an instant feedback form.</p>
                    </div>

                    <hr />

                    <div className={classes.Create}>
                        <button disabled={true} onClick={createFormHandler} className={classes.Button}>INSTANT FEEDBACKS</button>
                        <p>Create an instant feedback form.</p>
                    </div>
                </div>
            </div>

            <div className={classes.Right}>
                
                <Form authenticateUser={props.authenticateUser}/>
            </div>
        </div>
    )
}

export default EntryPage
