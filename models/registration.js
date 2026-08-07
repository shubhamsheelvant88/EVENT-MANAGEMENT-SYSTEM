const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// registration is connection between student and event 
const registrationSchema = new Schema({
    student : {
        type : Schema.Types.ObjectId, // this object id belongs to user model
        ref : "User",
        required : true,
    },
    event : {
        type : Schema.Types.ObjectId, // this object id belongs to event model
        ref : "Event",
        required : true,
    },
    registeredAt: {
        type : Date,
        default : Date,
    },
    status : {
        type : String,
        enum : ["registered", "cancelled"],
        default : "registered"
    }
});

module.exports = mongoose.model(registrationSchema, "Registration");