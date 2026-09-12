const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");

//dotenv conig
dotenv.config();

//rest obejct
const app = express();

//middlewares
app.use(express.json());
app.use(moragan("dev"));
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:3000",
  "https://the-logic-lounge.github.io"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

//routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

//port
const port = process.env.PORT || 8080;
//listen port
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white,
  );
});
