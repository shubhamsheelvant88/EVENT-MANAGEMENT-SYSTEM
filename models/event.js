const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema ({ // schema
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    category : {
        type : String,
        required : true,
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    registrationDeadline: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Event", eventSchema) // model

