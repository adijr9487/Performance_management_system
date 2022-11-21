const express = require("express");
// const firebase = require("../database");
// const db = firebase.firestore();
const bcrypt = require("bcrypt");
const userdata = require("../models/userdata.js");
const useradditionaldata = require("../models/useradditionaldata");
const jwt = require("jsonwebtoken");
// const { createError } = require("../utils/error.js");

const Route = express.Router();

//login route

// Route.post("/login", async (req, res, next) => {
//   try {
//     console.log(req.body);
//     // db.collection("user_data").doc().set()
//     await db
//       .collection("user_data")
//       .doc(req.body.email)
//       .get()
//       .then(async (doc) => {
//         console.log(doc.exists);
//         if (doc.exists) {
//           if (req.body.password === doc.data().password) {
//             // console.log(doc.id, doc)
//             let sendingData = {
//               name: doc.data().name,
//               response: doc.data().response,
//               feedback: doc.data().feedback,
//               uid: doc.id,
//             };
//             res.send({
//               userData: sendingData,
//               message: "User Successfully Logged In",
//             });
//           } else {
//             throw new Error("Incorrect Password!");
//           }
//         } else {
//           throw new Error("No user found!");
//         }
//       })
//       .catch((err) => {
//         console.log(err.message);
//         res.status(403).send({ message: err.message });
//       });
//   } catch (err) {
//     console.log("err", err.message);
//     res.status(400).send(err);
//   }
// });
Route.post("/login", async (req, res, next) => {
  try {
    const user = await useradditionaldata.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User does not exist");
    }

    const isPassword = await bcrypt.compare(req.body.password, user.password);

    if (!isPassword) {
      throw new Error("Incorrect Password!");
    }

    const token = jwt.sign({ id: user._id }, process.env.jwt);
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ token: token });
  } catch (err) {
    console.log("err", err.message);
    next(err);
  }
});

// //signup route
// Route.post("/signup", async (req, res, next) => {
//   try {
//     console.log(req.body);
//     let beforeSendData = {
//       name: req.body.name,
//       password: req.body.password,
//       response: [], //array where response id is stored
//       feedback: [], //array where feedback id you created is stored
//     };
//     await db
//       .collection("user_data")
//       .doc(req.body.email)
//       .get()
//       .then(async (doc) => {
//         console.log(doc.exists);

//         if (doc.exists) {
//           throw new Error("user already exist");
//         } else {
//           await db
//             .collection("user_data")
//             .doc(req.body.email)
//             .set(beforeSendData)
//             .then((data) => {
//               console.log(data);
//               let sendingData = {
//                 name: beforeSendData.name,
//                 response: beforeSendData.response,
//                 feedback: beforeSendData.feedback,
//                 uid: req.body.email,
//               };
//               res.send({
//                 userData: sendingData,
//                 message: "New User Registered",
//               });
//             })
//             .catch((err) => {
//               console.log(err.message);
//               res.status(403).send({ message: err.message });
//             });
//         }
//       })
//       .catch((err) => {
//         console.log(err.message);
//         res.status(403).send({ message: err.message });
//       });
//   } catch (err) {
//     console.log(err.message);
//     res.status(400).send(err.message);
//   }
// });

Route.post("/signup", async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new useradditionaldata({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });

    //FOR SAVING INTO USERDATA
    const userBeforeData = new userdata({
      name: req.body.name,
      password: hash,
      uid:req.body.email,
      response: [], //array where response id is stored
      feedback: [], //array where feedback id you created is stored
    })

    const token = jwt.sign({ id: newUser._id }, process.env.JWT);
    await newUser.save();
    await userBeforeData.save();
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ token: token });
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

// Route.get("/getUserData/:user_uid", async (req, res, next) => {
//   console.log(req.params, "helo");
//   await db
//     .collection("user_data")
//     .doc(req.params.user_uid)
//     .get()
//     .then(async (doc) => {
//       res.send({ ...doc.data() });
//     })
//     .catch((err) => {
//       res.status(400).send(err.message);
//     });
// });
Route.get("/getUserData/:user_uid", async (req, res, next) => {
 try{
  const userData = await useradditionaldata({uid:req.params.user_uid});
  res.status(200).send(userData);
 }
 catch(err){
  res.status(404).send(err.message);
 }
});

// const addingFeedbackUIDtoUserData = async (user_uid, feedbackUid) => {
//   console.log(user_uid, feedbackUid);
//   // await db.collection("user_data").doc(user_uid).update({feedback: [feedbackUid]})
//   await db
//     .collection("user_data")
//     .doc(user_uid)
//     .get()
//     .then(async (res) => {
//       console.log(res.data());

//       const Updatedfeedback = [...res.data().feedback, feedbackUid];
//       console.log(Updatedfeedback);
//       await db
//         .collection("user_data")
//         .doc(user_uid)
//         .update({ feedback: Updatedfeedback })
//         .then((data) => {
//           console.log(data);
//           return 1;
//         })
//         .catch((err) => {
//           console.log(err.message);
//           return err;
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

const addingFeedbackUIDtoUserData = async (user_uid, feedbackUid) => {
    try{
      const user_data = await userdata.updateOne({uid:user_uid},{$push:{feedback:feedbackUid}});
      res.status(200).send(user_data);
    } 
    catch(err) {
      console.log(err);
    };
};

// const addingResponseIdToUser = async (user_uid, response_uid) => {
//   let returnValue = "";
//   await db
//     .collection("user_data")
//     .doc(user_uid)
//     .get()
//     .then(async (res) => {
//       console.log(res.data());

//       const Updatedresponse = [...res.data().response, response_uid];
//       console.log(Updatedresponse);
//       await db
//         .collection("user_data")
//         .doc(user_uid)
//         .update({ response: Updatedresponse })
//         .then((data) => {
//           returnValue = true;
//         })
//         .catch((err) => {
//           returnValue = false;
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//       returnValue = err;
//     });
//   return returnValue;
// };

const addingResponseIdToUser = async (user_uid, response_uid) => {
    try{
      const user_data = await userdata.updateOne({uid:user_uid},{$push:{response:response_uid}});
      res.status(200).send(user_data);
    }catch(err){
      res.status(404).send(err.message);
    }
};

module.exports = {
  UserRoute: Route,
    feedbackUidAdding: addingFeedbackUIDtoUserData,
    addingResponse: addingResponseIdToUser,
};
