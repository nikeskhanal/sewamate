import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDatabase from "./database/config.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageroutes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const port = process.env.PORT || 5000;
connectDatabase();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// Inject io into all requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/chat", messageRoutes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ userId }) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
