import React, { useState } from "react";

//component
import {validate} from "../../../../util/Validator"

//classes
import classes from "./Input.css";

const Input = (props) => {

  const changeHandler = (e) => {
    props.changed({
      [props.field]: {
        ...props.value,
        value: e.target.value,
        isCorrect: validate(e.target.value, props.validators)
      }
    })
  };

  const touchedHandler = (e) => {
    props.changed({
      [props.field]: {
        ...props.value,
        isTouched: true,
      }
    })
}

  let classList = [classes.Input]
  
  if(props.joinCode){
    classList.push(classes.Code)
  }

  const inputType = (
    <div className={classList.join(" ")}>
      <input
        required
        className={classes.InputFiled}
        type={props.type}
        name={props.field}
        placeholder={props.name}
        value={props.value.value ? props.value.value : "" }
        onChange={changeHandler}
        onBlur={touchedHandler}
      />
      <label className={classes.Label}>{props.name}</label>
    </div>
  );

  return inputType
};

export default Input;
