import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

//componennt
import objective from "./Objective";
import subjective from "./Subjective";

//classes
import classes from "./View.css";

const View = (props) => {
  const [responseData, setResponseData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [activeSummaryIndex, setActiveSummaryIndex] = useState(null);

  const params = useParams();

  useEffect(() => {
    console.log(params, props);
    if(props.uid){
    axios
      .get(`/feedback/${props.uid}/view_response/${params.feedbackId}`)
      .then((res) => {
        console.log(res);
        setResponseData(res.data);
      })
      .catch((err) => {
        console.log(err, err.response);
      });
    }
  }, []);

  useEffect(() => {
    if (responseData) {
      let tempAnsSummary = [];
      responseData.questionData.forEach((question, q_index) => {
        if (question.type === "Objective") {
          let optionCount = new Array(question.options.length + 1).fill(0);
          let totalResponse = 0;
          let SummaryEle = {};
          if (responseData.answerData.length) {
            responseData.answerData.forEach((user_answer, a_index) => {
              if (user_answer.answer[q_index] !== null) {
                optionCount[user_answer.answer[q_index]] += 1;
                totalResponse++;
              } else {
                optionCount[optionCount.length - 1] += 1;
              }
            });
            question.options.forEach((optionV, index) => {
              SummaryEle[optionV] = Math.round((optionCount[index] * 100) / totalResponse);
            });
          } else {
            question.options.forEach((optionV, index) => {
              SummaryEle[optionV] = 0;
            });
          }
          SummaryEle["Not Answered"] = optionCount[optionCount.length - 1];
          SummaryEle["total_responses"] = totalResponse;
          tempAnsSummary.push(SummaryEle);
        } else if (question.type === "Subjective") {
          tempAnsSummary.push({ type: "Subjective" });
        }
      });
      setSummary(tempAnsSummary);
    }
  }, [responseData]);

  return (
    responseData && (
      <div className={classes.View}>
        <div className={classes.Container}>
          <div className={classes.Share}>
            <div>
              <label>Code</label>
              <p>{responseData.code}</p>
            </div>
            <div>
              <label>Link</label>
              <p>{responseData.linkEndPoint}</p>
            </div>
          </div>
          <div className={classes.TopicContainer}>
            <div className={classes.Head1 + " " + classes.Head}>
              <div className={classes.Title}>{responseData.topic}</div>
            </div>
            <div className={classes.Head2 + " " + classes.Head}>
              <div className={classes.Sec}>
                <label>Author</label>
                <p className={classes.Author}>{responseData.author}</p>
              </div>
              <div className={classes.Sec}>
                <label>Date</label>
                <p className={classes.Date}>{responseData.date}</p>
              </div>
            </div>
            <div className={classes.Head3 + " " + classes.Head}>
              <div className={classes.Sec}>
                <label>Responses</label>
                <p className={classes.Responses}>
                  {responseData.answerData.length}
                </p>
              </div>
            </div>
          </div>

          {/* -------main section------- */}

          <div className={classes.Main}>
            <div className={classes.HeadTitle}>
              <div className={classes.Question + " " + classes.Box}>
                <p className={classes.TitleQ}>Questions</p>
                <div className={classes.QuestionBox}>
                  {responseData.questionData.map((question, index) => {
                    return (
                      <div key={index} className={classes.Que}>
                        <p className={classes.QuestionStatement}>
                          {question.q_statement}
                        </p>
                        <p
                          onClick={() => {
                            setActiveSummaryIndex(index);
                          }}
                          className={classes.QuestionType}
                        >
                          {question.type === "Subjective"
                            ? subjective(15)
                            : objective(15)}
                        </p>
                        {summary && index === activeSummaryIndex && (
                          <div className={classes.SummaryChart}>
                            {question.type === "Objective" ? (
                              Object.keys(summary[index]).map((key) => {
                                if (key !== "total_responses") {
                                  console.log(key, summary[index][key]);
                                  return (
                                    <div className={classes.SummaryEle}>
                                      <p>{key}</p>
                                      <div>
                                        <p>
                                          {(summary[index][key] *
                                            summary[index]["total_responses"]) /
                                            100}
                                        </p>
                                        <p>{summary[index][key]}%</p>
                                      </div>
                                    </div>
                                  );
                                }
                              })
                            ) : (
                              <p className={classes.SummaryEle}>
                                Subjective Question
                              </p>
                            )}
                            <p
                              onClick={() => {
                                setActiveSummaryIndex(null);
                              }}
                              style={{
                                cursor: "pointer",
                                color: "#df5353",
                                fontSize: "0.8rem",
                                fontWeight: "700",
                                textAlign: "center",
                                padding: "2px",
                              }}
                            >
                              Close
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={classes.Answer + " " + classes.Box}>
                <p className={classes.TitleA}>Answers</p>
                <div className={classes.AnswerContainer}>
                  {responseData.answerData &&
                    responseData.answerData.map((answers, index1) => {
                      return (
                        <div key={index1} className={classes.AnswerBox}>
                          <p className={classes.user_title}>{answers.name} {answers.type && `(${answers.type})`}</p>
                          <div className={classes.AnsContainer}>
                            {answers.answer.map((val, index) => {
                              if (responseData.questionData[index].type ==="Objective") {
                                return (
                                  <p
                                    style={{
                                      backgroundColor:
                                        responseData.questionData[index]
                                          .options[val] !== null
                                          ? "#C7FFCE"
                                          : "#FFD8C7",
                                    }}
                                    key={index}
                                    className={classes.Ans}
                                  >
                                    {
                                      responseData.questionData[index].options[
                                        val
                                      ]
                                    }
                                  </p>
                                );
                              } else if (
                                responseData.questionData[index].type ===
                                "Subjective"
                              ) {
                                return (
                                  <p
                                    style={{
                                      backgroundColor:
                                        val !== null ? "#C7FFCE" : "#FFD8C7",
                                    }}
                                    key={index}
                                    className={classes.Ans}
                                  >
                                    {val}
                                  </p>
                                );
                              }
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default View;
