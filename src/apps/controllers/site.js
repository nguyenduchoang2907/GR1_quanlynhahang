const moment = require("moment/moment");
const pagination = require("../../common/pagination");
const pipe = require("../../common/pipe");
const CategoryModel = require("../models/category");
const CommentModel = require("../models/comment");
const ProductModel = require("../models/product");

const transporter = require("../../common/transporter");
const config = require("config");
const ejs = require("ejs");
const path = require("path");


const home = async (req, res)=>{
    const featured = await ProductModel.find({featured : true, is_stock : true}).sort({_id : -1}).limit(6);
    const latest = await ProductModel.find({featured : true}).sort({_id : -1}).limit(6);
    featured.map((item) => {
        item.price = pipe(item.price);
        return item;
    });
    latest.map((item) => {
        item.price = pipe(item.price);
        return item;
    })
    res.render("./site/index",{featured, latest});
}
const category = async (req, res)=>{
    const limit = 12;
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const skip = limit * (page - 1);
    const products = await ProductModel.find({cat_id : id}).limit(limit).skip(skip);
    products.map((item) => {
        item.price = pipe(item.price);
        return item;
    });
    const category = await CategoryModel.findById(id);
    const totalRows = await ProductModel.find({cat_id : id}).countDocuments();
    const totalPages = Math.ceil(totalRows / limit);
    const pages = pagination(page, totalPages);
    const next = page + 1;
    const hasNext = page < totalPages ? true : false;
    const prev = page - 1;
    const hasPrev = page > 1 ? true : false;
    res.render("./site/category", {products, category, pages, page, totalPages, next, hasNext, prev, hasPrev});
}
const product = async (req, res)=>{
    const limit = 10;
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const skip = limit * (page - 1);
    const product = await ProductModel.findById(id);
    product.price = pipe(product.price);
    const products = await CommentModel.find({prd_id : id}).sort({_id : -1}).limit(limit).skip(skip);
    const comments = products.map((item) => {
        item = {item, time : moment(new Date(item.updatedAt)).fromNow()};
        return item;
    });
    const totalRows = await CommentModel.find({prd_id : id}).countDocuments();
    const totalPages = Math.ceil(totalRows / limit);
    const pages = pagination(page, totalPages);
    const next = page + 1;
    const hasNext = page < totalPages ? true : false;
    const prev = page - 1;
    const hasPrev = page > 1 ? true : false
    res.render("./site/product",{product, comments, pages, page, totalPages, next, hasNext, prev, hasPrev});
}
const comment = async (req, res) => {
    const prd_id = req.params.id;
    const {full_name, email, body} = req.body;
    const comment = {prd_id, full_name, email, body};
    await new CommentModel(comment).save();
    res.redirect(req.path);
}
const search = async (req, res)=>{
    const keyword = req.query.keyword || "";
    const limit = 12;
    const page = parseInt(req.query.page) || 1;
    const skip = limit * (page - 1);
    let search = await ProductModel.find({
        $text : { $search : keyword}
    }).limit(limit).skip(skip);
    let totalRows = await ProductModel.find({
        $text : { $search : keyword}
    }).countDocuments();
    if(search.length==0){
        search = await ProductModel.find({name : {$regex : keyword}}).limit(limit).skip(skip);
        totalRows = await ProductModel.find({name : {$regex : keyword}}).countDocuments();
    }
    const totalPages = Math.ceil(totalRows / limit);
    const pages = pagination(page, totalPages);
    const next = page + 1;
    const hasNext = page < totalPages ? true : false;
    const prev = page - 1;
    const hasPrev = page > 1 ? true : false
    res.render("./site/search",{search, keyword, pages, page, totalPages, next, hasNext, prev, hasPrev});
}
const cart = async (req, res)=>{
    const products = req.session.cart;
    const total = pipe(products.reduce((sum, item) => sum + item.price * item.qty, 0 ));
    res.render("./site/cart",{products, total, pipe});
}
const success = (req, res)=>{
    res.render("./site/success");
}

const addToCart = async (req, res)=>{
    const id = req.body.id;
    const qty = parseInt(req.body.qty);
    const items = req.session.cart;
    let isProductExists = false;
    items.map((item)=>{
        if(item.id == id) {
            item.qty += qty;
            isProductExists = true;
        }
    });
    if(!isProductExists) {
        const product = await ProductModel.findById(id);
        items.push({
            id,
            name: product.name,
            price: product.price,
            thumbnail: product.thumbnail,
            qty
        });
    }
    res.redirect("/cart");
}


const updateCart = (req, res) => {
    const product = req.body.product;
    let cart = req.session.cart;
    cart.map((item)=>{
        item.qty = parseInt(product[item.id]["qty"]);
        return item
    });
    res.redirect("/cart");
}

const deleteCart = (req, res) => {
    const id = req.query.id;
    let cart = req.session.cart;
    const newCart = cart.filter((item) => item.id != id);
    req.session.cart = newCart;
    res.redirect("/cart");
}

const order=async(req,res)=>{
    const items = req.session.cart;
    const body = req.body;
    // Lấy ra đường dẫn đến thư mục views
    const viewPath = req.app.get("views");
    // Compile template EJS sang HTML để gửi mail cho khách hàng
    const html = await ejs.renderFile(
        path.join(viewPath, "site/email-order.ejs"),
        {
            name: body.name,
            phone: body.phone,
            mail: body.mail,
            add: body.add,
            totalPrice: 0,
            items,
        }
    );
    // Gửi mail
    await transporter.sendMail({
        from: `"King's Restaurant"<quantri.vietproshop@gmail.com>`,
        to: body.mail,
        
        subject: "Xác nhận đơn hàng từ King's Restaurant",
        html,
    });

    req.session.cart = [];
    res.redirect("/success");

}

module.exports = {
    home,
    category,
    product,
    search,
    cart,
    success,
    comment,
    addToCart,
    updateCart,
    deleteCart,
    order
}
