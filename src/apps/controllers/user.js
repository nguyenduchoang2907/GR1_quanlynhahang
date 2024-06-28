const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const pagination = require("../../common/pagination");

const index = async (req, res) => {
    const limit = 30;
    const page = parseInt(req.query.page) || 1;
    const skip = limit * (page - 1);
    const users = await UserModel.find().limit(limit).skip(skip);
    const totalRows = await UserModel.find().countDocuments();
    const totalPages = Math.ceil(totalRows / limit);
    const pages = pagination(page, totalPages);
    const next = page + 1;
    const hasNext = page < totalPages ? true : false;
    const prev = page - 1;
    const hasPrev = page > 1 ? true : false;
    res.render("./admin/users/user", { users, pages, page, totalPages, next, hasNext, prev, hasPrev });
}

const create = (req, res) => {
    res.render("./admin/users/add_user", { status: "" });
}

const edit = async (req, res) => {
    const id = req.params.id;
    const user = await UserModel.findById(id);
    res.render("./admin/users/edit_user", { user, error: "" });
}

const del = async (req, res) => {
    const id = req.params.id;
    await UserModel.findByIdAndDelete(id);
    res.redirect("/admin/users");
}

const store = async (req, res) => {
    const { full_name, email, password, role, retype_password } = req.body;
    const existingUser = await UserModel.find({ email });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = { full_name, email, password : hashed , role };
    if(retype_password!=password){
        res.render("./admin/users/add_user", { status: "password" });
    }
    if (existingUser.length != 0) {
        res.render("./admin/users/add_user", { status: "existing" });
    } else {
        await new UserModel(user).save();
        res.redirect("/admin/users");
    }
}

const update = async (req, res) => {
    const id = req.params.id;
    const { full_name, email, password, role, retype_password } = req.body;
    const existingUser = await UserModel.find({ email, _id : {$ne : id} });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const data = { full_name, email, password : hashed, role };
    const user = {_id : id, full_name, email, password, role}
    if(password!=retype_password && existingUser.length!=0) res.render("./admin/users/edit_user", { user, error: "all-error" });
    else if(password!=retype_password) res.render("./admin/users/edit_user", { user, error: "password-missmatch" });
    else if(existingUser.length!=0) res.render("./admin/users/edit_user", { user, error: "password-missmatch" });
    else {
        await UserModel.findByIdAndUpdate(id,data);
        res.redirect("/admin/users");
    }
}

module.exports = {
    index,
    create,
    edit,
    del,
    store,
    update
}