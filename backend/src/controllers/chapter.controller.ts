import { Request, Response } from "express";
import { db } from "../db";
import { chapterTable, seriesTable, slidesTable } from "../db/schema";
import { AddChapterBody, UpdateChapterBody } from "../types/chapter.type";
import { StatusCode } from "../types/http.type";
import { and, eq, is } from "drizzle-orm";

//Request<Params, ResBody, ReqBody, ReqQuery>
export const addChapter = async (
    req: Request<{ seriesId: string }, {}, AddChapterBody>,
    res: Response
) => {
    try {
        const { seriesId } = req.params;
        if (!seriesId) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "SeriesId is missing",
            });
        }

        const { chapterNumber, chapterTitle, isVisible, slides } = req.body;

        if (!chapterNumber) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Chapter Number is required",
            });
        }

        const chapter = await db
            .select()
            .from(chapterTable)
            .where(
                and(
                    eq(chapterTable.seriesId, seriesId),
                    eq(chapterTable.chapterNumber, chapterNumber)
                )
            )
            .limit(1);

        const isChapterAlreadyExists = chapter.length > 0;

        if (isChapterAlreadyExists) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Chapter number already existed for this series",
            });
        }

        const newChapterData: typeof chapterTable.$inferInsert = {
            chapterNumber,
            chapterTitle,
            isVisible,
            seriesId,
        };

        const newChapter = (
            await db.insert(chapterTable).values(newChapterData).returning()
        )[0];

        if (!newChapter) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Failed to add new Chapter",
            });
        }

        if (slides && slides.length > 0) {
            await Promise.all(
                slides.map((slide, index) =>
                    db.insert(slidesTable).values({
                        chapterId: newChapter.id,
                        position: index,
                        imageUrl: slide,
                        deleteImageUrl: "",
                    })
                )
            );
        }

        return res.status(StatusCode.CREATED).json({
            success: true,
            message: "Chapter added successfully",
        });
    } catch (error) {
        console.log("Error adding chapter", error);
        return res.status(StatusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const deleteChapter = async (
    req: Request<{ chapterId: string }>,
    res: Response
) => {
    try {
        const { chapterId } = req.params;
        if (!chapterId) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "ChapterId is missing",
            });
        }

        const isChapterExists = await db
            .select()
            .from(chapterTable)
            .where(eq(chapterTable.id, chapterId));

        if (!isChapterExists) {
            return res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: "Chapter not Found",
            });
        }

        const deletedChapter = await db
            .delete(chapterTable)
            .where(eq(chapterTable.id, chapterId));
        if (deletedChapter) {
            return res.status(StatusCode.OK).json({
                success: true,
                message: "Chapter deleted successfully",
            });
        }
    } catch (error) {
        console.log("Error deleting chapter", error);
        return res.status(StatusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const getChapterBySeriesSlug = async (
    req: Request<{ slug: string }>,
    res: Response
) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Slug is missing",
                chapters: [],
            });
        }

        const series = (
            await db
                .select()
                .from(seriesTable)
                .where(eq(seriesTable.slug, slug))
        )[0];
        if (!series) {
            return res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: "Series not found",
                chapters: [],
            });
        }

        const seriesId = series.id;

        const chapters = await db
            .select()
            .from(chapterTable)
            .where(eq(chapterTable.seriesId, seriesId));

        if (!chapters) {
            return res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: "No chapter uploaded",
                chapters: [],
            });
        }

        return res.status(StatusCode.OK).json({
            success: true,
            message: "Chapter fetched successfully",
            chapters,
        });
    } catch (error) {
        console.log("Error fetching chapters", error);
        return res.status(StatusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong",
            chapters: [],
        });
    }
};

export const updateChapter = async (
    req: Request<{ chapterId: string }, {}, UpdateChapterBody>,
    res: Response
) => {
    try {
        const { chapterId } = req.params;
        if (!chapterId) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "ChapterId is missing",
            });
        }

        const { chapterNumber, chapterTitle, isVisible } = req.body;

        const updatedData: Partial<typeof chapterTable.$inferInsert> = {};

        if (chapterNumber) updatedData.chapterNumber = chapterNumber;
        if (chapterTitle) updatedData.chapterTitle = chapterTitle;
        if (isVisible) updatedData.isVisible = isVisible;

        const isChapterExists = (await db.select().from(chapterTable))[0];
        if (!isChapterExists) {
            return res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: "Chapter not found",
            });
        }

        const updatedChapter = await db
            .update(chapterTable)
            .set(updatedData)
            .where(eq(chapterTable.id, chapterId))
            .returning();

        if (updatedChapter.length === 0) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Failed to update chapter",
            });
        }

        return res.status(StatusCode.OK).json({
            success: true,
            message: "Chapter updated successfully",
        });
    } catch (error) {
        console.log("Error in update chapter", error);
        return res.status(StatusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
