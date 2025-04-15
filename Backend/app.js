import express from "express";
import connectDatabase from "./database/config.js"; // fixed typo
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"
const app = express(); // correct way to use express
const port = process.env.PORT || 5000; // define port

connectDatabase();

app.use(cors()); // apply CORS middleware
app.use(express.json()); // parse JSON body if needed
app.use("/api/users", userRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
