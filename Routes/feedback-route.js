const express = require("express");
// const firebase = require("../database");
// const db = firebase.firestore();
const { UserRoute, feedbackUidAdding } = require("./user-route");
const feedback = require("../models/feedback.js");
const { responseRoute } = require("./response-route");
const response = require("../models/response");
const Route = express.Router();

const randomChar = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

//generate code
function generateCode() {
  let generatedCode = "";
  for (let i = 0; i < 5; i++) {
    let tempRandomNumber = Math.floor(Math.random() * 36);
    generatedCode += randomChar[tempRandomNumber];
  }
  console.log(generatedCode);
  return generatedCode;
}

// //creat/e feedback - authorised
// Route.post("/create", async (req, res, next) => {
//   let date = new Date();
//   date = (date + "").split(" ").splice(1, 3).join(" ");
//   let code = generateCode();
//   let linkEndPoint = `${req.body.uid}/${code}`;
//   console.log(req.body);
//   let sendFedData = {
//     author: req.body.author,
//     user_uid: req.body.uid,
//     date: date,
//     topic: req.body.topic,
//     questionData: req.body.questionData,
//     code: code,
//     linkEndPoint: linkEndPoint,
//   };
//   console.log(sendFedData);

//   await db
//     .collection("feedback")
//     .add(sendFedData)
//     .then(async (response) => {
//       // console.log(response.id)
//       // console.log(response)
//       await feedbackUidAdding(req.body.uid, response.id);
//       res.send({ code: code, link: linkEndPoint });
//     })
//     .catch((err) => {
//       res.status(400).send({ message: err.message, status: 400 });
//     });
Route.post("/create", async (req, res, next) => {
  let date = new Date();
  date = (date + "").split(" ").splice(1, 3).join(" ");
  let code = generateCode();
  let linkEndPoint = `${req.body.uid}/${code}`;
  console.log(req.body);
  let sendFedData = new feedback({
    author: req.body.author,
    user_uid: req.body.uid,
    date: date,
    topic: req.body.topic,
    questionData: req.body.questionData,
    code: code,
    linkEndPoint: linkEndPoint,
  });
  console.log(sendFedData);
  await sendFedData.save();
  console.log(req);
  res.send("data recieved");
});

// //get created feedback
// Route.get("/:uid/created", async (req, res, next) => {
//   console.log(req.params);
//   // await db.collection("feedback").
//   await db
//     .collection("feedback")
//     .where("user_uid", "==", req.params.uid)
//     .get()
//     .then((querySnapshot) => {
//       // console.log(querySnapshot)
//       if (!querySnapshot.size) {
//         res.send([]);
//       }
//       let tempFeedbackList = [];
//       let count = 0;
//       querySnapshot.forEach(async (doc) => {
//         // console.log(doc.data(), doc.id)

//         await db
//           .collection("responses")
//           .where("feedback_uid", "==", doc.id)
//           .get()
//           .then((snapshot) => {
//             let size = 0;
//             snapshot.forEach((doc) => {
//               if (doc.data().status === "submitted") {
//                 size++;
//               }
//             });
//             // console.log("je;;p")
//             // console.log({...doc.data(), responses: snapshot.size})
//             tempFeedbackList.push({
//               ...doc.data(),
//               responses: size,
//               feedback_uid: doc.id,
//             });
//             console.log(doc.data());
//             count++;
//             console.log(count, querySnapshot.size);
//             if (count === querySnapshot.size) res.send(tempFeedbackList);
//           })
//           .catch((err) => {
//             throw new Error("No feedback found!");
//           });
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(400).send(err);
//     });
// });
Route.get("/:uid/created", async (req, res, next) => {
  console.log(req.params);
  try {
    let createdList = [];
    createdList = await feedback.find({ user_uid: req.params.uid });
    return res.status(200).send(createdList);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// Route.get("/:user_uid/view_response/:feedback_uid", async (req, res, next) => {
//   console.log(req.params);

//   await db
//     .collection("feedback")
//     .doc(req.params.feedback_uid)
//     .get()
//     .then(async (feedbackDoc) => {
//       // console.log(querySnapshot)
//       let feedbackData = {
//         ...feedbackDoc.data(),
//       };
//       let tempFeedbackList = [];

//       await db
//         .collection("responses")
//         .where("feedback_uid", "==", req.params.feedback_uid)
//         .get()
//         .then((snapshot) => {
//           count = 0;
//           snapshot.forEach(async (doc) => {
//             count++;

//             if (doc.data().status === "submitted") {
//               tempFeedbackList.push({
//                 answer: doc.data().answer_data,
//                 user_uid: doc.data().user_uid,
//                 name: doc.data().user_name,
//                 type: doc.data().type,
//               });
//             }
//           });
//           console.log(count, snapshot.size);

//           if (count === snapshot.size) {
//             feedbackData["answerData"] = tempFeedbackList;
//             res.send(feedbackData);
//           }
//         })
//         .catch((err) => {
//           throw new Error("No feedback found!");
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(400).send(err);
//     });
// });

Route.get("/:user_uid/view_response/:feedback_uid", async (req, res, next) => {
  console.log(req.params);
  try {
    const feedbackDoc = await feedback.find({
      user_uid: req.params.feedback_uid,
    });
    let feedbackData = {
      ...feedbackDoc.data(),
    };
    const snapshot = await response.find({
      feedback_uid: req.params.feedback_uid,
    });
    count = 0;
    let tempFeedbackList = [];
    if (snapshot) {
      snapshot.forEach((doc) => {
        count++;

        if (doc.status === "submitted") {
          tempFeedbackList.push({
            answer: doc.answer_data,
            user_uid: doc.user_uid,
            name: doc.user_name,
            type: doc.type,
          });
        }
      });
      console.log(count, snapshot.size);

      if (count === snapshot.size) {
        feedbackData["answerData"] = tempFeedbackList;
        res.send(feedbackData);
      }
    } else throw new Error("No feedback found!");
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

const getFeedbackUidFromCode = async (code) => {
  let feedbackUid = "";
  let feedback_user_uid = "";
  //   await db
  //     .collection("feedback")
  //     .where("code", "==", code)
  //     .get()
  //     .then((snapshot) => {
  //       snapshot.forEach((doc) => {
  //         // console.log(doc.data(), doc.id)
  //         feedbackUid = doc.id;
  //         feedback_user_uid = doc.data().user_uid;
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   return { feedbackUid, feedback_user_uid };
  try {
    const feedback_func = await feedback.find({ code: code });
    feedback_func.forEach((f) => {
      feedbackUid = f.id;
      feedback_user_uid = f.user_uid;
    });

    return { feedbackUid, feedback_user_uid };
  } catch (err) {
    res.status(404).send(err.message);
  }
};

module.exports = {
  FeedbackRoute: Route,
  getFeedbackUid: getFeedbackUidFromCode,
};
