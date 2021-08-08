const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")

//requiring routes
const {UserRoute} = require("./Routes/user-route")
const {FeedbackRoute, getFeedbackUid} = require("./Routes/feedback-route")
const ResponseRoute = require("./Routes/response-route")

const app = express();

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));

//initiating routes API
app.use("/user", UserRoute)
app.use("/feedback", FeedbackRoute)
app.use("/response", ResponseRoute)

//joininig to the build of client

if(process.env.NODE_ENV === "production"){
    app.use(express.static("front-pms/build"))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'front-pms', 'build', 'index.html'))
    })
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});