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

// app.get("/signup", (req, res) => {
//     res.render("users/signup.ejs");
// });

// app.post("/signup", async (req, res, next) => {
//     try {
//     let  {username, usn, email, department, semester, password} = req.body;

//     const newUser = new User({name: username, usn, email, department, semester, username: username});

//     const registeredUser = await User.register(newUser, password);
//     console.log(registeredUser);

//     req.login(registeredUser, (err) => {
//         if(err) {
//             return next(err);
//         }
//         req.flash("success", "Welcome to Event management system");
//         res.redirect("/events");
//     });
//     }catch(err) {
//         console.log(err);
//         req.flash("error", err.message);
//         res.redirect("/signup");
//     }
// });


// app.get("/login", (req, res) => {
//     res.render("users/login.ejs");
// });

// app.post("/login", passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}), (req, res) => {
//     req.flash("success", "Welcome to Wander Lust you are logged in");
//     res.redirect("/events");
// });

// let isLoggedIn = (req, res, next) => {
//     if(req.isAuthenticated() && req.user) {
//         return next();
//     }
//     req.flash("error", "You need to be logged in to register for an event");
//     res.redirect("/login");
// };

// registration for an event
app.post("/events/:id/register", wrapAsync(async (req, res) => {
    let eventId = req.params.id; // event id from register 
    let studentId = req.user._id;

    let event = await Event.findById(eventId);

    // if event does not exist => error
    if(!event) {
        req.flash("error", "Event not exists!");
        return res.redirect("/events");
    }

    // already  registered
    let existingRegistration = await Registration.findByOne({
        student : studentId,
        event : eventId,
        status : "registered"
    });

    if(existingRegistration) {
        req.flash("error", "You are already registered for this event");
        return res.redirect(`/events/${eventId}`);
    }

    // countDocuments => counts the number of documents in particular 
    const registrationCount = await Registration.countDocuments({
        // how many student has registered for particular event 
        event : eventId,
        status : "registered",
    });

    if(registrationCount >= event.capacity) {
        req.flash("success", "Sorry, this event is full!");
        res.redirect("error", `/events/${eventId}`);
    };

    await Registration.insertOne({
        student : studentId,
        event : eventId,
        status : "registered",
    });

    req.flash("success", "Successfully registered for the event!");
    res.redirect(`/events/${eventId}`);

}));



app.listen(8080, () => {
    console.log("app is listening your port");
});