// // seed.js
// import mongoose from "mongoose";
// import User from "./models/index.js";
// import "./db/index.js";

// // Define the data to seed
// const users = [
//   { name: "John Doe", email: "john@example.com", age: 25 },
//   { name: "Jane Smith", email: "jane@example.com", age: 30 },
//   { name: "Alice Johnson", email: "alice@example.com", age: 28 },
// ];

// // Function to seed the database
// const seedDatabase = async () => {
//   try {
//     // Clear the existing data
//     await User.deleteMany({});

//     // Insert the new data
//     await User.insertMany(users);

//     console.log("Database seeded successfully");
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   } finally {
//     // Close the connection
//     mongoose.connection.close();
//   }
// };

// // Run the seed function
// seedDatabase();
