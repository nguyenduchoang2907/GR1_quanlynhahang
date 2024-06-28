const checkLogin = (req, res, next) => {
    if(req.session.token) {
        return res.redirect("/admin/dashboard");
    }
    next();
}

const checkAdmin = (req, res, next) => {
    if(!req.session.token || !req.session.role) {
        return res.redirect("/admin/login");
    }
    next();
}

module.exports = {
    checkLogin,
    checkAdmin
}