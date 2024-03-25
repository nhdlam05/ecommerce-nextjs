import Checkbox from 'atoms/Checkbox/Checkbox';
import { ChapterType } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useEffect, useState } from 'react';
import Title from 'atoms/Title/Title';
import { logFirebaseEvent } from 'service/auth';

interface Props {
    defaultValue: ChapterType | null;
    onChange: (data: { chapterType: ChapterType[] | null }) => void;
}

const CHAPTER_TYPE_LIST = [
    {
        key: ChapterType.Individual,
        label: 'chapter.tab.individual',
    },
    {
        key: ChapterType.Couple,
        label: 'chapter.tab.couple',
    },
    {
        key: ChapterType.Family,
        label: 'chapter.tab.family',
    },
];

const ChapterTypeFilter: React.FC<Props> = ({ defaultValue, onChange }) => {
    const { translate } = useTranslationWithContext();

    const [chapterType, setChapterType] = useState<ChapterType | null>(
        defaultValue
    );

    const handleChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        const newChapterType = checked ? value : null;
        setChapterType(newChapterType);
        const newQuoteTypes =
            newChapterType !== ChapterType.Individual ? { quoteTypes: [] } : {};
        onChange({ chapterType: newChapterType, ...newQuoteTypes });
        logFirebaseEvent('chapter_type_filter_choice_clicked', {
            choice: newChapterType,
        });
    };

    useEffect(() => {
        if (defaultValue) {
            setChapterType(defaultValue);
        } else {
            setChapterType(null);
        }
    }, [defaultValue]);

    return (
        <>
            <div className="FilterSelectionDetail--title">
                <Title size="m">
                    {translate('provider.search.filter.offering.title')}
                </Title>
            </div>
            <div className="FilterSelection--singleChoice-wrapper">
                {CHAPTER_TYPE_LIST.map((item) => (
                    <Checkbox
                        id={item.key}
                        value={item.key}
                        type="radio"
                        variant="badge"
                        name="chapterType_filter"
                        key={item.key}
                        align="left"
                        checked={item.key === chapterType}
                        onChange={handleChange}
                        disabled
                    >
                        {translate(item.label)}
                    </Checkbox>
                ))}
            </div>
        </>
    );
};

export default ChapterTypeFilter;
