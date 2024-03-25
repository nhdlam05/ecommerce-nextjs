import { Box, IconButton } from '@mui/material';
import ModuleGroup from 'atoms/ModuleGroup';
import Tab from 'atoms/Tab';
import {
    BookingType,
    ChapterType,
    FunnelQuoteType,
    InsurancePackage,
    ProviderChapterApplicationState,
    ProviderChapterPricing,
    ProviderChapterStatus,
    ProviderPricing,
    TherapyBookingType,
} from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import React, { useMemo, useState } from 'react';
import './ProviderDetailPricingAndInsurance.scss';
import Module from 'atoms/Module/Module';
import Title from 'atoms/Title/Title';
import { get, isEmpty, keys } from 'lodash';
import { CHAPTER_PRICING_LABELS } from 'constants/provider';
import Section from 'atoms/Section/Section';
import Icon, { IconBlocked, IconFullCheck, IconInfoCircle } from 'atoms/Icon';
import InsuranceChecker, { NoCoverPackage } from 'components/insurance-checker';
import Typography from 'atoms/Typography';
import Tooltip from 'atoms/Tooltip';
import { useQueryString } from 'use-route-as-state';
import ProviderDetailPricing from './ProviderDetailPricing';

interface Props {
    providerId: string;
    anchorId?: string;
    chapterPricing: ProviderChapterPricing[];
    quoteTypes: FunnelQuoteType[];
    noCovered: boolean;
    applicationStates: ProviderChapterApplicationState[];
}

const ProviderDetailPricingAndInsurance: React.FC<Props> = ({
    anchorId,
    chapterPricing,
    quoteTypes,
    providerId,
    noCovered,
    applicationStates,
}) => {
    const [selectedCoverage, setSelectedCoverage] = useState<
        InsurancePackage | NoCoverPackage
    >();
    const { translate } = useTranslationWithContext();
    const [{ chapterType, quoteType }] = useQueryString();
    const [activeTab, setActiveTab] = useState<string>('');
    const list = useMemo(() => {
        const tabs = [
            ...(quoteTypes.includes(FunnelQuoteType.Therapy)
                ? [
                      {
                          value: `${ChapterType.Individual}-${BookingType.Therapist}`,
                          label: 'chapter.type.individual.therapy',
                          key: FunnelQuoteType.Therapy,
                      },
                  ]
                : []),
            ...(quoteTypes.includes(FunnelQuoteType.Coaching)
                ? [
                      {
                          value: `${ChapterType.Individual}-${BookingType.Coach}`,
                          label: 'chapter.type.individual.coach',
                          key: FunnelQuoteType.Coaching.toLowerCase(),
                      },
                  ]
                : []),
            ...(chapterPricing?.find(
                (item: ProviderChapterPricing) =>
                    item.chapterType === ChapterType.Couple
            ) &&
            applicationStates.find(
                (item: ProviderChapterApplicationState) =>
                    item.applicationStatus === ProviderChapterStatus.Verified &&
                    item.chapterType === ChapterType.Couple
            )
                ? [
                      {
                          value: `${ChapterType.Couple}-${BookingType.FullSession}`,
                          label: 'chapter.type.couple',
                          key: ChapterType.Couple.toLowerCase(),
                      },
                  ]
                : []),
            ...(chapterPricing?.find(
                (item: ProviderChapterPricing) =>
                    item.chapterType === ChapterType.Family
            ) &&
            applicationStates.find(
                (item: ProviderChapterApplicationState) =>
                    item.applicationStatus === ProviderChapterStatus.Verified &&
                    item.chapterType === ChapterType.Family
            )
                ? [
                      {
                          value: `${ChapterType.Family}-${BookingType.FullSession}`,
                          label: 'chapter.type.family',
                          key: ChapterType.Family.toLowerCase(),
                      },
                  ]
                : []),
        ];
        const defaultTabs = [chapterType, quoteType]
            .filter((elm) => elm)
            .map((elm) => elm.toLowerCase());
        const defaultKey = defaultTabs.find((defaultTab: string) =>
            tabs.find(({ key }) => defaultTab === key)
        );
        setActiveTab(
            tabs.find(({ key }) => key === defaultKey)?.value || tabs[0].value
        );
        return tabs;
    }, [chapterPricing, quoteTypes, applicationStates]);

    const onActiveTabChange = (activeTab: string) => {
        setActiveTab(activeTab);
    };

    const getDataByTab = () => {
        const [chapterType, bookingType] = activeTab.split('-');
        const foundItem: ProviderChapterPricing | undefined =
            chapterPricing.find(
                (item: ProviderChapterPricing) =>
                    item.chapterType === (chapterType as ChapterType)
            );
        if (foundItem) {
            return {
                chapterType,
                bookingType,
                items: foundItem.items.filter(
                    (item: ProviderPricing) =>
                        item.bookingType === (bookingType as BookingType)
                ),
            };
        }
        return {
            chapterType,
            bookingType,
            items: [],
        };
    };

    const renderInsuranceByChapterType = (
        chapterType: ChapterType,
        bookingType: BookingType
    ) => {
        if (noCovered || chapterType === ChapterType.Family) {
            return (
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ mr: 1 }}>
                        <Icon
                            icon={<IconBlocked />}
                            size="s"
                            theme="highlighted"
                        />
                    </Box>
                    <Title align="left" size="s" noMargin>
                        {translate(
                            'insurance.confirm.via.supplementary.insurance.no.covered'
                        )}
                    </Title>
                </Box>
            );
        }
        return (
            <>
                <InsuranceChecker
                    providerId={providerId}
                    noCovered={noCovered}
                    variant="modal"
                    selectedValue={selectedCoverage}
                    setSelectedValue={setSelectedCoverage}
                    quoteType={
                        bookingType === BookingType.Coach
                            ? FunnelQuoteType.Coaching
                            : FunnelQuoteType.Therapy
                    }
                    chapterType={chapterType}
                />
            </>
        );
    };

    const getLearnMoreByType = (
        chapterType: ChapterType,
        therapyBookingType: TherapyBookingType
    ) => {
        if (
            (chapterType === ChapterType.Family ||
                chapterType === ChapterType.Couple) &&
            therapyBookingType === TherapyBookingType.IndividualSession
        ) {
            return 'chapter.family.individual.session.extra.text';
        }
        if (therapyBookingType === TherapyBookingType.FirstSession) {
            return 'chapter.individual.first.session.extra.text';
        }
        return null;
    };

    const renderContentByTab = () => {
        const { chapterType, bookingType, items } = getDataByTab();
        const labels = get(
            CHAPTER_PRICING_LABELS,
            [chapterType, bookingType],
            []
        );

        const keyLabels = keys(labels);

        return (
            <Section spacingBottom="xs" key={`${chapterType}_${bookingType}`}>
                <>
                    {keyLabels.map((key: string, index: number) => {
                        const therapyBookingType = key as TherapyBookingType;
                        const pricing = items.filter(
                            (item: ProviderPricing) =>
                                item.therapyType === therapyBookingType
                        );

                        if (isEmpty(pricing)) return <></>;

                        const isFirstItem = index === 0;
                        const tooltipText = getLearnMoreByType(
                            chapterType as ChapterType,
                            therapyBookingType
                        );

                        return (
                            <div
                                key={`${chapterType}_${bookingType}_${therapyBookingType}_${index}`}
                            >
                                <Section
                                    spacingTop={isFirstItem ? '' : 's'}
                                    spacingBottom="xs"
                                >
                                    <Box display="flex" alignItems="center">
                                        <Title
                                            size={isFirstItem ? 'l' : 'm'}
                                            noMargin
                                        >
                                            {translate(labels[key])}
                                        </Title>
                                        {tooltipText && (
                                            <Tooltip
                                                title={
                                                    <Typography
                                                        variant="body2"
                                                        text="secondary"
                                                    >
                                                        {translate(tooltipText)}
                                                    </Typography>
                                                }
                                            >
                                                <IconButton>
                                                    <Icon
                                                        icon={
                                                            <IconInfoCircle />
                                                        }
                                                        size="tiny"
                                                        theme="action"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Section>
                                <ProviderDetailPricing
                                    providerId={providerId}
                                    canShowInsuranceInfo={
                                        !noCovered &&
                                        chapterType !== ChapterType.Family
                                    }
                                    pricing={pricing}
                                    selectedCoverage={selectedCoverage}
                                    quoteType={
                                        bookingType === BookingType.Coach
                                            ? FunnelQuoteType.Coaching
                                            : FunnelQuoteType.Therapy
                                    }
                                    isLast={index === keyLabels.length - 1}
                                    chapterType={chapterType as ChapterType}
                                />
                            </div>
                        );
                    })}
                </>

                <Section spacingTop="s">
                    <Section spacingBottom="xs">
                        <Title size="m">
                            {translate('provider.insurance.checker.subtitle')}
                        </Title>
                    </Section>
                    {renderInsuranceByChapterType(
                        chapterType as ChapterType,
                        bookingType as BookingType
                    )}
                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                        <Box sx={{ mr: 1 }}>
                            <Icon
                                icon={<IconBlocked />}
                                size="s"
                                theme="highlighted"
                            />
                        </Box>
                        <Title align="left" size="s" noMargin>
                            {translate(
                                'insurance.confirm.via.base.insurance.no.covered'
                            )}
                        </Title>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box sx={{ mr: 1 }}>
                            <Icon
                                icon={<IconFullCheck />}
                                size="s"
                                theme="green"
                            />
                        </Box>
                        <Title align="left" size="s" noMargin>
                            {translate('insurance.confirm.self.payment')}
                        </Title>
                    </Box>
                </Section>
            </Section>
        );
    };

    return (
        <div id={anchorId} className="ProviderDetailPricingAndInsurance">
            <ModuleGroup
                title={translate('provider.detail.pricing.and.insurance')}
            >
                <div className="ProviderDetailPricingAndInsurance--tabs">
                    {list.map((item) => (
                        <Tab
                            key={item.value}
                            variant="outlined"
                            onClick={() => onActiveTabChange(item.value)}
                            active={activeTab === item.value}
                            label={translate(item.label)}
                            theme="dark"
                        />
                    ))}
                </div>
                <Module>{renderContentByTab()}</Module>
            </ModuleGroup>
        </div>
    );
};

export default ProviderDetailPricingAndInsurance;
