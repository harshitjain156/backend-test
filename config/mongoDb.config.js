// const mongoose = require("mongoose");

// const connectToMongoDB = () => {
//   const mongoURI =
//     process.env.NODE_ENV === "test"
//       ? "mongodb://127.0.0.1:27017/medconnect_test_db"
//       : process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medconnect_db";

//   mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   const connection = mongoose.connection;

//   connection.on("error", (error) => {
//     console.error("Error connecting to MongoDB: ", error);
//   });

//   connection.once("open", () => {
//     console.log("Connected to MongoDB...");
//   });
// };

// module.exports = connectToMongoDB;

const { default: mongoose } = require("mongoose");
const mogoose = require("mongoose");

const connectToMongoDB = () => {
  mogoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medconnect_db"
  );
  const connection = mongoose.connection;
  connection.on("error", (error) => {
    console.log("Error connection to MongoDB: ", error);
  });

  connection.once("open", () => {
    console.log("Connected to MongoDB...");
  });
};

module.exports = { connectToMongoDB };