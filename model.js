const mongoose = require('mongoose')

const AbandonedCheckoutSchema = new mongoose.Schema({
    checkoutId : {type : String},
    checkoutAbandonedTime : {type : Date },
    orderPlaced : {type :Boolean},
    lastReminderId : {type : Number},
    lastReminderDetails : {type: Object},
    checkoutData : {type : Object}
})

module.exports = mongoose.model('ACS',AbandonedCheckoutSchema)