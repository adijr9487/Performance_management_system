import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

//component
import FeedbackPre from "../FeedbackPre/FeedbackPre";
import Slider from "../Button/Slider/Slider";
//classes
import classes from "./Portfolio.css";

const Portfolio = (props) => {
  const [PortfolioData, setPortfolioData] = useState(null);
  const [slider, setSlider] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slider === "Joined") {
      axios
        .get(
          `https://glacial-falls-88901.herokuapp.com/response/${props.uid}/joined`
        )
        .then((res) => {
          console.log(res);
          setPortfolioData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else if (slider === "Created") {
      axios
        .get(
          `https://glacial-falls-88901.herokuapp.com/feedback/${props.uid}/created`
        )
        .then((res) => {
          console.log(res);
          setPortfolioData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }

    // return () => {

    // }
  }, [slider]);

  const changedHandler = (value) => {
    setPortfolioData(null);
    setLoading(true);
    setSlider(value);
  };

  return (
    <div className={classes.Portfolio}>
      <hr />
      <Slider
        options={["Joined", "Created"]}
        initialsIndex={1}
        changed={changedHandler}
      />
      {props.useParams}
      <div className={classes.Container}>
        {!loading ? (
          PortfolioData &&
          (PortfolioData.length > 0 ? (
            PortfolioData.map((fb, index) => {
              return (
                <FeedbackPre
                  key={index}
                  feedback_data={fb}
                  created={
                    slider === "Created"
                      ? true
                      : slider === "Joined"
                      ? false
                      : null
                  }
                />
              );
            })
          ) : slider === "Created" ? (
            <p>You haven't created any feedback form yet</p>
          ) : slider === "Joined" ? (
            <p>You are not joined to any feedback form.</p>
          ) : (
            <p>Choose an option</p>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
