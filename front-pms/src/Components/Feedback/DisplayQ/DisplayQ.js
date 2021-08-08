import React, {useEffect, useState} from 'react'

//component


//classes
import classes from "./DisplayQ.css"

const DisplayQ = (props) => {

    const answerClickHandler = (index) => {
        if(!props.testMode && !props.review){
            props.handlerAnswer(index)
        }
    }

    const answerChangeHandler = (e) => {
        if(!props.testMode && !props.review){
            props.handlerAnswer(e.target.value)
        }
    }

    useEffect(() => {

    }, [])

    return (
        <div className={classes.DisplayQ}>
            <div className={classes.QSec}>
                <p className={classes.QuestionStatement}>{props.index+1}. {props.data.q_statement}</p>
                {(props.testMode && !props.review) && 
                    <div className={classes.ED}>
                        <div onClick={()=>props.delete(props.index)} className={classes.Button}>Delete</div>
                    </div>
                }
            </div>
            {props.data.type === "Objective" ? 
                <div className={classes.Options} style={{backgroundColor: props.testMode ? "#e1e1e1" : "#BCB8CB"}}>
                    {props.data.options.map((option, index)=>{
                        return <div onClick={()=>answerClickHandler(index)} key={index} className={props.answerValue === index ? (classes.Option+" "+classes.ActiveAnswer) : classes.Option}>{option}</div>
                    })}
                    
                </div>
            :
            <div className={classes.Options+" "+classes.Text} style={{backgroundColor: props.testMode ? "#e1e1e1" : "#BCB8CB"}}>
                <input className={classes.AnswerInput} value={props.answerValue ? props.answerValue : ""} onChange={answerChangeHandler} type="text" name="answer" />
                <p className={classes.limit}>{`${props.answerValue ? props.answerValue.length : 0}/${props.data.word_limit}`}</p>
            </div> 
            }
        </div>
    )
}

export default DisplayQ
