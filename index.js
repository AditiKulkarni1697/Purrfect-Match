const express = require("express");
const { connection } = require("./databases/connection");
const {userRouter} = require("./routes/user.route");
require("dotenv").config();
const app = express();

app.use(express.json());

app.use("/user", userRouter);

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
    