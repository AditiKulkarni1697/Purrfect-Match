const express = require("express");
const cookieParser = require("cookie-parser");

const { connection } = require("./databases/connection");
const {userRouter} = require("./routes/user.routes");
const { profileRouter } = require("./routes/profile.routes");
const { connectionRequestRouter } = require("./routes/connectionRequest.routes");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/request", connectionRequestRouter);

app.use("/", (err,req,res,next)=>{
    console.log("error",err);
    res.status(500).send("Internal server error");
});


try{
    connection();
    console.log("Database connected successfully");

    app.listen(process.env.PORT, async()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
    }
);
}catch(err){
    console.log(err)
}
    