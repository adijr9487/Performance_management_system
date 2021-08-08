import React from 'react'
import {Link} from "react-router-dom"

//component

//classes
import classes from "./FeedbackPre.css"

const FeedbackPre = (props) => {


    console.log(props)

    return (
        <div className={classes.FeedbackPre}>
            <div className={classes.Topic}>
                {props.feedback_data.topic}
            </div>
            <div className={classes.Info}>
                <div className={classes.Vals}>
                    <div className={classes.Label}>Author</div>
                    <div className={classes.Value}>{props.feedback_data.author}</div>
                </div>
                <div className={classes.Vals}>
                    <div className={classes.Label}>Date</div>
                    <div className={classes.Value}>{props.feedback_data.date}</div>
                </div>
            </div>
            <div className={classes.QuesPre}>
                {/* Here you will see question */}
                {props.feedback_data.questionData.map((question, index)=>{
                    return <p key={index} >{index+1}. {question.q_statement}</p>
                })}
            </div>
            {(props.created !== null) && props.created 
            ? <div className={classes.Info}>
                <div className={classes.Vals}>
                    <div className={classes.Label}>Reponses</div>
                    <div className={classes.Value} style={{backgroundColor: "rgb(78 95 180)"}}>{props.feedback_data.responses}</div>
                </div>
            </div> 
            
            : <div className={classes.Info}>
                <div className={classes.Vals}>
                    <div className={classes.Label}>Status</div>
                    <div className={classes.Value} style={{backgroundColor: props.feedback_data.status === "submitted" ? "#4eb44e" : "rgb(218 88 88)"}}>{props.feedback_data.status}</div>
                </div>
                {/* <div className={classes.Vals}>
                    <div className={classes.Label}>Submit</div>
                    <div className={classes.Value}>Not yet</div>
                </div> */}
            </div>
            }
            {!props.created 
            ? (props.feedback_data.status === "not submitted" 
                ? <Link to={`/give_response/${props.feedback_data.response_id}`} className={classes.ForwardLink}>Give Response</Link>
                : <Link to={`/review_response/${props.feedback_data.response_id}`} className={classes.ForwardLink}>Review Response</Link> )

            : <Link to={`/view_responses/${props.feedback_data.feedback_uid}`} className={classes.ForwardLink}>View Responses</Link>
            }
        </div>
    )
}

export default FeedbackPre
