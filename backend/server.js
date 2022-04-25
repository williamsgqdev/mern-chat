const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");


const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middleware/errorMiddleWare");
dotenv.config();

connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("SERVER STARTED");
});
