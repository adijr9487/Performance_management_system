import React from "react";

//component

//classes
import classes from "./Loading.css";

const Loading = (prosp) => {
  return (
    <div className={classes.Loading}>
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
