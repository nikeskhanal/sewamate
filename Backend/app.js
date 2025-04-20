import express from "express";
import connectDatabase from "./database/config.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"
const app = express(); 
const port = process.env.PORT || 5000;
connectDatabase();

app.use(cors());
app.use(express.json()); 
app.use("/api/users", userRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
