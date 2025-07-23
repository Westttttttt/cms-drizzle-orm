import express from "express";
import dotenv from "dotenv";
import "dotenv/config";

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
