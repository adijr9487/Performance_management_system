import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

//components
import Input from "../Input/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../../../util/Validator";

//classes
import classes from "./SignUp.css";

const SignUp = (props) => {
  const [FormData, setFormData] = useState({
    name: {
      value: null,
      isCorrect: false,
      isTouched: false,
    },
    email: {
      value: null,
      isCorrect: false,
      isTouched: false,
    },
    password: {
      value: null,
      isCorrect: false,
      isTouched: false,
    },
    c_password: {
      value: null,
      isCorrect: false,
      isTouched: false,
    },
  });
  const [errorMsg, setErrorMsg] = useState({ type: null, message: null });
  const [FormValid, setFormValid] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  let history = useHistory();

  useEffect(() => {
    let tempValid = true;
    for (let element in FormData) {
      tempValid = tempValid && FormData[element].isCorrect;
    }
    setFormValid(tempValid);
    setErrorMsg({ type: null, message: null });
  }, [FormData]);

  const onChangeHandler = (data) => {
    //data = {field: value}
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const clickHandler = (e) => {
    e.preventDefault();
    if (FormValid) {
      //if the form is valid with inputs
      // 1. we check if both the password are some
      if (FormData.password.value === FormData.c_password.value) {
        // password some

        axios
          .post("https://glacial-falls-88901.herokuapp.com/user/signup", {
            email: FormData.email.value,
            password: FormData.password.value,
            name: FormData.name.value,
          })
          .then((res) => {
            console.log(res);
            sessionStorage.setItem("token", JSON.stringify(res.data.userData));
            // props.authenticateUser(res.data.userData)
            setResponseMessage({
              status: "success",
              message: res.data.message,
            });
            setTimeout(() => {
              setResponseMessage(null);
              props.authenticateUser();
            }, 1000);
            // console.log(sessionStorage.getItem('token'))
          })
          .catch((err) => {
            console.log(err);
            setResponseMessage({
              status: err.response.status,
              message: err.response.data.message,
            });
          });
      } else {
        //password not some
        setErrorMsg({ type: "password", message: "Password does not match" });
      }
    }
  };

  return (
    <div className={classes.SignUp}>
      <form className={classes.FormSection}>
        <Input
          singup
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
          value={FormData.name}
          field="name"
          name="Name"
          type="text"
          changed={onChangeHandler}
        />
        <Input
          singup
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
          value={FormData.email}
          field="email"
          name="Email"
          type="email"
          changed={onChangeHandler}
        />
        {errorMsg.type === "email" ? (
          <p className={classes.Error}>Email already exist!</p>
        ) : null}
        <Input
          singup
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
          value={FormData.password}
          field="password"
          name="Password"
          type="password"
          changed={onChangeHandler}
        />
        <Input
          singup
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
          value={FormData.c_password}
          field="c_password"
          name="Confirm Password"
          type="password"
          changed={onChangeHandler}
        />
        {errorMsg.type === "password" ? (
          <p className={classes.Error}>Password does not match!</p>
        ) : null}
        <button
          disabled={!FormValid}
          className={classes.ButtonSignUp}
          onClick={clickHandler}
        >
          Proceed
        </button>
      </form>
      {responseMessage && (
        <p
          className={classes.message}
          style={{
            backgroundColor:
              responseMessage.status === 403 ? "#bd6862" : "#62bd62",
          }}
        >
          {responseMessage.message}
        </p>
      )}
    </div>
  );
};

export default SignUp;
