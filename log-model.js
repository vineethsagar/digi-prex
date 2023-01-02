const mongoose = require('mongoose')

const LogModelSchema = new mongoose.Schema({
    checkoutId : {type : String , required: true},
    checkoutAbandonedTime : {type : Date ,required: true},
    orderPlaced : {type :Boolean,required: true},
    reminderId : {type : Number,required: true},
    reminderDescription : {type: String,required: true},
    reminderTime : {type: Date,required: true},
    message: {type :String , required : true}
})

module.exports = mongoose.model('LMS',LogModelSchema)