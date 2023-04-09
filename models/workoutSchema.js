let mongoose = require('mongoose')

let workoutData = new mongoose.Schema({

    workoutName : 
    {
        type : String,
        required : true
    },
    musle : 
    {
        type:String,
        required : true
    },
    gifURL : 
    {
        type:String,
        required : true
    },
    equipment : 
    {
        type:String ,
        required : true
    },
    level :
    {
        type: String,
        required : true
    },
    instructions :
    {
        type: String,
        required : true
    },
    trainer:
    {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('workout',workoutData)