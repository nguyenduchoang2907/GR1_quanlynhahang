const UserModel = require("../models/user");//??????????????????????
const CryptoJS = require("crypto-js");//??????????????
const config = require("config");
const bcrypt = require("bcrypt");

// Controller cho trang đăng nhập
const getLogin = (req, res) =>{
    res.render("./admin/login",{status : false});//?
}

// const postLogin = async (req, res) => {

//     let {email, password} = req.body;
// //?
//     const users = await UserModel.find({email : email });
//     // Kiểm tra nếu người dùng với email được cung cấp tồn tại và mật khẩu khớp
//     if(users.length != 0 && bcrypt.compare(users[0].password,password)) {
//         // Thiết lập token phiên bằng cách sử dụng băm SHA256 của khóa phiên
//         req.session.token = CryptoJS.SHA256(config.get("app.session_key")).toString(CryptoJS.enc.Hex);
//         // Thiết lập vai trò người dùng trong phiên dựa trên việc người dùng có phải là admin hay không
//         req.session.role = users[0].role == "admin";
//         // Chuyển hướng đến bảng điều khiển admin sau khi đăng nhập thành công
//         res.redirect("/admin/dashboard");
//     } else {
//          // Render trang đăng nhập với trạng thái true nếu đăng nhập thất bại
//          res.render("./admin/login",{status : true});
//     }
// }
const postLogin = async (req, res) => {
    let { email, password } = req.body;

    try {
        const users = await UserModel.find({ email: email });

        if (users.length != 0 && await bcrypt.compare(password, users[0].password)) {
            req.session.token = CryptoJS.SHA256(config.get("app.session_key")).toString(CryptoJS.enc.Hex);
            req.session.role = users[0].role == "admin";
            res.redirect("/admin/dashboard");
        } else {
            res.render("./admin/login", { status: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}


const logout = (req, res) => {
    // Hủy phiên của người dùng
    req.session.destroy();
    // Chuyển hướng người dùng đến trang đăng nhập của admin
    res.redirect("/admin/login");
}

const getRegister = (req, res) => {
    // Hiển thị trang đăng ký với trạng thái mặc định
    res.render("./admin/register",{status : ""});
}

const postRegister = async (req, res) => {
    // Trích xuất thông tin từ phần thân của yêu cầu đăng ký
    const {full_name, email, password, retype_password} = req.body;

    // Tìm kiếm người dùng với email được cung cấp
    const user = await UserModel.find({email : email});

    // Kiểm tra xem mật khẩu và mật khẩu nhập lại có khớp nhau không
    if(password!=retype_password) res.render("./admin/register",{status : "password"});
    else if(user.length!=0) res.render("./admin/register",{status : "existing"});// Kiểm tra xem người dùng đã tồn tại hay chưa
    else {
        // Nếu mọi thứ hợp lệ, băm mật khẩu và tạo người dùng mới
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const newUser = {
            email,
            password : hashed,
            full_name
        }
        // Lưu người dùng mới vào cơ sở dữ liệu
        await UserModel(newUser).save();
        // Chuyển hướng người dùng đến trang đăng nhập sau khi đăng ký thành công
        res.redirect("/admin/login");
    }
}

module.exports = {
    getLogin,
    postLogin,
    logout,
    getRegister,
    postRegister
}