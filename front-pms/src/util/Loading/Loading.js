import React from "react";

//component

//classes
import classes from "./Loading.css";

const Loading = (props) => {

  let style = {
    borderColor: `${props.dark? "#000" : "#fff"} transparent transparent transparent`,
    // width: `${props.small ? "20px" : "40px"}`,
    // height: `${props.small ? "20px" : "40px"}`,
    // border: `${props.small ? "3px solid" : "8px solid"}` 
  }

  return (
    <div class={classes.lds_ring}>
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
    </div>
  );
};

export default Loading;
