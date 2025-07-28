export type AddChapterBody = {
    chapterNumber: number;
    chapterTitle: string;
    isVisible: boolean;
    slides: string[]
};

export type UpdateChapterBody = {
    chapterNumber: number;
    chapterTitle: string;
    isVisible: boolean;
};
