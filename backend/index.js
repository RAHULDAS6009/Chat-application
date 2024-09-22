const express=require("express");
const connectDB = require("./config/db");
const userRouter = require("./routes/user")
const chatRouter=require("./routes/chat")
const messagesRouter=require("./routes/messages")
const app=express();
const cors=require("cors")

require('dotenv').config();
connectDB();

//parse into json format
app.use(express.json());
app.use(cors())

//routes
app.use("/api/v1/user/",userRouter);
app.use("/api/v1/chat",chatRouter);
app.use("/api/v1/messages",messagesRouter);


app.get("/",(req,res)=>{
    res.send("hello")
})

const PORT=5000;
app.listen(process.env.PORT,()=>{
    console.log(`Server is running ${PORT}`);
})