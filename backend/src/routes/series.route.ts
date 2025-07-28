import express from "express";
import {
    addSeries,
    deleteSeries,
    getAllSeries,
    getSeriesBySlug,
    updateSeries,
} from "../controllers/series.controller";

const router = express.Router();

router.get("/get-all-series", getAllSeries);
router.post("/add-series", addSeries);
router.get("/:slug", getSeriesBySlug);
router.delete("/:id", deleteSeries);
router.put("/:id", updateSeries);

export default router;
