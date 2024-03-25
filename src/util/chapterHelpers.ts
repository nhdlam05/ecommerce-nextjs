import { ChapterType } from 'generated/graphql';

export const CHAPTER_ORDER: { [chapter: string]: number } = {
    INDIVIDUAL: 1,
    COUPLE: 2,
    FAMILY: 3,
};
export const getChapterTypeFromQueryParams = (params: any): ChapterType => {
    if (!params.chapterType) return ChapterType.Individual;
    return params.chapterType.toUpperCase() as ChapterType;
};
