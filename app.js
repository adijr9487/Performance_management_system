const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
//requiring routes
const {UserRoute} = require("./Routes/user-route")
const {FeedbackRoute, getFeedbackUid} = require("./Routes/feedback-route")
const ResponseRoute = require("./Routes/response-route")
const anonymousRoute = require("./Routes/anonymous-route")
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json())
app.use(cors(
  // {origin: "localhost:3000",}
))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//initiating routes API
app.use("/user", UserRoute)
app.use("/feedback", FeedbackRoute)
app.use("/response", ResponseRoute)

app.use("/anonymous", anonymousRoute)
app.use((err,req,res,next)=>{
    const errorStatus = err.status || 400;
    const errorMessage = err.message||"Something went wrong"

    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        Message:errorMessage,
        stack:err.stack
    })
})

//joininig to the build of client

if(process.env.NODE_ENV === "production"){
    app.use(express.static("front-pms/build"))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'front-pms', 'build', 'index.html'))
    })
}


//MONGO CONNECTION
const connect = async () =>{
    try {
         mongoose.connect(process.env.MONGO ,{
            useUnifiedTopology: true,
            useNewUrlParser: true
          });
        console.log('Connected to mongoDB');
      } catch (error) {
        throw error;
      }
}

mongoose.connection.on("connected",()=>{
    console.log('MongoDB connected');
})

mongoose.connection.on("disconnected",()=>{
  console.log('MongoDB disconnected');
})


const port = process.env.PORT || 5000;
app.listen(port, () => {
    connect();
    console.log(`Server started on port ${port}`);
});