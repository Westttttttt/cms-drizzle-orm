export enum StatusEnum {
    Ongoing = "Ongoing",
    Completed = "Completed",
    Cancelled = "Cancelled",
    Hiatus = "Hiatus",
}

export type AddSeriesBody = {
    title: string;
    alternativeTitles?: string[];
    description?: string;
    coverImageUrl: string;
    genres?: string[];
    status?: StatusEnum;
    isVisible?: boolean;
    isFeatured?: boolean;
    author?: string;
    imageSourceType: "upload" | "link";
};

export type UpdateSeriesBody = {
    slug?: string;
    title?: string;
    alternativeTitles?: string[];
    description?: string;
    coverImageUrl: string;
    deleteImageUrl: string;
    genres?: string[];
    status?: StatusEnum;
    isVisible?: boolean;
    isFeatured?: boolean;
    author?: string;
    availableChapters?: number[];
    updatedAt?: Date;
};

export type ImageBBResponseType = {
    success: boolean;
    data: {
        display_url: string;
        delete_url: string;
    };
};
