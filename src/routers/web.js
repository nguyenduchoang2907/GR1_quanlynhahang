const express = require("express");

const router = express.Router();

const authController = require("../apps/controllers/auth");

const adminCotroller = require("../apps/controllers/admin");

const productController = require("../apps/controllers/product");

const categoryController = require("../apps/controllers/category");

const userController = require("../apps/controllers/user");

const { checkLogin, checkAdmin } = require("../apps/middlewares/auth");

const uploadMiddleware = require("../apps/middlewares/upload");

const siteController = require("../apps/controllers/site");

const commentController = require("../apps/controllers/comment");

router.get("/admin/login", checkLogin ,authController.getLogin);

router.post("/admin/login",checkLogin, authController.postLogin);

router.get("/admin/register", authController.getRegister);

router.post("/admin/register", authController.postRegister);

router.get("/admin/logout" ,checkAdmin, authController.logout);

router.get("/admin/dashboard",checkAdmin, adminCotroller.index);

router.get("/admin/products",checkAdmin, productController.index);

router.get("/admin/products/create",checkAdmin, productController.create);

router.post("/admin/products/store",checkAdmin, uploadMiddleware.single("thumbnail"),productController.store);

router.post("/admin/products/update/:id",checkAdmin, uploadMiddleware.single("thumbnail"),productController.update);

router.get("/admin/products/edit/:id",checkAdmin, productController.edit);

router.get("/admin/products/delete/:id",checkAdmin, productController.del);

router.get("/admin/categories",checkAdmin, categoryController.index);

router.get("/admin/categories/create",checkAdmin, categoryController.create);

router.post("/admin/categories/store",checkAdmin, categoryController.store);

router.get("/admin/categories/edit/:id",checkAdmin, categoryController.edit);

router.get("/admin/categories/delete/:id",checkAdmin, categoryController.del);

router.post("/admin/categories/update/:id",checkAdmin, categoryController.update);

router.get("/admin/users",checkAdmin, userController.index);

router.get("/admin/users/create",checkAdmin, userController.create);

router.post("/admin/users/store",checkAdmin, userController.store);

router.post("/admin/users/update/:id",checkAdmin, userController.update);

router.get("/admin/users/edit/:id",checkAdmin, userController.edit);

router.get("/admin/users/delete/:id",checkAdmin, userController.del);

router.get("/", siteController.home);

router.get("/category-:slug.:id", siteController.category);

router.get("/product-:slug.:id", siteController.product);

router.post("/product-:slug.:id", siteController.comment);

router.get("/search", siteController.search);

router.get("/cart", siteController.cart);

router.get("/success", siteController.success);

router.post("/add-to-cart", siteController.addToCart);

router.post("/update-cart", siteController.updateCart);

router.get("/delete-cart", siteController.deleteCart);

router.get("/admin/comments", commentController.index);

router.post("/order", siteController.order);

module.exports = router;