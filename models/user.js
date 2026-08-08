const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({ // schema
    username: {
        type: String,
        required: true
    },

    usn: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true
    },
    // role: {
    //     type: String,
    //     enum: ["student", "admin"],
    //     default: "student"
    // }
});

UserSchema.plugin(passportLocalMongoose.default, { usernameField: "email" });

module.exports = mongoose.model("User", UserSchema);