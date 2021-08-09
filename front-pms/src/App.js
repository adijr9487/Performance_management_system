import React, {useState, useEffect} from "react"
import {
  Switch,
  Route,
  Link,
  Redirect,
  useHistory
} from "react-router-dom"

// component
import EntryPage from "./Components/EntryPage/EntryPage"
import Navbar from "./Components/Navbar/Navbar"

import Portfolio from "./Components/Portfolio/Portfolio"
import Profile from "./Components/Profile/Profile"
import Create from "./Components/Create/Create"
import JoinPage from "./Components/Join/JoinPage"
import HomePage from "./Components/HomePage/HomePage"
import ResponseAction from "./Components/Feedback/ResponseAction/ResponseAction"
import View from "./Components/Feedback/View/View"


// classes


function App() {

  const [Token, setToken] = useState(null)
  let history = useHistory();

  useEffect(()=>{
    if(sessionStorage.getItem('anonym')){
      history.push("/anonymous/give_feedback")
      console.log("hello")
    }
    if(sessionStorage.getItem('token')){
      setToken(JSON.parse(sessionStorage.getItem('token')))
      history.push("/")
    }else{
      setToken(null)
    }

  }, [sessionStorage])

  const authenticationHandler = ()=>{
    setToken(JSON.parse(sessionStorage.getItem('token')))
    history.push("/")
  }

  const logoutHandler = () => {
    sessionStorage.clear()
    setToken(null)
    history.push("/authentication")
            
  }

  const setAnonymousFeedback = (data) => {
    sessionStorage.setItem("anonym", JSON.stringify(data));
    history.push("/anonymous/give_feedback")
  }

  return (
    <div className="App">
      {
        Token && Token.uid
        ?
        <React.Fragment>
            <Navbar user={Token} logoutHandler={logoutHandler}/>
          <Switch>
            <Route path="/" exact><HomePage user={Token}/></Route>
            <Route path="/give_response/:responseId"><ResponseAction uid={Token.uid} type="give"/></Route>
            <Route path="/review_response/:responseId"><ResponseAction type="review" uid={Token.uid}/></Route>
            <Route path="/view_responses/:feedbackId" exact><View uid={Token.uid}/></Route>
            <Route path="/:userId/portfolio"><Portfolio uid={Token.uid}/></Route>
            <Route path="/:userId/create"><Create uid={Token.uid} name={Token.name}/></Route>
            <Route path="/:userId/join"><JoinPage uid={Token.uid}/></Route>
            <Route path="/:userId/profile"><Profile uid={Token.uid}/></Route>
            <Redirect to="/" />
          </Switch>
        </React.Fragment>
        :
        <Switch>
          <Route path="/authenticate" >
            <EntryPage AnonymousFeedbackData={setAnonymousFeedback} authenticateUser={authenticationHandler}/>
          </Route>
          <Route path="/anonymous/give_feedback"><ResponseAction type="give"/></Route>
          <Route path="/anonymous/create_feedback"><Create anonymous/></Route>
          <Route path="/:feedback_uid/anonymous/:user_name/:code"><View /></Route>
          <Redirect to="/authenticate" />
        </Switch>
      }
    </div>
  );
}

export default App;
