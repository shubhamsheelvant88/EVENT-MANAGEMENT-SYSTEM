const mongoose = require("mongoose");
const Event = require("./models/event.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/event_management_sys";
main().then((res) => {
    console.log("Connected to DB")
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

Event.deleteMany({}).then(() => {
    console.log("Cleared all existing events");
    let allevents = [
    {
    title: "Coding Club Meetup",
    description: "An introductory session on competitive programming and coding practice.",
    category: "coding",
    date: new Date("2026-08-10"),
    time: "10:00 AM",
    venue: "CS Block",
    organizer: "Abhishek",
    capacity: 50,
    registrationDeadline: new Date("2026-08-08")
},
{
    title: "Web Development Workshop",
    description: "Learn the fundamentals of HTML, CSS, JavaScript and responsive web design.",
    category: "web development",
    date: new Date("2026-08-14"),
    time: "11:00 AM",
    venue: "Seminar Hall",
    organizer: "Rahul",
    capacity: 60,
    registrationDeadline: new Date("2026-08-12")
},
{
    title: "Hackathon 2026",
    description: "A 24-hour hackathon where students build innovative technology solutions.",
    category: "hackathon",
    date: new Date("2026-08-20"),
    time: "09:00 AM",
    venue: "Innovation Lab",
    organizer: "Priya",
    capacity: 100,
    registrationDeadline: new Date("2026-08-17")
},
{
    title: "AI and Machine Learning Seminar",
    description: "Introduction to artificial intelligence, machine learning and real-world applications.",
    category: "technology",
    date: new Date("2026-08-25"),
    time: "02:00 PM",
    venue: "Auditorium",
    organizer: "Sneha",
    capacity: 120,
    registrationDeadline: new Date("2026-08-23")
},
{
    title: "Git and GitHub Workshop",
    description: "Learn Git, GitHub, repositories, branches, commits and collaboration.",
    category: "workshop",
    date: new Date("2026-08-28"),
    time: "10:30 AM",
    venue: "CS Lab 2",
    organizer: "Arjun",
    capacity: 40,
    registrationDeadline: new Date("2026-08-26")
},
{
    title: "Tech Quiz Competition",
    description: "A fun technical quiz covering programming, computers and emerging technologies.",
    category: "competition",
    date: new Date("2026-09-02"),
    time: "01:00 PM",
    venue: "Main Seminar Hall",
    organizer: "Kiran",
    capacity: 80,
    registrationDeadline: new Date("2026-08-30")
},
{
    title: "Photography Club Meet",
    description: "A creative meetup for students interested in photography and visual storytelling.",
    category: "cultural",
    date: new Date("2026-09-05"),
    time: "03:00 PM",
    venue: "Open Air Theatre",
    organizer: "Ananya",
    capacity: 50,
    registrationDeadline: new Date("2026-09-03")
},
{
    title: "Entrepreneurship Talk",
    description: "An interactive session with entrepreneurs about startups, ideas and business growth.",
    category: "entrepreneurship",
    date: new Date("2026-09-08"),
    time: "11:00 AM",
    venue: "Auditorium",
    organizer: "Vikram",
    capacity: 150,
    registrationDeadline: new Date("2026-09-06")
},
{
    title: "Placement Preparation Session",
    description: "Learn about aptitude, technical interviews, resumes and placement strategies.",
    category: "career",
    date: new Date("2026-09-12"),
    time: "10:00 AM",
    venue: "Placement Hall",
    organizer: "Placement Cell",
    capacity: 200,
    registrationDeadline: new Date("2026-09-10")
},
{
    title: "Java Programming Workshop",
    description: "Hands-on workshop covering Java basics, OOP concepts and problem solving.",
    category: "programming",
    date: new Date("2026-09-15"),
    time: "02:00 PM",
    venue: "CS Block Lab 1",
    organizer: "Nikhil",
    capacity: 60,
    registrationDeadline: new Date("2026-09-13")
},
{
    title: "Cyber Security Awareness",
    description: "Learn about online safety, passwords, phishing attacks and cybersecurity basics.",
    category: "cybersecurity",
    date: new Date("2026-09-18"),
    time: "12:00 PM",
    venue: "Seminar Hall",
    organizer: "Rohan",
    capacity: 100,
    registrationDeadline: new Date("2026-09-16")
},
{
    title: "Sports Fest",
    description: "Annual inter-department sports event featuring cricket, football, badminton and more.",
    category: "sports",
    date: new Date("2026-09-22"),
    time: "09:00 AM",
    venue: "College Ground",
    organizer: "Sports Club",
    capacity: 250,
    registrationDeadline: new Date("2026-09-19")
},
{
    title: "Cultural Fest",
    description: "A celebration featuring music, dance, drama and other cultural performances.",
    category: "cultural",
    date: new Date("2026-09-27"),
    time: "05:00 PM",
    venue: "Main Auditorium",
    organizer: "Cultural Club",
    capacity: 300,
    registrationDeadline: new Date("2026-09-24")
},
{
    title: "DSA Problem Solving Session",
    description: "Practice arrays, strings, linked lists and other important DSA concepts.",
    category: "coding",
    date: new Date("2026-10-01"),
    time: "10:00 AM",
    venue: "CS Block",
    organizer: "Coding Club",
    capacity: 70,
    registrationDeadline: new Date("2026-09-29")
},
{
    title: "Resume Building Workshop",
    description: "Learn how to create an effective resume and build a strong professional profile.",
    category: "career",
    date: new Date("2026-10-05"),
    time: "02:30 PM",
    venue: "Placement Hall",
    organizer: "Career Development Cell",
    capacity: 100,
    registrationDeadline: new Date("2026-10-03")
},
    ];
    return Event.insertMany(allevents);
}).then(() => {
    console.log("Added data");
}).catch((err) =>  {
    console.log(err);
});