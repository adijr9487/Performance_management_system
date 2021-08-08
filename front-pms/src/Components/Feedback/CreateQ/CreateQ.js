import React, { useEffect, useState } from "react";
import add from "../../../util/Icons/add";
import cross from "../../../util/Icons/cross";

//compomnent
import Slider from "../../Button/Slider/Slider";

//classes
import classes from "./CreateQ.css";

const CreateQ = (props) => {
  const [q_statement, setQ_statement] = useState(null);
  const [Q_data, setQ_data] = useState(null);
  const [type, setType] = useState("Subjective");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (type === "Subjective") {
      setQ_data({
        word_limit: 250,
      });
      if (q_statement) {
        setIsActive(true);
      }
    } else if (type === "Objective") {
      setQ_data({
        options: [],
        tempOption: null,
      });
      setIsActive(false);
    }
  }, [type]);

  useEffect(() => {
    if (q_statement !== null && type && Q_data) {
      console.log(q_statement, type, Q_data);
      if (type === "Subjective") {
        if (q_statement.length && Q_data.word_limit > 0) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      } else if (type === "Objective") {
        console.log(q_statement.length && Q_data.options.length > 0);
        if (q_statement.length && Q_data.options.length > 0) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      }
    }
  }, [Q_data, q_statement, type]);

  const typeHandler = (data) => {
    setType(data);
    if (data === "Subjective") {
      setQ_data({
        word_limit: 250,
      });
    } else if (data === "Objective") {
      setQ_data({
        options: [],
        tempOption: null,
      });
    }
  };

  const changeHandler = (e) => {
    if (e.target.name === "question") {
      setQ_statement(e.target.value);
    }
    if (e.target.name === "limit") {
      console.log("hello");
      if (!(parseInt(e.target.value) === NaN) || e.target.value === "") {
        setQ_data((prev) => ({
          ...prev,
          word_limit: e.target.value === "" ? 0 : parseInt(e.target.value),
        }));
      }
    }
  };

  const clearOptionHandler = (index) => {
    console.log(index);
    setQ_data((prev) => {
      let tempOptions = [...prev.options];
      tempOptions.splice(index, 1);
      console.log(tempOptions);
      return {
        ...prev,
        options: tempOptions,
      };
    });
  };

  const optionChangeHandler = (e) => {
    setQ_data((prev) => ({
      ...prev,
      tempOption: e.target.value,
      warning: null,
    }));
  };

  const Addclicked = () => {
    console.log("clickced");
    setQ_data((prev) => {
      let tempOptions = [...prev.options];
      if (prev.tempOption !== null) {
        tempOptions.push(prev.tempOption);
        return {
          options: tempOptions,
          tempOption: null,
        };
      } else {
        return {
          ...prev,
          warning: "Can't append empty!",
        };
      }
    });
  };

  const OptionKeyPressHandler = (e) => {
    if (e.code === "Enter") {
      setQ_data((prev) => {
        let tempOptions = [...prev.options];
        if (prev.tempOption !== null) {
          tempOptions.push(prev.tempOption);
          return {
            options: tempOptions,
            tempOption: null,
          };
        } else {
          return {
            ...prev,
            warning: "Can't append empty!",
          };
        }
      });
    }
  };
  const allClearHandler = () => {
    setQ_data((prev) => ({
      ...prev,
      options: [],
    }));
  };

  const resetData = () => {
    if (type === "Subjective") {
      setType("Subjective");
      setQ_data({
        word_limit: 250,
      });
      setIsActive(false);
      setQ_statement(null);
    } else if (type === "Objective") {
      setType("Objective");
      setQ_data({
        options: [],
        tempOption: null,
      });
      setIsActive(false);
      setQ_statement(null);
    }
  };

  const addHandler = () => {
    if (q_statement === "" || q_statement === null) {
      return;
    }
    let final_Q_data = {
      q_statement: q_statement,
      type: type,
    };
    if (type === "Subjective") {
      if (Q_data.word_limit === 0) {
        return;
      }
      final_Q_data = {
        ...final_Q_data,
        word_limit: Q_data.word_limit,
      };
    } else if (type === "Objective") {
      console.log(Q_data.options);
      if (Q_data.options.length === 0) {
        console.log("objective");
        return;
      }
      final_Q_data = {
        ...final_Q_data,
        options: Q_data.options,
      };
    }
    console.log(final_Q_data);
    props.add(final_Q_data);
    resetData();
  };

  return (
    Q_data && (
      <div className={classes.CreateQ}>
        <div className={classes.DefaultSection}>
          <div className={classes.p + " " + classes.p1}>
            <p className={classes.label}>Question Statement</p>
            <input
              onChange={(e) => changeHandler(e)}
              type="text"
              name="question"
              value={q_statement ? q_statement : ""}
              className={classes.Field}
              placeholder={"(e.g. How much you are satisfied with ...?)"}
            />
          </div>
          <Slider
            initialsIndex={1}
            changed={typeHandler}
            theme="dark"
            options={["Subjective", "Objective"]}
          />
        </div>
        {type === "Subjective" ? (
          Q_data.word_limit !== NaN && (
            <div className={classes.p + " " + classes.p2}>
              <p className={classes.label}>Word Limit</p>
              <input
                onChange={(e) => changeHandler(e)}
                type="text"
                name="limit"
                value={Q_data.word_limit}
                className={classes.Field}
              />
            </div>
          )
        ) : type === "Objective" ? (
          <div className={classes.p + " " + classes.p2}>
            <p className={classes.label}>Provide Options</p>
            <div className={classes.Options}>
              <p onClick={allClearHandler} className={classes.ClearAll}>
                Clear All{" "}
              </p>
              {Q_data.options &&
                Q_data.options.map((option, index) => {
                  return (
                    <div key={index} className={classes.Option}>
                      <p className={classes.Value}>{option}</p>
                      <p
                        onClick={() => clearOptionHandler(index)}
                        className={classes.Sym}
                      >
                        {cross("20")}
                      </p>
                    </div>
                  );
                })}

              <div className={classes.OptionINPUT}>
                <input
                  onKeyPress={OptionKeyPressHandler}
                  onChange={optionChangeHandler}
                  value={Q_data.tempOption ? Q_data.tempOption : ""}
                  className={classes.OptionInput}
                  type="text"
                />
                <div className={classes.Warning}>
                  {Q_data.warning && Q_data.warning}
                </div>
                {add("20", Addclicked)}
              </div>
            </div>
          </div>
        ) : null}
        <button
          disabled={!isActive}
          onClick={addHandler}
          className={classes.AddButton}
        >
          Add
        </button>
      </div>
    )
  );
};

export default CreateQ;
