import express from "express";
import { addChapter, deleteChapter, getChapterBySeriesSlug, updateChapter } from "../controllers/chapter.controller";

const router = express.Router();

router.post("/add-chapter/:seriesId", addChapter);
router.delete("/:chapterId",deleteChapter );
router.get("/get-chapter-by-slug/:slug", getChapterBySeriesSlug);
router.patch("/:chapterId", updateChapter);

export default router;
