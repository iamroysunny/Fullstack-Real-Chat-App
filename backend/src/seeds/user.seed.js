import { config } from "dotenv";
import connectDB from "../lib/connectDB.js";
import User from "../models/user.model.js";

config();

export const seedUser = [];

const seedDatabase = async () => {
  try {
    await connectDB();
    await User.insertMany(seedUser);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database", error);
  }
};

seedDatabase();
