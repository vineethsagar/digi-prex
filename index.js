const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const moment = require('moment')
const schedule = require('node-schedule');
const ACS = require('./model')
const LMS = require('./log-model')
const config = require("./config");
const {scheduleJobHandler , addLog} = require('./jobs')
const scheduleConfig = require('./scheduleConfig')
const router = express();

// ! connect to mongodb
mongoose
  .connect(config.mongo.url, {
    retryWrites: true,
    w: "majority",
  })
  .then(() => {
    console.log("Connected to DB");
    startServer();
  })
  .catch((error) => {
    console.log("Failed to connect to DB : ");
    console.log(error);
  });

const abandonedCardHandler = (req, res, next) => {
    const data = req.body
    const date = moment().format()
    const newCard = new ACS({
        checkoutData: data,
        orderPlaced: false,
        checkoutId:data.checkoutId,
        checkoutAbandonedTime: date,
        lastReminderDetails:scheduleConfig[4],
        lastReminderId : scheduleConfig[4].key
    })

    const add1Min = moment(date).add(1,'m').format()
    try {
        const scheduleData = {checkoutId : data.checkoutId, scheduledTime : add1Min, scheduleData : scheduleConfig[4]}
        const job = schedule.scheduleJob(add1Min,scheduleJobHandler.bind(null,scheduleData))
        console.log('job created successfully',scheduleData)
    } catch (error) {
        console.error("Failed to schedule job",error)
    }
  
    newCard.save()
    .then((data)=>res.status(201).json({ data}) )
    .catch((error)=>res.status(400).json({ error}) )
  
};
const orderPlaced = async (req, res, next) => {
    const checkoutId = req.params.checkoutId
   try {
	 const newData = await ACS.findOneAndUpdate({
	        checkoutId : checkoutId
	     },{
	         $set : {
	            orderPlaced: true
	         }
	     },{
	         new: true
	     })
         return res.status(200).json(newData)
} catch (error) {
	return res.status(400).json(error)
}
};

const sendLogs = async (req, res, next)=>{
  return LMS.find()
  .then((data) => res.status(200).json({ data }))
  .catch((error) => res.status(400).json({ error }));
}

//! start server if mongodb connection is successfully

const startServer = () => {
  router.use((req, res, next) => {
    console.log(
      `Incoming connection -> Method : [${req.method}] - Url : [${req.url}] - IP : [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      console.log(
        `Operation finished -> Method : [${req.method}] - Url : [${req.url}] - IP : [${req.socket.remoteAddress}] - Status : [${res.statusCode}]`
      );
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  router.post("/abandoned-checkout", abandonedCardHandler);

  router.patch("/order-placed/:checkoutId", orderPlaced);

  router.get("/logs",sendLogs )

  // ! API rules
  router.use((req, res, next) => {
    //*  * -> req can come from anywhere or can keep ip's
    res.header("Access-Control-Allow-Origin", "*");

    //*  allowed headers
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    //* option that can be used in api
    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }

    next();
  });

  // ! Routes

  // ! no route

  router.use((req, res, next) => {
    const error = new Error("Route not found");
    return res.status(404).json({ message: error.message });
  });

  // ! create server
  http.createServer(router).listen(3000, () => {
    console.log(`Server is running on port ${3000}.`);
  });
};
