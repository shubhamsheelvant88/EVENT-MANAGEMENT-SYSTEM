const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
}
// Admin authorisation middleware 
const isAdmin = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }

    if(req.user.role !== "admin") {
        req.flash("error", "Access denied!");
        return res.redirect("/dashboard");
    }
    next();
}

module.exports = { isLoggedIn, isAdmin };