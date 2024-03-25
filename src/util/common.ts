import { isEmpty, isNil, take } from 'lodash';

type NumberOfBadgesShouldBeRenderedOption = {
    perfectViewLine: number;
    charPerLine: number;
    longChars: number;
};

const DEFAULT_OPTION: NumberOfBadgesShouldBeRenderedOption = {
    perfectViewLine: 2,
    charPerLine: 30,
    longChars: 20,
};

export type Bagde = {
    label: string;
};

export const getNumberOfBadgesShouldBeRendered = (
    list: Bagde[],
    opt?: NumberOfBadgesShouldBeRenderedOption
): number => {
    const option = {
        ...DEFAULT_OPTION,
        ...opt,
    };
    const { perfectViewLine, charPerLine, longChars } = option;
    let charCount = 0;
    let needTake = 1;

    for (const item of list) {
        charCount += item.label ? item.label.length : 0;
        if (charCount < charPerLine * perfectViewLine) {
            needTake += 1;
        } else {
            break;
        }
    }

    const listWillTake = take(list, needTake);
    const itemHaslongText = listWillTake.find(
        (item: Bagde) => item.label && item.label.length > longChars
    );

    if (itemHaslongText) return needTake - 1;

    return needTake;
};

export const parseQueryParams = (value: any) => {
    if (value === '1' || value === 'true') {
        return true;
    }

    if (value === '0' || value === 'false') {
        return false;
    }
    const decodedValue = decodeURIComponent(value);
    const parseByComma = decodedValue.split(',');

    return parseByComma.length === 1 ? decodedValue : parseByComma;
};

export const parseSearchQuery = (search: string) => {
    if (isNil(search) || isEmpty(search)) return {};
    const queryString = search.charAt(0) === '?' ? search.substring(1) : search;
    const queryArray = queryString.split('&');

    if (isEmpty(queryArray)) return {};

    return queryArray.reduce((acc, cur) => {
        const [name, value] = cur.split('=');
        return { ...acc, [name]: parseQueryParams(value) };
    }, {});
};
