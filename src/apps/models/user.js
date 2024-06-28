const mongoose = require("../../common/database")();

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        default : "member"
    },
    full_name : {
        type : String
    }
}, {timestamps : true});

const UserModel = mongoose.model("Users",userSchema,"users");
module.exports = UserModel;