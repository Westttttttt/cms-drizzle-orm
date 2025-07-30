import express from "express";
import dotenv from "dotenv";
import "dotenv/config";
import seriesRoutes from "./routes/series.route";
import chapterRoutes from "./routes/chapter.route";
import siteConfigRoutes from "./routes/sideConfig.route";
import cors from "cors";


dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(cors());

//apis
app.use("/api/series", seriesRoutes);
app.use("/api/chapter", chapterRoutes);
app.use("/api/siteConfig", siteConfigRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
