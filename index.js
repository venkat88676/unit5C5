const express = require("express");
const connection = require("./config/db");
const { userRouter } = require("./routes/user.route");
const ipRouter = require("./routes/ip.route");
const redisClient = require("./helpers/redis");

const logger = require("./middlewares/logger");

require("dotenv").config()

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());


app.get("/", async(req,res)=>{
    res.send(await redisClient.get("name"));
})

app.use("/user",userRouter)

app.use("/ip",ipRouter);


app.listen(PORT, async ()=>{
      try{
       await connection();
       console.log("connected to db")
       logger.log("info","Database connected")
      } catch(err) {
        console.log(err.message)
        logger.log("error","Database connection fail")
      }
console.log("server is running",PORT)
})


