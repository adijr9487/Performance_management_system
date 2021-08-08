import React, { useEffect, useState } from "react";
import axios from "axios";

//components
import Input from "../Input/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../../../util/Validator";

//classes
import classes from "./Login.css";

const Login = (props) => {
  const [FormData, setFormData] = useState({
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
  });

  const [FormValid, setFormValid] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    let tempValid = true;
    for (let element in FormData) {
      tempValid = tempValid && FormData[element].isCorrect;
    }
    setFormValid(tempValid);
    setResponseMessage(null);
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
      //if password matched
      console.log(FormData);
      axios
        .post("https://glacial-falls-88901.herokuapp.com/user/login", {
          email: FormData.email.value,
          password: FormData.password.value,
        })
        .then((res) => {
          console.log(res);
          sessionStorage.setItem("token", JSON.stringify(res.data.userData));
          // props.authenticateUser(res.data.userData)
          setResponseMessage({ status: "success", message: res.data.message });
          setTimeout(() => {
            setResponseMessage(null);
            props.authenticateUser();
          }, 1000);
          // console.log(sessionStorage.getItem('token'))
        })
        .catch((err) => {
          console.log(err, err.response);
          setResponseMessage({
            status: err.response.status,
            message: err.response.data.message,
          });
        });
    }
  };

  return (
    <div className={classes.Login}>
      <div className={classes.FormSection}>
        <Input
          login
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
          value={FormData.email}
          field="email"
          name="Email"
          type="email"
          changed={onChangeHandler}
        />
        <Input
          login
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
          value={FormData.password}
          field="password"
          name="Password"
          type="password"
          changed={onChangeHandler}
        />
        <button
          disabled={!FormValid}
          className={classes.ButtonLogin}
          onClick={clickHandler}
        >
          Proceed
        </button>
      </div>
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

export default Login;
