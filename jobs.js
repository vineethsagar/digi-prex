const ACS = require("./model");
const scheduleConfig = require("./scheduleConfig");
const moment = require("moment");
const schedule = require("node-schedule");
const LMS = require("./log-model");
const scheduleJobHandler = async (data) => {
  console.log(" schedule called job ", data);
  const checkoutData = await ACS.findOne({ checkoutId: data.checkoutId });

  if (!checkoutData) {
    console.log("No Data found ", checkoutData, data);
    return;
  }



  if (checkoutData.orderPlaced) {
    console.log(
      "Scheduled message is cancelled as order is placed. Deleting the data from DB"
    );
    await ACS.findOneAndDelete({ checkoutId: data.checkoutId });
    return;
  }

  const msgToSend = `${
    scheduleConfig[checkoutData.lastReminderId + 1]
      ? "Reminder !!"
      : "Last Reminder !!"
  } your cart is waiting for you.`;

  console.log("Sending message ---> , ",{
    msgToSend
  })

  try {
    console.log("Adding log with the following msg", msgToSend);
    addLog(checkoutData, data.scheduledTime, msgToSend);
  } catch (error) {
    console.error("Failed to add log", error);
  }

  const prevSchId = checkoutData.lastReminderId;
  const newSch = scheduleConfig[prevSchId + 1]
    ? scheduleConfig[prevSchId + 1]
    : null;

  console.log("another schedule present", scheduleConfig[prevSchId + 1]);
  if (!newSch) {
    console.log(
      "All the scheduled messages are send. Deleting the data from DB",
      newSch
    );
    await ACS.findOneAndDelete({ checkoutId: data.checkoutId });
    return;
  }

  const schDate = moment(checkoutData.checkoutAbandonedTime)
    .add(newSch.value, newSch.period)
    .format();

  const scheduleData = {
    checkoutId: data.checkoutId,
    scheduledTime: schDate,
    scheduleData: newSch,
  };

  console.log("scheduling new job with following data ", {
    data: scheduleData,
    time: schDate,
  });

  const job = schedule.scheduleJob(
    schDate,
    scheduleJobHandler.bind(null, scheduleData)
  );

  console.log("job created successfully", scheduleData);

  const newData = await ACS.findOneAndUpdate(
    {
      checkoutId: data.checkoutId,
    },
    {
      $set: {
        lastReminderDetails: newSch,
        lastReminderId: newSch.key,
      },
    },
    {
      new: true,
    }
  );

  console.log("data updated successfully new data :: ", newData);
};

const addLog = (checkoutData, reminderTime, message) => {
  const newLog = new LMS({
    checkoutAbandonedTime: checkoutData.checkoutAbandonedTime,
    checkoutId: checkoutData.checkoutId,
    orderPlaced: checkoutData.orderPlaced,
    reminderDescription: checkoutData.lastReminderDetails.description,
    reminderId: checkoutData.lastReminderDetails.key,
    reminderTime: reminderTime,
    message: message,
  });

  newLog.save()
  .then((res)=>console.log("log added successfully"))
  .catch((err)=>console.error("failed to add the log",err))

};

module.exports = { scheduleJobHandler, addLog };
