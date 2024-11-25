module.exports.checkAuth = function(req, res, next){
    const userid = req.session.userid;

    if(!userid) {
        req.flash("message", "You must be logged in to access this page");
        return res.render("auth/login.handlebars");
    }

    next()
}