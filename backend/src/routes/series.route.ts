import express from "express";
import {
    addSeries,
    deleteSeries,
    getAllSeries,
    getSeriesBySlug,
    updateSeries,
} from "../controllers/series.controller";

const router = express.Router();

router.get("/", getAllSeries);
router.post("/add", addSeries);
router.get("/:slug", getSeriesBySlug);
router.delete("/:id", deleteSeries);
router.put("/:id", updateSeries)

export default router;
