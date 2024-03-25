import Avatar from 'atoms/Avatar/Avatar';
import Badge from 'atoms/Badge/Badge';
import Button from 'atoms/Button/Button';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import { SkeletonInfoCard } from 'atoms/Skeleton';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { CopyProviderUrlCTA, SaveAndShareButtons } from 'components/common';
import { QUOTE_TYPES } from 'components/filter/QuoteTypesFilter';
import { NoCoverPackage } from 'components/insurance-checker';
import {
    DifferentBetweenTherapyAndCoachingModal,
    HowDoesOnlineWorkModal,
} from 'components/modals';
import { YEAR_OF_EXP } from 'constants/common';
import {
    RECOMMENDATION_PROVIDER_SLUG,
    THE_LAST_SEARCH_URL,
} from 'constants/provider';
import { PROVIDER_AREA_TRANSLATION_KEY } from 'constants/providerArea';
import { DialogMode, ModalContext } from 'context/modal';
import {
    AnalyticsEventType,
    BookingType,
    ChapterType,
    FunnelQuoteType,
    FunnelSearchSource,
    InsuranceCompany,
    InsurancePackage,
    Provider,
    ProviderChapterApplicationState,
    ProviderChapterPricing,
    ProviderChapterStatus,
    ProviderNextAvailableDayInfo,
    ProviderPricing,
} from 'generated/graphql';
import {
    useLocalStorage,
    usePlatform,
    useTracking,
    useTranslationWithContext,
} from 'hooks';
import { capitalize, first, get } from 'lodash';
import { Optional } from 'model/common';
import {
    FUNNEL_QUOTE_TYPE_QUERY_PARAM,
    SOURCE_QUERY_PARAM,
} from 'model/funnel';
import {
    getCity,
    getProviderAudioUrl,
    hasOnlineSessionOffered,
} from 'model/provider';
import { buildFullName } from 'model/user';
import moment from 'moment';
import React, { useContext } from 'react';
import { AiOutlineInfoCircle, AiTwotoneStar } from 'react-icons/ai';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import { MdLocationOn } from 'react-icons/md';
import { logFirebaseEvent } from 'service/auth';
import { useQueryString } from 'use-route-as-state';
import { isTherapy } from 'util/globalHelpers';
import { getPackageDiscountWithPrice } from 'util/insuranceCheckerHelpers';
import { renderFriendlyDateInfo } from 'util/time/formatTime';
import ProviderDescription from './ProviderDescription';
import './ProviderInfoCard.scss';
import { ProviderDetailContext } from 'context/provider-detail';
import { Box } from '@mui/material';
import { InformationTooltip } from 'atoms/Tooltip';
import Icon, { IconInfoCircle } from 'atoms/Icon';

interface Props {
    provider: Provider;
    isBestMatch?: boolean;
    isHeaderShown?: boolean;
    isHeaderActionShown?: boolean;
    isCopyLinkShown?: boolean;
    recommendedBy?: string; // show the slug here
    funnelQuoteType: FunnelQuoteType;
    source?: string;
    loading?: boolean;
    recommendedRank?: number;
    quoteId?: Optional<string>;
    bestMatchLabel?: string;
    insurancePackage?: InsurancePackage | NoCoverPackage;
    insuranceCompany?: InsuranceCompany;
}

const ProviderInfoCard: React.FC<Props> = ({
    isBestMatch = false,
    isHeaderShown = true,
    isHeaderActionShown = true,
    isCopyLinkShown = false,
    provider,
    funnelQuoteType,
    recommendedBy,
    source,
    loading,
    recommendedRank,
    quoteId,
    bestMatchLabel = 'Aepsy match',
    insurancePackage,
    insuranceCompany,
}) => {
    const { track } = useTracking();
    const { isDesktop } = usePlatform();
    const { showProviderDetailModal } = useContext(ProviderDetailContext);
    const { setStorageKey } = useLocalStorage();
    const { translate, currentLang } = useTranslationWithContext();
    const [queryParams] = useQueryString();

    const { userInfo, userName, profile, bookingInfo } = provider;
    const { providerInfo, locationInfo, quoteTypes } = profile;
    const quoteType = quoteTypes.includes(funnelQuoteType)
        ? funnelQuoteType
        : quoteTypes[0];
    // const { expertisesChoosen } = useBookingFunnel({
    //     quoteType,
    // });
    const { showModal } = useContext(ModalContext);

    const name = buildFullName(userName);

    function buildQueryParams() {
        const params: any = {};

        if (quoteType) {
            params[FUNNEL_QUOTE_TYPE_QUERY_PARAM] = quoteType.toLowerCase();
        }

        if (recommendedBy) {
            params['apy_src'] = recommendedBy;
        }

        if (source) {
            params['apy_src'] = source;
        }

        if (quoteId) {
            params['searchId'] = quoteId;
        }

        if (recommendedRank != null) {
            params['rank'] = recommendedRank;
        }

        const {
            influences,
            disorders,
            symptoms,
            isDiagnosis,
            insuranceCompanyId,
            packageId,
            languages,
            chapterType,
        } = queryParams;

        if (influences) {
            params['influences'] = influences;
        }
        if (disorders) {
            params['disorders'] = disorders;
        }

        if (symptoms) {
            params['symptoms'] = symptoms;
        }

        if (isDiagnosis) {
            params['isDiagnosis'] = isDiagnosis;
        }

        if (insuranceCompanyId) {
            params['insuranceCompanyId'] = insuranceCompanyId;
        }

        if (packageId) {
            params['packageId'] = packageId;
        }

        if (languages) {
            params['languages'] = languages;
        }

        if (chapterType) {
            params['chapterType'] = chapterType;
        }

        if (isCopyLinkShown) {
            params[SOURCE_QUERY_PARAM] = FunnelSearchSource.ProviderBrowsePage;
        }

        return params;
    }

    function getLinkURL() {
        const params = buildQueryParams();
        const queryString = Object.keys(params)
            .map((key) => key + '=' + params[key])
            .join('&');

        if (queryString) {
            return '/t/' + profile.slug + '?' + queryString;
        } else {
            return '/t/' + profile.slug;
        }
    }

    const setPreviousUrl = () => {
        const {
            location: { pathname, search },
        } = window;
        setStorageKey(
            pathname === '/select'
                ? THE_LAST_SEARCH_URL
                : RECOMMENDATION_PROVIDER_SLUG,
            pathname + search
        );
    };

    function goToUrl(e: any) {
        e.preventDefault();

        logFirebaseEvent('provider_info_card_visit_button_clicked', {
            recommendedRank,
            slug: profile.slug,
            quoteType,
            source,
            quoteId,
        });

        if (isDesktop) {
            const url = getLinkURL();
            setPreviousUrl();
            window.open(url, '_blank');
        } else {
            onMainActioClicked();
        }
    }

    function renderBestMatchBadge() {
        return (
            <div className="FlashyHighlight">
                <i>
                    <AiTwotoneStar />
                </i>
                <span>{bestMatchLabel}</span>
            </div>
        );
    }

    function renderHeaderInfo() {
        const { nextAvailabilitySlot, nextAvailableDayInfo } = bookingInfo;
        if (nextAvailabilitySlot && nextAvailableDayInfo) {
            return (
                <Badge
                    size="m"
                    variant="success"
                    label={buildAvailabilityInfo(nextAvailableDayInfo)}
                />
            );
        }

        return (
            <Badge variant="error" label={translate('generic.waitingList')} />
        );
    }

    function renderDescription() {
        return providerInfo.about ? (
            <Section spacingTop="xs" spacingBottom="s">
                <ProviderDescription
                    providerName={name}
                    content={providerInfo}
                    providerMultiLangInfo={
                        provider.profile.providerInfo.multiLangInfo
                    }
                    onShowMoreDescription={onMainActioClicked}
                />
            </Section>
        ) : (
            ''
        );
    }

    function buildAvailabilityInfo(
        nextAvailableDayInfo: ProviderNextAvailableDayInfo
    ) {
        const dateString = renderFriendlyDateInfo(
            moment(nextAvailableDayInfo.date)
        );
        return `${translate('generic.available')} ${dateString}`;
    }

    function onAudioPlayerClick() {
        track({
            eventType: AnalyticsEventType.SpAudioPlayerClicked,
            data: {
                source,
                providerId: userInfo.firebaseUid,
            },
        });
    }

    function renderAvatar() {
        return (
            <Section spacingBottom="s">
                <a href={getLinkURL()} onClick={goToUrl}>
                    <Avatar
                        align="center"
                        src={userInfo.avatar}
                        size={isDesktop ? 'l' : 'ml'}
                        audioSrc={getProviderAudioUrl(
                            providerInfo,
                            currentLang
                        )}
                        providerSlug={provider.profile.slug}
                        onAudioPlayerClick={onAudioPlayerClick}
                    />
                </a>
            </Section>
        );
    }

    function renderMediumLocation() {
        const badgeArray = buildLocationDescriptionString();
        return badgeArray.map((props: any, index: number) => (
            <Badge key={index} {...props} size="s" />
        ));
    }

    const onShowHowDoesOnlineWorkModal = () =>
        showModal(<HowDoesOnlineWorkModal />, {
            title: translate('provider.search.how.does.online.work'),
            mode: DialogMode.Info,
        });

    function buildLocationDescriptionString() {
        const city = getCity(locationInfo);
        const area =
            locationInfo.areas && locationInfo.areas.length > 0
                ? locationInfo.areas[0]
                : null;
        const onlineSessionOffered = hasOnlineSessionOffered(locationInfo);

        const onlineBadge = {
            startSlot: <BsFillCameraVideoFill size="18" />,
            label: 'Online',
            clickable: true,
            endSlot: <AiOutlineInfoCircle fill="#BE6B65" />,
            onClick: onShowHowDoesOnlineWorkModal,
        };

        if (area == null) {
            return [onlineBadge];
        } else {
            const translatedArea = translate(
                PROVIDER_AREA_TRANSLATION_KEY[area]
            );
            const locationString = city
                ? `${city} - ${translatedArea}`
                : `${translatedArea}`;

            return [
                ...(onlineSessionOffered ? [onlineBadge] : []),
                {
                    startSlot: <MdLocationOn size="18" />,
                    label: locationString,
                },
            ];
        }
    }

    function renderTitle() {
        return (
            <a href={getLinkURL()} onClick={goToUrl}>
                <Title size="l" align="left" noMargin>
                    {name}
                </Title>
            </a>
        );
    }

    const onMainActioClicked = () => {
        showProviderDetailModal({
            slug: profile.slug,
            quoteType,
            providerName: name,
            avatar: userInfo.avatar,
            providerInfo,
            searchId: quoteId,
            source,
            recommendedRank,
        });
    };

    function renderMainAction() {
        return (
            <Button
                size={isDesktop ? 'l' : 'm'}
                isFullsize
                label={translate('provider.card.button')}
                iconArrow
                theme={bookingInfo?.nextAvailabilitySlot ? 'dark' : 'ghosted'}
                onClick={goToUrl}
            />
        );
    }

    const getPriceByChapterType = (chapterType: ChapterType) => {
        const chapterPricings = provider.chapterPricing.find(
            (item: ProviderChapterPricing) => item.chapterType === chapterType
        );
        switch (chapterType) {
            case ChapterType.Individual:
                return (
                    chapterPricings?.items?.filter((item: ProviderPricing) =>
                        isTherapy(quoteType)
                            ? item.bookingType === BookingType.Therapist
                            : item.bookingType === BookingType.Coach
                    ) || []
                );
            default:
                return chapterPricings?.items || [];
        }
    };
    const getPrice = () => {
        const chapterType = queryParams.chapterType as ChapterType;
        const isValidChapterType =
            !!provider.chapterInfo.applicationStates.find(
                (item: ProviderChapterApplicationState) =>
                    item.applicationStatus === ProviderChapterStatus.Verified &&
                    item.chapterType === chapterType
            );
        if (!isValidChapterType || !chapterType) {
            return 0;
        }
        const pricingItems = getPriceByChapterType(chapterType);
        const sortedPricingItems = [...pricingItems].sort(
            (a: any, b: any) => a.price - b.price
        );
        return get(first(sortedPricingItems), 'price', 0);
    };

    function renderYearOfExperienceAndPricingInfo() {
        const price = getPrice();
        const { discountAmount, isFree } = getPackageDiscountWithPrice({
            price,
            insurancePackage,
            quoteType,
        });

        const isCovered = isProviderCoveredByInsurance();

        return (
            <>
                {providerInfo.yearOfExperienceType && (
                    <Text size="s" theme="dark" tag="span">
                        <>
                            {translate({
                                key: 'provider.profile.year.of.experience',
                                context: {
                                    yearOfExperience: translate(
                                        YEAR_OF_EXP[
                                            providerInfo.yearOfExperienceType
                                        ]
                                    ),
                                },
                            })}
                            {price > 0 ? ', ' : ''}
                        </>
                    </Text>
                )}

                {price > 0 && (
                    <>
                        <Text size="s" theme="dark" tag="span">
                            {translate('generic.from')} CHF{' '}
                            {isFree && isCovered ? 0 : price}
                            .-
                        </Text>
                        {isCovered && discountAmount > 0 && (
                            <Text size="s" theme="purple" tag="span">
                                <strong>
                                    {' '}
                                    CHF {discountAmount}
                                    .-
                                </strong>
                            </Text>
                        )}
                    </>
                )}
            </>
        );
    }

    // function renderExpertises() {
    //     const quote =
    //         quoteType === FunnelQuoteType.Therapy
    //             ? profile.therapyQuote
    //             : profile.coachingQuote;

    //     const disorders = quote?.disorders || [];
    //     const influences = quote?.influences || [];

    //     const combinedList = [...influences, ...disorders].filter(
    //         (e) => e.expertised
    //     );

    //     const sortedList =
    //         expertisesChoosen.length === 0
    //             ? combinedList
    //             : [...combinedList].sort((a: any) =>
    //                   expertisesChoosen.includes(a.key) ? -1 : 1
    //               );

    //     return (
    //         <Section spacing="xs">
    //             <ProviderExpertises
    //                 expertises={sortedList}
    //                 onShowMore={logShowMoreExpertiseEvent}
    //             />
    //         </Section>
    //     );
    // }

    function onShowQuoteTypeInfoModal(quoteType: FunnelQuoteType) {
        const coachInfoHidden = quoteType === FunnelQuoteType.Therapy;

        showModal(
            <DifferentBetweenTherapyAndCoachingModal
                coachingInfoHidden={coachInfoHidden}
                therapyInfoHidden={!coachInfoHidden}
            />,
            {
                title: translate(QUOTE_TYPES[quoteType]),
            }
        );
    }

    const renderQuoteTypes = () => {
        return (
            <Section spacingTop="xs">
                {quoteTypes.map((quoteType: FunnelQuoteType, index: number) => (
                    <Badge
                        key={index}
                        size="s"
                        variant={
                            quoteType === FunnelQuoteType.Coaching
                                ? 'highlight'
                                : 'sky'
                        }
                        label={translate(QUOTE_TYPES[quoteType])}
                        endSlot={<AiOutlineInfoCircle fill="#BE6B65" />}
                        onClick={() => onShowQuoteTypeInfoModal(quoteType)}
                    />
                ))}
            </Section>
        );
    };

    function renderDefaultContent() {
        return (
            <>
                {renderAvatar()}
                {renderMediumLocation()}
                {renderTitle()}
                {renderYearOfExperienceAndPricingInfo()}
                {renderQuoteTypes()}
                {renderDescription()}
            </>
        );
    }

    const getClassNameByRecommendedRank = () => {
        switch (recommendedRank) {
            case 0:
                return 'first-rank';
            case 1:
                return 'second-rank';
            case 2:
                return 'third-rank';
            default:
                return '';
        }
    };

    const isProviderCoveredByInsurance = () => {
        // TODO: REFACTOR THIS TO BACKEND
        if (!insuranceCompany) return false;
        const { coachingCovered } = insuranceCompany;

        return (
            (quoteTypes.includes(FunnelQuoteType.Therapy) ||
                (quoteTypes.includes(FunnelQuoteType.Coaching) &&
                    coachingCovered)) &&
            !provider.insuranceCoverageInfo?.hasZsrNumber &&
            !provider.insuranceCoverageInfo?.hasInsuranceNotCoveredSpecialReason
        );
    };

    const showInsuranceLearnMoreModal = () => {
        if (!insuranceCompany) return;
        const { name } = insuranceCompany;
        showModal(<>content here...</>, {
            title: name,
        });
    };

    const renderInsuranceInfo = () => {
        if (!isProviderCoveredByInsurance() || !insuranceCompany) return <></>;

        const { name } = insuranceCompany;

        return (
            <Section spacingTop="xs">
                <Box display="flex" justifyContent="center">
                    <Box
                        display="flex"
                        alignItems="center"
                        onClick={showInsuranceLearnMoreModal}
                    >
                        <Title theme="purple" size="s" align="center" noMargin>
                            {translate({
                                key: 'provider.card.insurance.note',
                                context: {
                                    companyName: capitalize(name),
                                },
                            })}
                        </Title>
                        <Box sx={{ ml: 1 }}>
                            <Icon
                                icon={<IconInfoCircle />}
                                size="tiny"
                                theme="action"
                            />
                        </Box>
                    </Box>
                </Box>
            </Section>
        );

        // return (
        //     <Text size="xs" align="center">
        //         {translate('provider.card.insurance.nudge')}
        //     </Text>
        // );
    };

    return (
        <div
            className={`ProviderInfoCard ${getClassNameByRecommendedRank()}`}
            id={provider.profile.slug}
            key={provider.profile.slug}
        >
            <>
                {isBestMatch && renderBestMatchBadge()}
                <Module padding="s" radius="xl" highlighted>
                    {loading ? (
                        <SkeletonInfoCard />
                    ) : (
                        <>
                            {/* Header informations */}
                            {isHeaderShown && (
                                <div className="ProviderInfoCard--header">
                                    {renderHeaderInfo()}
                                    {isHeaderActionShown && (
                                        <div className="ProviderInfoCard--sharing">
                                            <SaveAndShareButtons
                                                url={
                                                    profile.providerInfo
                                                        .shareableLink
                                                }
                                                providerName={name}
                                                slug={profile.slug}
                                                avatar={userInfo.avatar || ''}
                                                id={userInfo.firebaseUid}
                                                quoteType={quoteType}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {renderDefaultContent()}

                            {/* Main Call to Action */}
                            <Section spacingBottom="xs">
                                {renderMainAction()}
                            </Section>

                            {renderInsuranceInfo()}

                            {isCopyLinkShown && (
                                <Section spacingTop="xs">
                                    <CopyProviderUrlCTA
                                        slug={profile.slug}
                                        searchId={quoteId}
                                        source={source}
                                    />
                                </Section>
                            )}
                        </>
                    )}
                </Module>
            </>
        </div>
    );
};

export default ProviderInfoCard;
