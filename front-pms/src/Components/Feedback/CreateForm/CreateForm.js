import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

//component
import CreateQ from "../CreateQ/CreateQ";
import DisplayQ from "../DisplayQ/DisplayQ";
import PopUp from "../../PopUp/PopUp";

//classes
import classes from "./CreateForm.css";

const CreateForm = (props) => {
  const [QuestionList, setQuestionList] = useState(null);
  const [topic, setTopic] = useState(null);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [returnData, setReturnData] = useState(null);

  const [finalReview, setFinalReview] = useState(false);
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  useEffect(() => {
    console.log(props.name);
    if (topic && QuestionList) {
      console.log(topic.length);
      if (topic.length > 0 && QuestionList.length > 0) {
        setIsReadyToSubmit(true);
      }
    } else {
      setIsReadyToSubmit(false);
    }
  }, [topic, QuestionList]);

  const Q_AddHandler = (data) => {
    if (QuestionList === null) {
      setQuestionList([data]);
    } else {
      setQuestionList((prev) => [...prev, data]);
    }
  };

  const deleteHandler = (index) => {
    console.log(index);
    setQuestionList((prev) => {
      let tempQList = [...prev];
      console.log(tempQList);
      if (tempQList.length === 1) {
        return null;
      } else {
        tempQList.splice(index, 1);
        console.log(tempQList);
        return tempQList;
      }
    });
  };

  const createHandler = () => {
    if (finalReview) {
      setLoading(true);
      console.log(props.uid, topic, QuestionList, props.name);
      axios
        .post("https://glacial-falls-88901.herokuapp.com/feedback/create", {
          uid: props.uid,
          topic: topic,
          questionData: QuestionList,
          author: props.name,
        })
        .then((res) => {
          console.log(res);
          setReturnData(res.data);
          setFinalReview(false);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setFinalReview(true);
    }
  };

  const topicChangeHandler = (e) => {
    setTopic(e.target.value);
  };

  const backHandler = () => {
    console.log("go back");
    history.push("/");
  };

  return (
    <div className={classes.CreateForm}>
      {loading && <p>Loading</p>}
      {finalReview ? (
        <div className={classes.backdrop}>
          {!loading && !returnData ? (
            <div>
              <div className={classes.QuestionContainer}>
                <p className={classes.last}>Are you sure want to submit?</p>
                {QuestionList &&
                  QuestionList.map((question, index) => {
                    return (
                      <DisplayQ
                        review
                        data={question}
                        key={index}
                        index={index}
                      />
                    );
                  })}
              </div>
              <div className={classes.buttonSection}>
                <button
                  onClick={createHandler}
                  className={classes.SubmitButton}
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setFinalReview(false);
                  }}
                  className={classes.CancleButton}
                >
                  Cancle
                </button>
              </div>
            </div>
          ) : (
            <p className={classes.loading}>Loading</p>
          )}
        </div>
      ) : null}
      {returnData && (
        <div className={classes.backdrop}>
          <PopUp linkData={returnData} />
        </div>
      )}
      <h1>Create New Feedback Form</h1>
      <div className={classes.Container}>
        <div className={classes.TopicContainer}>
          <label className={classes.label}>Topic</label>
          <input
            value={topic ? topic : ""}
            onChange={topicChangeHandler}
            className={classes.Topic}
            placeholder="untitled"
          />
        </div>
        {QuestionList &&
          QuestionList.map((question, index) => {
            return (
              <DisplayQ
                delete={deleteHandler}
                key={index}
                index={index}
                testMode
                data={question}
              />
            );
          })}
        <CreateQ add={Q_AddHandler} />
        <button
          disabled={!isReadyToSubmit}
          onClick={createHandler}
          className={classes.CreateButton}
        >
          Create
        </button>
        <button onClick={backHandler} className={classes.BackButton}>
          Back
        </button>
      </div>
    </div>
  );
};

export default CreateForm;
