import { Box } from '@mui/material';
import Icon, { IconCheck, IconPending, IconError, IconTheme } from 'atoms/Icon';
import Tab, { TabTheme } from 'atoms/Tab';
import { useMemo } from 'react';
import { useTranslationWithContext } from 'hooks';
import {
    ChapterType,
    ProviderChapter,
    ProviderChapterStatus,
} from 'generated/graphql';
import { getChapterDataByChapterType } from 'model/provider';
import './OfferingTabs.scss';

interface Props {
    data: ProviderChapter[];
    activeTab: ChapterType;
    onActiveTabChange: (activeTab: ChapterType) => void;
}

const OfferingTabs: React.FC<Props> = ({
    data,
    activeTab,
    onActiveTabChange,
}) => {
    const { translate } = useTranslationWithContext();

    const getThemeByStatus = (status: ProviderChapterStatus) => {
        switch (status) {
            case ProviderChapterStatus.Verified:
                return {
                    icon: <IconCheck />,
                    theme: 'dark',
                };
            case ProviderChapterStatus.Pending:
                return {
                    icon: <IconPending />,
                    theme: 'warning',
                };
            case ProviderChapterStatus.Rejected:
                return {
                    icon: <IconError />,
                    theme: 'danger',
                };
            case ProviderChapterStatus.WaitingForApplication:
            default:
                return {
                    icon: null,
                    theme: 'dark',
                };
        }
    };

    const list = useMemo(() => {
        const individual = getChapterDataByChapterType({
            data,
            chapterType: ChapterType.Individual,
        });
        const couple = getChapterDataByChapterType({
            data,
            chapterType: ChapterType.Couple,
        });
        const family = getChapterDataByChapterType({
            data,
            chapterType: ChapterType.Family,
        });
        return [
            {
                value: ChapterType.Individual,
                label: 'chapter.tab.individual',
                status: individual.applicationStatus,
            },
            {
                value: ChapterType.Couple,
                label: 'chapter.tab.couple',
                status: couple.applicationStatus,
            },
            {
                value: ChapterType.Family,
                label: 'chapter.tab.family',
                status: family.applicationStatus,
            },
        ];
    }, [data]);

    return (
        <div className="OfferingTabs">
            {list.map((item) => {
                const { icon, theme } = getThemeByStatus(item.status);
                return (
                    <Box sx={{ mr: 1 }} key={item.value}>
                        <Tab
                            variant="outlined"
                            onClick={() => onActiveTabChange(item.value)}
                            active={activeTab === item.value}
                            label={translate(item.label)}
                            startSlot={
                                icon ? (
                                    <Icon
                                        icon={icon}
                                        theme={theme as IconTheme}
                                        size="3xs"
                                    />
                                ) : undefined
                            }
                            theme={theme as TabTheme}
                        />
                    </Box>
                );
            })}
        </div>
    );
};
export default OfferingTabs;
