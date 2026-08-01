const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate")
const Event = require("./models/event");
const wrapAsync = require("./utils/wrapasync")

app.engine('ejs', engine)
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO_URL = "mongodb://127.0.0.1:27017/event_management_sys";
main().then((res) => {
    console.log("Connected to DB")
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

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



app.listen(8080, () => {
    console.log("app is listening your port");
});