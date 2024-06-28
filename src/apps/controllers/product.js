const ProductModel = require("../models/product");
const CategoryModel = require("../models/category");
const CommentModel = require("../models/comment");
const pagination = require("../../common/pagination");
const pipe = require("../../common/pipe");
const slug = require("slug");
const fs = require("fs");
const path = require("path");

const index = async (req, res) => {
    const limit = 10;
    const page = parseInt(req.query.page) || 1;
    const skip = limit * (page - 1);
    const products = await ProductModel.find({}).sort({ _id: -1 }).limit(limit).skip(skip).populate({ path: "cat_id" });
    products.map((item) => {
        item.price = pipe(item.price);
        return item;
    })
    const totalRows = await ProductModel.find().countDocuments();
    const totalPages = Math.ceil(totalRows / limit);
    const pages = pagination(page, totalPages);
    const next = page + 1;
    const hasNext = page < totalPages ? true : false;
    const prev = page - 1;
    const hasPrev = page > 1 ? true : false;
    res.render("admin/products/product", { products, pages, page, totalPages, next, hasNext, prev, hasPrev });
}

const create = async (req, res) => {
    const categories = await CategoryModel.find();
    res.render("admin/products/add_product", { categories });
}

const edit = async (req, res) => {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    const categories = await CategoryModel.find();
    res.render("admin/products/edit_product", { product, categories });
}

const del = async (req, res) => {
    const id = req.params.id;
    const data = await ProductModel.findById(id);
    fs.unlink("src/public/images/"+data.thumbnail,()=>{});
    await ProductModel.findByIdAndDelete(id);
    await CommentModel.deleteMany({prd_id : id});
    res.redirect("/admin/products");
}

const store = async (req, res) => {
    const { file, body } = req;
    const product = {
        name: body.name,
        slug: slug(body.name),
        price: body.price,
        // warranty: body.warranty,
        accessories: body.accessories,
        promotion: body.promotion,
        status: body.status,
        cat_id: body.cat_id,
        is_stock: body.is_stock,
        featured: body.featured == "check",
        description: body.description,
    }
    if (file) {
        const thumbnail = "products/" + file.originalname;
        fs.renameSync(file.path, path.resolve("src/public/images/", thumbnail));
        product["thumbnail"] = thumbnail;
        await new ProductModel(product).save();
        res.redirect("/admin/products");
    }
}

const update = async (req, res) => {
    const id = req.params.id;
    const { file, body } = req;
    const product = {
        name: body.name,
        slug: slug(body.name),
        price: body.price,
        warranty: body.warranty,
        accessories: body.accessories,
        promotion: body.promotion,
        status: body.status,
        cat_id: body.cat_id,
        is_stock: body.is_stock,
        featured: body.featured == "check",
        description: body.description,
    }
    if (file) {
        const data = await ProductModel.findById(id);
        fs.unlink("src/public/images/"+data.thumbnail,()=>{});
        const thumbnail = "products/" + file.originalname;
        fs.renameSync(file.path, path.resolve("src/public/images/", thumbnail));
        product["thumbnail"] = thumbnail;
    }
    await ProductModel.findByIdAndUpdate(id,product);
    res.redirect("/admin/products");
}

module.exports = {
    index,
    create,
    edit,
    del,
    store,
    update
}