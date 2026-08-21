// const mongoose = require("mongoose");
// const User = require("./models/user");

// const MONGO_URL = "mongodb://127.0.0.1:27017/event_management_sys";

// async function main() {
//   try {
//     await mongoose.connect(MONGO_URL);
//     console.log("Connected to DB");
//     // app.listen(8080, () => {
//     //   console.log("app is listening your port");
//     // });
//   } catch (err) {
//     console.error("DB connection failed:", err);
//     process.exit(1);
//   }
// }

// main();


// const createAdmin = async () => {
//     const admin = new User({
//         username : "Admin",
//         email : "admin@gmail.com",
//         role : "admin",
//     });

//     await User.register(admin, "admin123");
//     console.log("Admin created!");
// }

// createAdmin();