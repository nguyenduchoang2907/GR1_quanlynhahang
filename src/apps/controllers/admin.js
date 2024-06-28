const ProductModel = require("../models/product");
const UserModel = require("../models/user");
const CommentModel = require("../models/comment");

// Controller cho trang admin
const index = async (req, res) => {
    // Lấy danh sách người dùng
    const users = await UserModel.find();
    // Lấy danh sách sản phẩm
    const products = await ProductModel.find();
    // Lấy danh sách bình luận
    const comments = await CommentModel.find();
    // Render trang admin với thông tin số lượng người dùng, sản phẩm và bình luận
    res.render("admin/admin", {user : users.length, product :products.length, comment : comments.length});//??????????????

}

module.exports = {
    index,
}