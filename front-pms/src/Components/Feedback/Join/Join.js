import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

//component

//classes
import classes from "./Join.css";

const Join = (props) => {
  const [joinCode, setJoinCode] = useState("");
  const [notify, setNotify] = useState(null);

  const onChangeHandler = (e) => {
    setNotify(null);
    setJoinCode(e.target.value.toUpperCase());
  };

  const codeSubmitHandler = () => {
    console.log(joinCode);
    axios
      .post("/response/join", {
        code: joinCode,
        uid: props.uid,
      })
      .then((res) => {
        console.log(res.data.status);
        setNotify({ status: res.data.status, message: res.data.message });
      })
      .catch((err) => {
        console.log(err.response.data);
        setNotify({ status: "err", message: err.response.data.message });
      });
  };

  return (
    <div className={classes.Join}>
      <h1>Join</h1>
      {joinCode !== null && (
        <div className={classes.Container}>
          <div className={classes.TopicContainer}>
            <label className={classes.label}>Code</label>
            <input
              onChange={onChangeHandler}
              value={joinCode ? joinCode : ""}
              className={classes.Topic}
              placeholder="EFGS11"
            />
          </div>
          <button
            onClick={codeSubmitHandler}
            disabled={!joinCode.length}
            className={classes.JoinButton}
          >
            Join
          </button>
        </div>
      )}
      {notify &&
        (notify.status === "200" ? (
          <div className={classes.Notify}>
            Form successfully joined and saved in your portfolio, click{" "}
            <Link to={`/${props.uid}/portfolio`}>here</Link> to go to portfolio
          </div>
        ) : notify.status === "201" ? (
          <div
            className={classes.Notify}
            style={{ backgroundColor: "rgb(220 243 113)" }}
          >
            {notify.message}
          </div>
        ) : notify.status === "err" ? (
          <div
            className={classes.Notify}
            style={{ backgroundColor: "#da8585" }}
          >
            {notify.message}
          </div>
        ) : null)}
    </div>
  );
};

export default Join;
