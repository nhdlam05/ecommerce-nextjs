import { MethodBadge } from 'components/badges';
import {
    ChapterQuoteInfo,
    ChapterType,
    FunnelQuoteType,
    Provider,
    ProviderChapterStatus,
    ProviderExpertise,
} from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import React, { useEffect, useState } from 'react';
import ProviderDetailContentModule from './ProviderDetailContentModule';
import { concat, get, groupBy, keyBy, omit, size } from 'lodash';
import { Box } from '@mui/material';
import Tab from 'atoms/Tab';
import Title from 'atoms/Title/Title';
import Section from 'atoms/Section/Section';
import { CHAPTER_ORDER } from 'util/chapterHelpers';
import { useQueryString } from 'use-route-as-state';

interface Props {
    variant?: 'modal' | null;
    provider: Provider;
}

interface TabData {
    expertisesByTab: {
        [tab: string]: {
            specialExpertises: ProviderExpertise[];
            generalExpertises: ProviderExpertise[];
            label: string;
        };
    };
    specialExpertiseTabs: string[];
    generalExpertiseTabs: string[];
}

const buildExpertises = ({
    influences,
    disorders,
}: Pick<ChapterQuoteInfo, 'influences' | 'disorders'>): {
    specialExpertises: ProviderExpertise[];
    generalExpertises: ProviderExpertise[];
} => {
    const influencesGroupByExpertised = groupBy(influences, 'expertised');
    const disordersGroupByExpertised = groupBy(disorders, 'expertised');
    return {
        specialExpertises: [
            ...get(disordersGroupByExpertised, 'true', []),
            ...get(influencesGroupByExpertised, 'true', []),
        ],
        generalExpertises: [
            ...get(disordersGroupByExpertised, 'false', []),
            ...get(influencesGroupByExpertised, 'false', []),
        ],
    };
};

const buildTabData = (provider: Provider): TabData => {
    const chapterQuoteInfoMap: {
        [chapterType: string]: ChapterQuoteInfo;
    } = keyBy(get(provider, 'profile.chapterQuoteInfo'), 'chapterType');
    let expertisesByTab = {};

    provider.chapterInfo.applicationStates
        .filter(
            ({ applicationStatus }) =>
                applicationStatus === ProviderChapterStatus.Verified
        )
        .sort(
            (a, b) =>
                CHAPTER_ORDER[a.chapterType] - CHAPTER_ORDER[b.chapterType]
        )
        .forEach(({ chapterType }) => {
            if (chapterType === ChapterType.Individual) {
                if (
                    provider.profile?.quoteTypes?.includes(
                        FunnelQuoteType.Therapy
                    )
                ) {
                    expertisesByTab = {
                        ...expertisesByTab,
                        therapy: {
                            label: 'chapter.type.individual.therapy',
                            ...buildExpertises(
                                chapterQuoteInfoMap[ChapterType.Individual][
                                    'therapyQuote'
                                ] || {}
                            ),
                        },
                    };
                }
                if (
                    provider.profile?.quoteTypes?.includes(
                        FunnelQuoteType.Coaching
                    )
                ) {
                    expertisesByTab = {
                        ...expertisesByTab,
                        coaching: {
                            label: 'chapter.type.individual.coach',
                            ...buildExpertises(
                                chapterQuoteInfoMap[ChapterType.Individual][
                                    'coachingQuote'
                                ] || {}
                            ),
                        },
                    };
                }
            } else if (chapterType === ChapterType.Couple) {
                expertisesByTab = {
                    ...expertisesByTab,
                    couple: {
                        label: 'chapter.type.couple',
                        ...buildExpertises(
                            chapterQuoteInfoMap[ChapterType.Couple]
                        ),
                    },
                };
            } else if (chapterType === ChapterType.Family) {
                expertisesByTab = {
                    ...expertisesByTab,
                    family: {
                        label: 'chapter.type.family',
                        ...buildExpertises(
                            chapterQuoteInfoMap[ChapterType.Family]
                        ),
                    },
                };
            }
        });

    const specialExpertiseTabs = Object.keys(expertisesByTab).filter(
        (tab) => get(expertisesByTab, `${tab}.specialExpertises.length`, 0) > 0
    );
    const generalExpertiseTabs = Object.keys(expertisesByTab).filter(
        (tab) => get(expertisesByTab, `${tab}.generalExpertises.length`, 0) > 0
    );
    return { expertisesByTab, specialExpertiseTabs, generalExpertiseTabs };
};

const ProviderDetailMethods: React.FC<Props> = ({ variant, provider }) => {
    const { translate } = useTranslationWithContext();
    const [{ chapterType, quoteType }] = useQueryString();
    const methods =
        provider?.profile?.therapyQuote?.methods ||
        provider?.profile?.coachingQuote?.methods ||
        [];
    const [tabData, setTabData] = useState<TabData>({
        expertisesByTab: {},
        specialExpertiseTabs: [],
        generalExpertiseTabs: [],
    });
    const [selectedSpecialExpertiseTab, setSelectedSpecialExpertiseTab] =
        useState<string>('');
    const [selectedGeneralExpertiseTab, setSelectedGeneralExpertiseTab] =
        useState<string>('');
    const renderExpertisesTabHeader = ({
        title,
        tabs,
        selectedTab,
        setSelectedTab,
    }: {
        title: string;
        tabs: string[];
        selectedTab: string;
        setSelectedTab: (tab: string) => void;
    }) => {
        return (
            <>
                <Title size="ml">{translate(title)}</Title>

                {size(tabs) > 1 && (
                    <Box
                        sx={{
                            display: 'flex',
                            mb: 3,
                        }}
                    >
                        {tabs.map((tab) => {
                            return (
                                <Box sx={{ mr: 1 }} key={tab}>
                                    <Tab
                                        variant="outlined"
                                        onClick={() => setSelectedTab(tab)}
                                        active={selectedTab === tab}
                                        label={translate(
                                            get(tabData, [
                                                'expertisesByTab',
                                                tab,
                                                'label',
                                            ])
                                        )}
                                        theme="dark"
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </>
        );
    };
    const renderExpertisesTabBody = ({
        selectedTab,
        dataKey,
    }: {
        selectedTab: string;
        dataKey: string;
    }) => {
        const expertises = get(
            tabData,
            `expertisesByTab.${selectedTab}.${dataKey}`,
            []
        );
        const expertisesGroupByCategory = groupBy(
            expertises,
            'detail.category'
        );
        const nonCategoryExpertises = concat(
            get(expertisesGroupByCategory, 'undefined', []),
            get(expertisesGroupByCategory, 'null', [])
        );
        const expertisesByCategory = omit(expertisesGroupByCategory, [
            'undefined',
            'null',
        ]);

        return (
            <>
                {nonCategoryExpertises && nonCategoryExpertises.length > 0 && (
                    <ProviderDetailContentModule variant={variant}>
                        {nonCategoryExpertises &&
                            nonCategoryExpertises.length > 0 &&
                            nonCategoryExpertises?.map(
                                (item: ProviderExpertise) => (
                                    <MethodBadge
                                        showMoreInfo={variant !== 'modal'}
                                        item={item}
                                        key={item.key}
                                    />
                                )
                            )}
                        {Object.keys(expertisesByCategory).map((category) => (
                            <div key={category}>
                                <Section spacingTop="s" spacingBottom="xs">
                                    <Title tag="span" size="xs">
                                        {translate(
                                            `providercontent.family.category.${category}.title`.toLowerCase()
                                        )}
                                    </Title>
                                </Section>
                                <div>
                                    {expertisesByCategory[category].map(
                                        (item: ProviderExpertise) => (
                                            <MethodBadge
                                                showMoreInfo={
                                                    variant !== 'modal'
                                                }
                                                item={item}
                                                key={item.key}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </ProviderDetailContentModule>
                )}
            </>
        );
    };

    useEffect(() => {
        const defaultTabs = [chapterType, quoteType]
            .filter((elm) => elm)
            .map((elm) => elm.toLowerCase());

        const tabData = buildTabData(provider);
        setTabData(tabData);
        setSelectedSpecialExpertiseTab(
            defaultTabs.find((defaultTab: string) =>
                tabData.specialExpertiseTabs.includes(defaultTab)
            ) || tabData.specialExpertiseTabs[0]
        );
        setSelectedGeneralExpertiseTab(
            defaultTabs.find((defaultTab: string) =>
                tabData.generalExpertiseTabs.includes(defaultTab)
            ) || tabData.generalExpertiseTabs[0]
        );
    }, [provider]);

    return (
        <>
            {/* Specializations */}
            {renderExpertisesTabHeader({
                title: 'providerContent.expertise.title',
                tabs: tabData?.specialExpertiseTabs,
                selectedTab: selectedSpecialExpertiseTab,
                setSelectedTab: setSelectedSpecialExpertiseTab,
            })}
            {renderExpertisesTabBody({
                selectedTab: selectedSpecialExpertiseTab,
                dataKey: 'specialExpertises',
            })}

            {/* General expertises */}
            {renderExpertisesTabHeader({
                title: 'providerContent.general.title',
                tabs: tabData?.generalExpertiseTabs,
                selectedTab: selectedGeneralExpertiseTab,
                setSelectedTab: setSelectedGeneralExpertiseTab,
            })}
            {renderExpertisesTabBody({
                selectedTab: selectedGeneralExpertiseTab,
                dataKey: 'generalExpertises',
            })}

            {methods.length > 0 && (
                <ProviderDetailContentModule
                    variant={variant}
                    anchorId="methods"
                    title={translate('providerContent.methods.title')}
                >
                    {methods.map((item: ProviderExpertise) => (
                        <MethodBadge
                            item={item}
                            key={item.key}
                            showExpertised={false}
                            showMoreInfo={variant !== 'modal'}
                        />
                    ))}
                </ProviderDetailContentModule>
            )}
        </>
    );
};

export default ProviderDetailMethods;
