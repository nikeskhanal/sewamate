import express from "express";
import connectDatabase from "./database/config.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"
import messageRoutes from "./routes/messageroutes.js"
const app = express(); 
const port = process.env.PORT || 5000;
connectDatabase();

app.use(cors());
app.use(express.json()); 
app.use("/uploads", express.static("public/uploads"));


app.use("/api/users", userRoutes);

app.use('/api/messages', messageRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
