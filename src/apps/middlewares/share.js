const CategoryModel = require('../models/category');

module.exports = async (req, res, next) => {
    res.locals.categories = await CategoryModel.find();
    res.locals.totalCartItem = req.session.cart.reduce((sum, item)=> sum + item.qty, 0);
    next();
}