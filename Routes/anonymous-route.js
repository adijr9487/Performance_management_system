const express = require("express")
const firebase = require("../firebase")
const db = firebase.firestore()
const {UserRoute, feedbackUidAdding} = require("./user-route")
const Route = express.Router()

const randomChar = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

//join form anonymously
Route.post("/join", async (req, res, next)=>{
    console.log(req.body)
    await db.collection("feedback").where("code", "==", req.body.code).get()
    .then(snap=>{
        snap.forEach(doc=>{
            console.log(doc.data())
            let tempSendFeedback = {
                author: doc.data().author,
                questionData: doc.data().questionData,
                date: doc.data().date,
                topic: doc.data().topic,
                feedback_uid: doc.id
            }
            res.send(tempSendFeedback)
        })
    })
    .catch(err=>{
        res.status(400).send(err.message)
    })

})

// submit form anonymously 
Route.post("/response/submit", async (req, res, next)=>{
    console.log(req.body)
    console.log(req.body.answerArray)

    await db.collection("responses").doc().set({status: "submitted", user_name: req.body.name, answer_data: req.body.answerArray, feedback_uid: req.body.feedback_uid, type: "ano"})
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


//generate code
function generateCode(){
    let generatedCode = ""
    for(let i=0; i<5; i++){
        let tempRandomNumber = Math.floor(Math.random()*36)
        generatedCode += randomChar[tempRandomNumber]
    }
    console.log(generatedCode)
    return generatedCode
}

// //create anonymous form
// Route.post("/feedback/create", async (req, res, next)=>{
//     let date = new Date()
//     date = (date+"").split(" ").splice(1, 3).join(" ")
//     let code = generateCode()
//     console.log(req.body)
//     let sendFedData = {
//         author: req.body.author,
//         date: date,
//         topic: req.body.topic,
//         questionData: req.body.questionData,
//         code: code,
//     }
//     console.log(sendFedData)

//     await db.collection("feedback").add(sendFedData)
//     .then(async response=>{
//         // console.log(response.id)
//         // console.log(response)
//         res.send({code: code, link: `${response.id}/anonymous/${req.body.author}/${code}`})

//     })
//     .catch(err=>{
//         res.status(400).send({message: err.message, status: 400})
//     })

//     console.log(req)
//     res.send("data recieved")
// })


module.exports = Route