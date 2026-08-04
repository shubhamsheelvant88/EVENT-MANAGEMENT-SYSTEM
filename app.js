const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate")
const Event = require("./models/event");
const User = require("./models/user");
const wrapAsync = require("./utils/wrapasync")
const methodOverride = require("method-override")
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session")
const flash = require("connect-flash")

app.engine('ejs', engine)
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge  : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}

const MONGO_URL = "mongodb://127.0.0.1:27017/event_management_sys";
main().then((res) => {
    console.log("Connected to DB")
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.get("/", (req, res) => {
    res.send("Rout is working")
});

// index rout
app.get("/events", wrapAsync(async(req, res) => {
    let events = await Event.find();
    res.render("index.ejs", {events});
}));

// show particular event
app.get("/events/:id/show", wrapAsync (async (req, res) => {
    let {id} = req.params;
    let event = await Event.findById(id);
    res.render("showevent.ejs", {event});
}));


// create event rout
app.get("/events/new", (req, res) => {
    res.render("createevent.ejs");
});

app.post("/events", wrapAsync( async (req, res) => {
    let newEvent = new Event(req.body.event);
    await newEvent.save();
    res.redirect("/events")
}));

// update rout
app.get("/events/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let event  = await Event.findById(id);

    res.render("editevent.ejs", {event});
}));

app.put("/events/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let {event} = req.body;
    await Event.findByIdAndUpdate(id, event);
    res.redirect("/events");
}));

app.delete("/events/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;

    await Event.findByIdAndDelete(id);
    res.redirect("/events");
}));

app.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

app.post("/signup", async (req, res, next) => {
    try {
    let  {name, usn, email, department, semester, password} = req.body;

    const newUser = new User({name, usn, email, department, semester, username: usn});

    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Welcome to Event management system");
        res.redirect("/events");
    });
    }catch(err) {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

app.listen(8080, () => {
    console.log("app is listening your port");
});