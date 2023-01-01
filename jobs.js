const ACS = require('./model')
const scheduleConfig = require('./scheduleConfig')
const moment = require('moment')
const schedule = require('node-schedule');

const scheduleJobHandler = async (data)=>{
    console.log("called schedule job ",data)
    const checkoutData = await ACS.findOne({checkoutId : data.checkoutId}) 

    if(checkoutData){
        if(checkoutData.orderPlaced){
            console.log("Scheduled message is cancelled as order is placed. Deleting the data from DB")
            await ACS.findOneAndDelete({checkoutId : data.checkoutId})
            return
        }

        const prevSchId = checkoutData.lastReminderId
        const newSch = scheduleConfig[prevSchId+1] ? scheduleConfig[prevSchId+1] : null

        console.log("another schedule present",scheduleConfig[prevSchId+1])
        if(!newSch){
            console.log("All the scheduled messages are send. Deleting the data from DB",newSch)
            await ACS.findOneAndDelete({checkoutId : data.checkoutId})
            return
        }

      

        const schDate = moment(checkoutData.checkoutAbandonedTime).add(newSch.value,newSch.period).format()

        const scheduleData = {checkoutId : data.checkoutId, scheduledTime : schDate , scheduleData : newSch}

        console.log('scheduling new job with following data ',{data :scheduleData, time : schDate})

        const job = schedule.scheduleJob(schDate,scheduleJobHandler.bind(null,scheduleData))

        console.log('job created successfully',scheduleData)

        const newData = await ACS.findOneAndUpdate({
           checkoutId : data.checkoutId
        },{
            $set : {
                lastReminderDetails : newSch,
                lastReminderId : newSch.key
            }
        },{
            new: true
        })

        console.log("data updated successfully",newData)
    }
}


module.exports = { scheduleJobHandler}