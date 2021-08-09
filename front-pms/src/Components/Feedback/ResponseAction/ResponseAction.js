import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
//componnent
import DisplayQ from "../DisplayQ/DisplayQ";

//clases
import classes from "./ResponseAction.css";

const ResponseAction = (props) => {
  const [AnswerData, setAnswerData] = useState(null);
  const [QuestionData, setQuestionData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null)
  const [type, setType] = useState(props.type);

  let { responseId } = useParams();
  let history = useHistory();

  useEffect(() => {
    if(sessionStorage.getItem('anonym')){
        let responseData = JSON.parse(sessionStorage.getItem('anonym'))
        setQuestionData(responseData.questionData);
        setFormData({
            date: responseData.date,
            author: responseData.author,
            topic: responseData.topic,
            status: responseData.status,
            feedback_uid: responseData.feedback_uid
        });
        setAnswerData(new Array(responseData.questionData.length).fill(null))

    }else{
        if (type === "give") {
        console.log(responseId, props.uid);
        axios
            .get(`/response/${responseId}/${props.uid}`)
            .then((res) => {
            console.log(res);
            setQuestionData(res.data.questionData);
            setFormData({
                date: res.data.date,
                author: res.data.author,
                topic: res.data.topic,
                status: res.data.status,
            });
            setAnswerData(new Array(res.data.questionData.length).fill(null));
            })
            .catch((err) => {
            console.log(err);
            });
        } else if (type === "review") {
        console.log(responseId, props.uid);
        axios
            .get(`/response/${responseId}/${props.uid}/review_response`)
            .then((res) => {
            console.log(res);
            setQuestionData(res.data.questionData);
            setAnswerData(res.data.answerData);
            setFormData({
                date: res.data.date,
                author: res.data.author,
                topic: res.data.topic,
                status: res.data.status,
            });
            })
            .catch((err) => {
            console.log(err);
            });
        }
    }

  }, []);

  const setAnswerHandler = (value, index) => {
    console.log(value);
    setAnswerData((prev) => {
      let prevAns = [...prev];
      prevAns[index] = value === "" ? null : value;
      return prevAns;
    });
  };

  const submitHandler = () => {
    if (isReadyToSubmit === true) {
      setLoading(true);
      console.log("Submitted");
    if(sessionStorage.getItem('anonym')){
        axios
        .post(`/anonymous/response/submit`, { answerArray: AnswerData , name: name, feedback_uid: formData.feedback_uid})
        .then((res) => {
          console.log(res);
          setLoading(false);
          setSubmitted(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }else{
        axios
        .post(`/response/${responseId}/submit`, { answerArray: AnswerData })
        .then((res) => {
          console.log(res);
          setLoading(false);
          setSubmitted(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    } else {
      setIsReadyToSubmit(true);
    }
  };

  const backHandler = () => {
    console.log("go back");
    if(sessionStorage.getItem('anonym')){
        sessionStorage.removeItem('anonym')
    }
    history.push("/");
  };

  return (
    <div className={classes.ResponseAction}>
      {isReadyToSubmit ? (
        <div className={classes.Backdrop}>
          {!loading && !submitted ? (
            <div>
              <div className={classes.QuestionContainer}>
                <p className={classes.last}>Are you sure want to submit?</p>
                {AnswerData &&
                  QuestionData &&
                  QuestionData.map((question, index) => {
                    return (
                      <DisplayQ
                        review
                        answerValue={
                          AnswerData[index] !== null && AnswerData[index]
                        }
                        handlerAnswer={(value) =>
                          setAnswerHandler(value, index)
                        }
                        data={question}
                        key={index}
                        index={index}
                      />
                    );
                  })}
              </div>
              <div className={classes.buttonSection}>
                <button
                  onClick={submitHandler}
                  className={classes.SubmitButton}
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setIsReadyToSubmit(false);
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
      {submitted && (
        <div className={classes.Backdrop}>
          <div className={classes.Content}>
            <div
              className={classes.MessageHead}
              style={{
                backgroundColor:
                  submitted.status === 200
                    ? "#69dc69"
                    : submitted.status === 400
                    ? "#dc697b"
                    : "#ababab",
              }}
            >
              {submitted.message}
            </div>
            <div className={classes.Link}>
              {sessionStorage.getItem('anonym') ? <Link onClick={backHandler}>Go to Landing Page</Link> : <Link to={`/${props.uid}/portfolio`}>Go to Portfolio</Link>}
            </div>
          </div>
        </div>
      )}
      <div className={classes.Container}>
        {formData && (
          <div className={classes.TopicContainer}>
            <div className={classes.Head1 + " " + classes.Head}>
              <div className={classes.Title}>{formData.topic}</div>
            </div>
            <div className={classes.Head2 + " " + classes.Head}>
              <div className={classes.Sec}>
                <label>Author</label>
                <p className={classes.Author}>{formData.author}</p>
              </div>
              <div className={classes.Sec}>
                <label>Date</label>
                <p className={classes.Date}>{formData.date}</p>
              </div>
            </div>
            <div className={classes.Head3 + " " + classes.Head}>
              <div className={classes.Sec}>
                <label>Status</label>
                <p className={classes.Status}>{formData.status}</p>
              </div>
            </div>
          </div>
        )}

        <div className={classes.QuestionContainer}>
          {AnswerData &&
            QuestionData &&
            QuestionData.map((question, index) => {
              return (
                <DisplayQ
                  review={type === "review" ? true : false}
                  answerValue={AnswerData[index] !== null && AnswerData[index]}
                  handlerAnswer={(value) => setAnswerHandler(value, index)}
                  data={question}
                  key={index}
                  index={index}
                />
              );
            })}
        </div>
        {sessionStorage.getItem('anonym') && <div className={classes.NameField}><label>Name</label><input type="text" onChange={(e)=>{setName(e.target.value)}} value={name ? name : ""}/></div>}
        {type === "give" ? (
          <React.Fragment>
            <button onClick={submitHandler} className={classes.SubmitButton}>
              Submit
            </button>
            <button onClick={backHandler} className={classes.BackButton}>
              Back
            </button>
          </React.Fragment>
        ) : (
          <button onClick={backHandler} className={classes.BackButton}>
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default ResponseAction;
