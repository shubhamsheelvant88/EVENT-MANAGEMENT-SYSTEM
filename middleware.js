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
        res.redirect("/login");
    }

    // If user is not a admin then he can't access the admin dashboard
    if(req.user.role !== "admin") {
        req.flash("error", "Access denied!");
        res.redirect("/dashboard");
    }
    next();
}

module.exports = isAdmin;
module.exports = isLoggedIn;