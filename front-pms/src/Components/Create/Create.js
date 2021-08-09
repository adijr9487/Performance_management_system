import React from 'react'

//component
import CreateForm from "../Feedback/CreateForm/CreateForm"

//classes
import classes from "./Create.css"

const Create = (props) => {
    return (
        <div className={classes.Create}>
            <hr />
            <CreateForm anonymous={props.anonymous} uid={props.uid} name={props.name}/>
        </div>
    )
}

export default Create
