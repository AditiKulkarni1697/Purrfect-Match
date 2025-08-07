const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http")
const { connection } = require("./databases/connection");
const {userRouter} = require("./routes/user.routes");
const { profileRouter } = require("./routes/profile.routes");
const { connectionRequestRouter } = require("./routes/connectionRequest.routes");
const { paymentRouter } = require("./routes/payment.routes");
const { initialSocket } = require("./utils/initializeSocket");
const { chatRouter } = require("./routes/chat.routes");


require("dotenv").config();
require("./utils/cronJobs")
const app = express();

const server = http.createServer(app)
initialSocket(server)


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/request", connectionRequestRouter);
app.use("/payment", paymentRouter)
app.use("/chat", chatRouter)

app.use("/", (err,req,res,next)=>{
    console.log("error",err);
    res.status(500).send("Internal server error");
});


try{
    connection();
    console.log("Database connected successfully");

    server.listen(process.env.PORT, async()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
    }
);
}catch(err){
    console.log(err)
}
    