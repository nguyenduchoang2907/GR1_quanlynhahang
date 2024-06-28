const mongoose = require("../../common/database")();
const productSchema = new mongoose.Schema({
    cat_id:{
        type: mongoose.Types.ObjectId,
        ref: "Categories",
        required: true
    },
    name:{
        type: String,
        text : true,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    price:{
        type: String,
    },
    warranty:{
        type: String,
    },
    accessories:{
        type: String,
    },
    promotion:{
        type: String,
    },
    description:{
        type: String,
    },
    status:{
        type: String,
    },
    thumbnail:{
        type: String,
    },
    featured:{
        type: Boolean,
        default: false,
    },
    is_stock:{
        type: Boolean,
        default: true,
    }
},{timestamps : true});

const ProductModel = mongoose.model("Products",productSchema,"products");

module.exports = ProductModel;