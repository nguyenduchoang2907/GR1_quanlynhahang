const { model } = require("mongoose");

const mongoose = require("../../common/database")();

const CommentSchema = new mongoose.Schema({
    prd_id : {
        type: mongoose.Types.ObjectId,
        ref: "Products",
    },
    full_name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    }
},{timestamps : true})

const CommentModel = mongoose.model("Comments",CommentSchema,"comments");

module.exports = CommentModel;