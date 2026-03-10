const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGO_URI = "mongodb+srv://jerinrubaiya:8OBMTiNAUgITyKne@cluster0.antekia.mongodb.net/EduNest?retryWrites=true&w=majority";

// Define your User schema (same as your backend)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // required for login
  role: { type: String, enum: ["student", "instructor", "admin"], default: "student" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function insertUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const users = [
      {
        name: "Test Student",
        email: "student@example.com",
        password: "stu12345",
        role: "student"
      },
      {
        name: "Test Instructor",
        email: "instructor@example.com",
        password: "ins12345",
        role: "instructor"
      }
    ];

    for (let user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      await User.updateOne(
        { email: user.email },
        { $set: user },
        { upsert: true }
      );
      console.log(`Inserted/Updated user: ${user.email}`);
    }

    console.log("All users inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

insertUsers();
