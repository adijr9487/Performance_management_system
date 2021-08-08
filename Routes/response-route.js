const e = require("express")
const express = require("express")
const firebase = require("../firebase")
const db = firebase.firestore()

const {FeedbackRoute, getFeedbackUid} = require("./feedback-route")
const {addingResponse} = require("./user-route")

const Route = express.Router()

Route.post("/join", async (req, res, next)=>{
    try{
        console.log(req.body)
        // getting feedback uid
        let {feedbackUid, feedback_user_uid} = await getFeedbackUid(req.body.code)
        let name = ""
        console.log(feedbackUid, feedback_user_uid)
        if(feedback_user_uid === req.body.uid){
            throw new Error("You cannot join your own feedback form!")
        }
        await db.collection("user_data").doc(req.body.uid).get()
        .then(user_data=>{
            name = user_data.data().name
        })
        .catch(err=>{
            throw new Error("Cannot find Name of User!")
        })
        // check if feedbackUid and user uid present in same response data 
        if(feedbackUid === ""){
            throw new Error("Invalid code")
        }
        await db.collection("responses").where("user_uid", "==", req.body.uid).get()
        .then(async snapshot=>{
            let feedbackExist = false
            snapshot.forEach(snap=>{
                console.log(snap.data())
                if(snap.data().feedback_uid === feedbackUid){
                    console.log("feedback already exit")
                    feedbackExist = (feedbackExist || true)
                }
            })
            console.log(feedbackExist)
            if(feedbackExist){
                // feedback already joined
                console.log("already joined")
                res.send({status: "201", message: "You are already joined to this feedback"})
            }else{
                
                console.log("not joined")
                //creating response
                await db.collection("responses").add({
                    feedback_uid: feedbackUid,
                    user_uid: req.body.uid,
                    answer_data: [],
                    status: "not submitted",
                    user_name: name
                })
                .then(async response=>{
                    console.log(response.id)
                    //send response id
                    let value = await addingResponse(req.body.uid, response.id)
                    console.log(value)
                    if(value){
                        res.send({status: "200", message: "response created successfully"})
                    }
                })
                .catch(err=>{
                    console.log(err)
                    res.status(400).send({message: err.message})
                })
            }
        })
        .catch(err=>{
            console.log(err)
            res.status(400).send({message: err.message})
        })

        
    }
    catch(err){
        console.log(err)
        res.status(400).send({message: err.message})
    }
        
})

//get joined forms
Route.get("/:uid/joined", async (req, res, next)=>{
    console.log(req.params)
    // await db.collection("feedback").
    let tempFeedbackDataArray = []
    await db.collection("responses").where("user_uid", "==", req.params.uid).get()
    .then(async querySnapshot=>{
        // console.log(querySnapshot)
        console.log(querySnapshot.empty)
        if(querySnapshot.empty){
            res.send([])
        }else {
            let count = 0
            await querySnapshot.forEach(async doc=>{
                
                await db.collection("feedback").doc(doc.data().feedback_uid).get()
                .then(res=>{
                    // console.log(doc.data().id, doc.id)
                    let tempFeedbackData = {
                        status: doc.data().status,
                        questionData: res.data().questionData,
                        date: res.data().date,
                        author: res.data().author,
                        topic: res.data().topic,
                        response_id: doc.id
                    }
                    tempFeedbackDataArray.push(tempFeedbackData)
                })
                .catch(err=>{
                    console.log(err)
                })
                count++
                console.log(tempFeedbackDataArray)
                if(tempFeedbackDataArray.length>0 && querySnapshot.size === count){
                    res.send(tempFeedbackDataArray)
                }
            })
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(400).send(err)
    })
    
})

//give response
Route.get("/:responseId/:userId", async (req, res, next)=>{
    console.log(req.params)
    await db.collection("responses").doc(req.params.responseId).get()
    .then(async responseData=>{
        console.log(responseData.data())
        if(responseData.data().user_uid === req.params.userId){
            //if user is same as repsonse
            // then send response data
            await db.collection("feedback").doc(responseData.data().feedback_uid).get()
            .then(response=>{
                // console.log(doc.data().id, doc.id)
                if(responseData.data().status === "not submitted"){
                    let tempFeedbackData = {
                        questionData: response.data().questionData,
                        date: response.data().date,
                        author: response.data().author,
                        topic: response.data().topic,
                    }
                    res.send(tempFeedbackData)
                }else{
                    throw new Error("User has already submitted the repsonse")
                }
            })
            .catch(err=>{
                res.status(400).send(err.message)
            })

        }else{
            throw new Error("User is not joined to this form")
        }
        
    })
    .catch(err=>{
        console.log(err)
        res.status(400).send(err.message)
    })
                
})


//review response
Route.get("/:responseId/:userId/review_response", async (req, res, next)=>{
    console.log(req.params)
    await db.collection("responses").doc(req.params.responseId).get()
    .then(async responseData=>{
        // console.log(responseData.data())
        if(responseData.data().user_uid === req.params.userId){
            //if user is same as repsonse
            // then send response data
            await db.collection("feedback").doc(responseData.data().feedback_uid).get()
            .then(response=>{
                // console.log(doc.data().id, doc.id)
                if(responseData.data().status === "submitted"){
                    let tempFeedbackData = {
                        questionData: response.data().questionData,
                        date: response.data().date,
                        author: response.data().author,
                        topic: response.data().topic,
                        answerData: responseData.data().answer_data,
                        status: responseData.data().status
                    }
                    console.log(tempFeedbackData)
                    res.send(tempFeedbackData)
                }else{
                    throw new Error("User has already submitted the repsonse")
                }
            })
            .catch(err=>{
                res.status(400).send(err.message)
            })

        }else{
            throw new Error("User is not joined to this form")
        }
        
    })
    .catch(err=>{
        console.log(err)
        res.status(400).send(err.message)
    })
                
})

Route.post("/:responseUid/submit", async (req, res, next)=>{
    console.log(req.params)

    console.log(req.body.answerArray)
    await db.collection("responses").doc(req.params.responseUid).update({status: "submitted", answer_data: req.body.answerArray})
    .then(response=>{
        console.log(response)
        //update feedback
        console.log(response)
        res.send({status: 200, message: "Feedback form sucessfully submitted"})
    })
    .catch(err=>{
        console.log(err)
        res.send({status: 400, message: err.message})
    })
})

module.exports = Route