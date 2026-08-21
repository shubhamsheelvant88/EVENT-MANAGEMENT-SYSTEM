const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate")
const Event = require("./models/event");
const User = require("./models/user");
const Registration = require("./models/registration");
const wrapAsync = require("./utils/wrapasync")
const methodOverride = require("method-override")
const { isLoggedIn, isAdmin } = require("./middleware.js");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session")
const flash = require("connect-flash")

app.engine('ejs', engine)
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))

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

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
}

main();

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate('email')));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Now the success and error can be used by the ejs 
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
app.get("/events/:id/show",isLoggedIn, wrapAsync (async (req, res) => {
    let {id} = req.params;
    let event = await Event.findById(id);

    const registrationCount = await Registration.countDocuments({
        event : req.params.id,
        status : "registered",
    })
    res.render("showevent.ejs", {event, registrationCount});
}));


// create event rout
app.get("/events/new",isLoggedIn, (req, res) => {
    res.render("createevent.ejs");
});

app.post("/events",isLoggedIn, wrapAsync( async (req, res) => {
    let newEvent = new Event(req.body.event);
    await newEvent.save();
    res.redirect("/events")
}));

// update rout
app.get("/events/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let event  = await Event.findById(id);

    res.render("editevent.ejs", {event});
}));

app.put("/events/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let {event} = req.body;

    await Event.findByIdAndUpdate(id, event);
    res.redirect("/events");
}));

app.delete("/events/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let {id} = req.params;

    await Event.findByIdAndDelete(id);
    res.redirect("/events");
}));

app.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

app.post("/signup", async (req, res) => {
    try {
    let {username, email, usn, department, semester, password} = req.body;

    let newUser = new User({username, email, usn, department, semester});

    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Welcome to event management system!");
        res.redirect("/events");
    });
    }catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

app.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

app.post("/login" ,passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), (req, res) => {
        console.log(req.body);
        req.flash("success", "Welcome back!");
        res.redirect("/events");
    });

// registration for an event
app.post("/events/:id/register",isLoggedIn, wrapAsync(async (req, res) => {
    let eventId = req.params.id; // event id from register 
    let studentId = req.user._id;

    let event = await Event.findById(eventId);

    // if event does not exist => error
    if(!event) {
        req.flash("error", "Event not exists!");
        return res.redirect("/events");
    }

    // already  registered
    let existingRegistration = await Registration.findOne({
        student : studentId,
        event : eventId,
        status : "registered"
    });

    if(existingRegistration) {
        req.flash("error", "You are already registered for this event");
        return res.redirect(`/events/${eventId}/show`);
    }

    // countDocuments => counts the number of documents in particular 
    const registrationCount = await Registration.countDocuments({
        // how many student has registered for particular event 
        event : eventId,
        status : "registered",
    });

    if(registrationCount >= event.capacity) {
        req.flash("error", "Sorry, this event is full!");
        return res.redirect(`/events/${eventId}/show`);
    };

    await Registration.insertOne({
        student : studentId,
        event : eventId,
        status : "registered",
    });

    req.flash("success", "Successfully registered for the event!");
    res.redirect(`/events/${eventId}/show`);

}));

app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/events");
    });
});

// my events 
app.get("/my-events",isLoggedIn, wrapAsync( async (req, res) => {
    const registrations = await Registration.find({
        student : req.user._id,
        status : "registered",
    }).populate("event"); // takes the event id and returns the complete event document 

    res.render("my-events.ejs", {registrations});
}));

// cancel the registration 
app.patch("/registrations/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const registration = await Registration.findById(req.params.id);

    if(!registration) {
        req.flash("error", "You have not registered for an event");
        return res.redirect("/my-events");
    }

    if(!registration.student.equals(req.user._id)) {
        req.flash("error", "Sorry, you cannot cancel this registration");
        return res.redirect("/my-events");
    }

    registration.status = "cancelled";
    await registration.save();

    req.flash("success", "Registration cancelled successfully");
    res.redirect("/my-events");
}));

// student dashboard 
app.get("/dashboard",isLoggedIn, wrapAsync( async (req, res) => {
    const student = req.user;

    const registrations = await Registration.find({
        student : req.user._id,
        status : "registered",
    }).populate("event");

    const registeredEvents  = await Registration.countDocuments({
        student : req.user._id,
        status : "registered",
    });

    const cancelledCount = await Registration.countDocuments({
        student : req.user._id,
        status : "cancelled",
    });

    res.render("dashboard.ejs", {student, registrations, registeredEvents, cancelledCount});
}));

app.get("/profile", isLoggedIn, (req, res) => {
    const student = req.user;

    res.render("studentprofile.ejs", {student});
});

app.get("/admin/dashboard", isAdmin, wrapAsync(async (req, res) => {
    const studentCount = await User.countDocuments({
        role : "student",
    });

    const eventCount = await Event.countDocuments();

    const registrationCount = await Registration.countDocuments({
        status : "registered",
    });

    // events 
    let events = await Event.find();

    res.render("admin/dashboard.ejs", {studentCount, eventCount, registrationCount, events});
}));


app.get("/admin/events/:id/participants", isAdmin,  wrapAsync( async (req, res) => {

    const event = await Event.findById(req.params.id);

    if(!event) {
        req.flash("error", "Event not found!");
        return res.redirect("/admin/dasboard")
    }

    const registrations = await Registration.find({
        event : req.params.id,
        status : "registered",
    }).populate("student");

    console.log(registrations);

    res.render("admin/participants", {event, registrations});
}));

app.listen(8080, () => {
    console.log("app is listening your port");
});