const express = require("express");
const app = express();
const cors = require('cors');
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const dotenv = require("dotenv");
dotenv.config();

connectDB();

app.use(cors())

app.use(express.json());

app.use("/api/v1/users", userRoutes);

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("SERVER STARTED");
});
