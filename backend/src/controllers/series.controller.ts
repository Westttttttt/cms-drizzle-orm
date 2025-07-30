import { Request, Response } from "express";
import {
    AddSeriesBody,
    ImageBBResponseType,
    StatusEnum,
    UpdateSeriesBody,
} from "../types/series.type";
import { StatusCode } from "../types/http.type";
import { db } from "../db";
import { seriesTable } from "../db/schema";
import { eq } from "drizzle-orm";

const IMAGEBB_ENDPOINT = process.env.IMAGEBB_ENDPOINT;
const IMAGEBB_API_KEY = process.env.IMAGEBB_API_KEY;

if (!IMAGEBB_API_KEY || !IMAGEBB_ENDPOINT) {
    throw new Error("Please specify endpoint and api_key in .env");
}

//Request<Params, ResBody, ReqBody, ReqQuery>
export const addSeries = async (
    req: Request<{}, {}, AddSeriesBody>,
    res: Response
) => {
    try {
        if (!req.body) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Fields cannot be empty",
            });
        }

        const {
            title,
            description,
            alternativeTitles,
            author,
            genres,
            isVisible,
            status,
            isFeatured,
            imageSourceType,
        } = req.body;

        let { coverImageUrl } = req.body;
        let deleteImageUrl = "";

        if (!title) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Series title is required",
            });
        }

        if (!coverImageUrl) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Cover image is required",
            });
        }

        const slug = title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");

        const isSlugAlreadyExists = (
            await db
                .select()
                .from(seriesTable)
                .where(eq(seriesTable.slug, slug))
        )[0];

        if (isSlugAlreadyExists) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Series with this title already exists",
            });
        }

        if (imageSourceType === "upload") {
            const sanitizedBase64Url = coverImageUrl.split(",")[1];
            const params = new URLSearchParams();
            params.append("image", sanitizedBase64Url);

            const res = await fetch(
                `${IMAGEBB_ENDPOINT}?key=${IMAGEBB_API_KEY}`,
                {
                    method: "POST",
                    body: params,
                }
            );

            const data: ImageBBResponseType = await res.json();
            if (data.success) {
                coverImageUrl = data.data.display_url;
                deleteImageUrl = data.data.delete_url;
            }
        }

        const statusString =
            status === undefined
                ? undefined
                : status === StatusEnum.Ongoing
                ? "Ongoing"
                : status === StatusEnum.Completed
                ? "Completed"
                : status === StatusEnum.Cancelled
                ? "Cancelled"
                : status === StatusEnum.Hiatus
                ? "Hiatus"
                : undefined;

        const newSeriesData: typeof seriesTable.$inferInsert = {
            title,
            slug,
            description,
            alternativeTitles,
            coverImageUrl,
            deleteImageUrl,
            author,
            genres,
            isVisible,
            isFeatured,
            status: statusString,
        };

        const addedSeries = await db.insert(seriesTable).values(newSeriesData);
        if (addedSeries) {
            return res.status(StatusCode.CREATED).json({
                success: true,
                message: "Series added successfully",
            });
        } else {
            return res.status(StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Failed to add Series",
            });
        }
    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(StatusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const getSeriesBySlug = async (
    req: Request<{ slug: string }>,
    res: Response
) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Slug is missing",
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
                message: "Series with the provided slud did't exists",
            });
        }

        res.status(StatusCode.OK).json({
            success: true,
            message: "Series found",
            series,
        });
    } catch (error) {
        console.error("Error in getSeriesBySlug", error);
        return res.status(StatusCode.SERVER_ERROR).json({
            success: true,
            message: "Series found",
            series: null,
        });
    }
};

export const getAllSeries = async (req: Request, res: Response) => {
    try {
        const allSeries = await db.select().from(seriesTable);
        if (!allSeries || allSeries.length <= 0) {
            return res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: "Failed to get all series",
                allSeries: [],
            });
        }

        return res.status(StatusCode.OK).json({
            success: true,
            message: "Series fetched successfully",
            allSeries,
        });
    } catch (error) {
        console.log("Error in getAllSeries", error);
        return res.status(StatusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong",
            allSeries: [],
        });
    }
};

export const deleteSeries = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Id is missing",
            });
        }

        const isSeriesExists = (
            await db.select().from(seriesTable).where(eq(seriesTable.id, id))
        )[0];
        if (!isSeriesExists) {
            return res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: "Series not found, Invalid id",
                deleteSeries: null,
            });
        }

        const deletedSeries = await db
            .delete(seriesTable)
            .where(eq(seriesTable.id, id))
            .returning();

        if (!deleteSeries) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Failed to delete series",
                deleteSeries: null,
            });
        }

        return res.status(StatusCode.OK).json({
            success: true,
            message: "Series deleted successfully",
            deletedSeries,
        });
    } catch (error) {
        console.log("Error in deleteSeries", error);
        return res.status(StatusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong",
            deletedSeries: null,
        });
    }
};

export const updateSeries = async (
    req: Request<{ id: string }, {}, UpdateSeriesBody>,
    res: Response
) => {
    try {
        const { id } = req.params;
        if (!req.body) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "All fields are same",
            });
        }

        const {
            coverImageUrl,
            deleteImageUrl,
            alternativeTitles,
            author,
            availableChapters,
            description,
            genres,
            isFeatured,
            isVisible,
            slug,
            status,
            title,
        } = req.body;

        const updatedData: Partial<typeof seriesTable.$inferInsert> = {};

        if (coverImageUrl) updatedData.coverImageUrl = coverImageUrl;
        if (deleteImageUrl) updatedData.deleteImageUrl = deleteImageUrl;
        if (alternativeTitles)
            updatedData.alternativeTitles = alternativeTitles;
        if (author) updatedData.author = author;
        if (typeof availableChapters === "number")
            updatedData.availableChapters = availableChapters;
        if (description) updatedData.description = description;
        if (genres) updatedData.genres = genres;
        if (typeof isFeatured === "boolean")
            updatedData.isFeatured = isFeatured;
        if (typeof isVisible === "boolean") updatedData.isVisible = isVisible;
        if (slug) updatedData.slug = slug;
        if (title) updatedData.title = title;

        if (status) {
            updatedData.status =
                status === StatusEnum.Ongoing
                    ? "Ongoing"
                    : status === StatusEnum.Completed
                    ? "Completed"
                    : status === StatusEnum.Cancelled
                    ? "Cancelled"
                    : status === StatusEnum.Hiatus
                    ? "Hiatus"
                    : undefined;
        }

        const updatedSeries = await db
            .update(seriesTable)
            .set(updatedData)
            .where(eq(seriesTable.id, id))
            .returning();

        if (updatedSeries.length === 0) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Failed to update Series",
            });
        }

        return res.status(StatusCode.OK).json({
            success: true,
            message: "Series updated Successfully",
            data: updatedSeries[0],
        });
    } catch (error) {
        console.error("Error in updateSeries", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
