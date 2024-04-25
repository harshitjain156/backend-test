const express = require("express");
const { connectToMongoDB } = require("./config/mongoDb.config");
require("dotenv").config();
const cors = require("cors");

//Initilizing app as express method
const app = express();

// Middlewares for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

// patient auth route
const patientAuthRoutes = require("./routes/patient.auth.routes");
app.use("/patient/auth", patientAuthRoutes);

// doctor auth route
const doctorAuthRoutes = require("./routes/doctor.auth.routes");
app.use("/doctor/auth", doctorAuthRoutes);

// pharmacy auth route
const pharmacyAuthRoutes = require("./routes/pharmacy.auth.routes");
app.use("/pharmacy/auth", pharmacyAuthRoutes);

const { authenticateToken } = require("./middleware/auth.middleware");

// patient routes
const patientRoutes = require("./routes/patient.routes");
app.use("/", authenticateToken, patientRoutes);

// prescription routes
const prescriptionRoutes = require("./routes/prescription.routes");
app.use("/", authenticateToken, prescriptionRoutes);

// pharmacy routes
const pharmacyRoutes = require("./routes/pharmacy.routes");
app.use("/", pharmacyRoutes);

// medicine routes
const medicineRoutes = require("./routes/medicine.routes");
app.use("/", authenticateToken, medicineRoutes);

// medication order routes
const medicationOrderRoutes = require("./routes/medication.order.routes");
app.use("/", authenticateToken, medicationOrderRoutes);

// doctor routes
const doctorRoutes = require("./routes/doctor.routes");
app.use("/", authenticateToken, doctorRoutes);

// chat routes
const chatRoutes = require("./routes/chat.routes");
app.use("/", authenticateToken, chatRoutes);

// appointment routes
const appointmentRoutes = require("./routes/appintment.routes");
app.use("/", authenticateToken, appointmentRoutes);

app.use((err, req, res, next) => {
  console.error(err); // Log the full error to the console

  // Send a detailed error message in the response (only in development mode)
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      stack: err.stack,
    });
  } else {
    // In production, send a generic message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Listening on server port and logging status
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server listining on PORT: ", PORT);
  connectToMongoDB();
});

// const PORT = process.env.PORT;
// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log("Server listening on PORT: ", PORT);
//     connectToMongoDB(); // Connect to MongoDB only when starting the server
//   });
// }

module.exports = app;
