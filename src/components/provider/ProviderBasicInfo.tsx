import Button from 'atoms/Button/Button';
import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import Table from 'atoms/Table/Table';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { VISIBILITY_TRACKER_OPTION } from 'constants/common';
import {
    AnalyticsEventType,
    FunnelQuoteType,
    Provider,
    ProviderExperienceType,
} from 'generated/graphql';
import { useTracking, useTranslationWithContext } from 'hooks';
import ProviderProfileWorkAndEducationItem from 'pages/ProviderPage/components/ProviderProfile/parts/ProviderProfileWorkAndEducation/ProviderProfileWorkAndEducationItem';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link, useHistory } from 'react-router-dom';
import { logFirebaseEvent } from 'service/auth';
import ProviderDetailAbout from './ProviderDetailAbout';
import ProviderDetailCertificate from './ProviderDetailCertificate';
import ProviderDetailClientType from './ProviderDetailClientType';
import ProviderDetailLanguage from './ProviderDetailLanguage';
import ProviderDetailLocation from './ProviderDetailLocation';
import ProviderDetailMethods from './ProviderDetailMethods';
import PersonWithCalculatorVisual from 'assets/img/person-with-calculator-visual.png';
import Image from 'atoms/Image/Image';
import { isNoCovered } from 'util/insuranceCheckerHelpers';
import ProviderDetailPricingAndInsurance from './ProviderDetailPricingAndInsurance';

type ProviderBasicInfoConfig = {
    budgetingToolNudge: boolean;
    pricingAndInsurance: boolean;
};

const PROVIDER_BASIC_INFO_CONFIG: ProviderBasicInfoConfig = {
    budgetingToolNudge: true,
    pricingAndInsurance: true,
};

interface Props {
    provider: Provider;
    quoteType: FunnelQuoteType;
    apySrc?: string;
    variant?: 'modal' | null;
    config?: ProviderBasicInfoConfig;
}

const ProviderBasicInfo: React.FC<Props> = ({
    provider,
    quoteType,
    apySrc,
    variant,
    config = {},
}) => {
    const { track } = useTracking();
    const {
        location: { search, pathname },
    } = useHistory();

    const providerBasicInfoConfig = {
        ...PROVIDER_BASIC_INFO_CONFIG,
        ...config,
    };
    const { profile, insuranceCoverageInfo } = provider;
    const { providerInfo } = profile;
    const { translate } = useTranslationWithContext();
    const [aboutViewRef, aboutInView] = useInView(VISIBILITY_TRACKER_OPTION);
    const [expertiseViewRef, expertiseInView] = useInView(
        VISIBILITY_TRACKER_OPTION
    );
    const [priceViewRef, priceInView] = useInView(VISIBILITY_TRACKER_OPTION);
    const [experienceViewRef, experienceInView] = useInView(
        VISIBILITY_TRACKER_OPTION
    );
    const [certificateViewRef, certificateInView] = useInView(
        VISIBILITY_TRACKER_OPTION
    );
    const [locationViewRef, locationInView] = useInView(
        VISIBILITY_TRACKER_OPTION
    );

    function renderAbout() {
        return (
            <div ref={aboutViewRef}>
                <ProviderDetailAbout
                    anchorId="about"
                    title={translate('providerContent.about.title')}
                    content={providerInfo}
                    quoteType={quoteType}
                    variant={variant}
                />
            </div>
        );
    }

    const getBudgetingToolUrl = () => {
        const queries = search
            .split('&')
            .filter(
                (item: string) =>
                    !item.includes('influences') &&
                    !item.includes('disorders') &&
                    !item.includes('symptoms') &&
                    !item.includes('isDiagnosis')
            );
        return `/tools/budgeting?providerId=${
            provider.userInfo.firebaseUid
        }&redirect=${pathname}${queries.join('--')}`;
    };

    function renderBudgetingToolNudge() {
        return (
            <Section spacing="xs">
                <Module>
                    <Image
                        align="center"
                        size="xs"
                        src={PersonWithCalculatorVisual}
                    />
                    <Title size="ml" align="center">
                        {translate('budgeting.tool.nudge.title')}
                    </Title>
                    <Text size="xs" align="center">
                        {translate('budgeting.tool.nudge.subtitle')}
                    </Text>
                    <Section spacingTop="xs">
                        <Link to={getBudgetingToolUrl}>
                            <Button
                                size="l"
                                theme="pink-gradient"
                                align="center"
                                label={translate('budgeting.tool.nudget.cta')}
                            />
                        </Link>
                    </Section>
                </Module>
            </Section>
        );
    }

    function renderWorkAndEducation() {
        if (!provider.experience?.items.length) return <></>;
        const items = provider.experience?.items
            ? provider.experience?.items
            : [];
        const { educationList, workList } = items.reduce(
            (acc: any, cur: any) => {
                if (cur.type === ProviderExperienceType.Work) {
                    return {
                        ...acc,
                        workList: [...acc.workList, cur],
                    };
                }
                return {
                    ...acc,
                    educationList: [...acc.educationList, cur],
                };
            },

            { educationList: [], workList: [] }
        );

        return (
            <div ref={experienceViewRef}>
                {workList.length > 0 && (
                    <div id="workExperience">
                        <Section spacing="m">
                            <ModuleGroup
                                title={translate('providerContent.work.title')}
                            >
                                <Module
                                    padding={variant === 'modal' ? 's' : 'm'}
                                    variant={variant}
                                >
                                    <Table>
                                        {workList.map((element: any) => (
                                            <ProviderProfileWorkAndEducationItem
                                                key={element.id}
                                                item={element}
                                            />
                                        ))}
                                    </Table>
                                </Module>
                            </ModuleGroup>
                        </Section>
                    </div>
                )}
                {educationList.length > 0 && (
                    <div id="educationExperience">
                        <Section spacingTop="s" spacingBottom="m">
                            <ModuleGroup
                                title={translate(
                                    'providerContent.education.title'
                                )}
                            >
                                <Module
                                    padding={variant === 'modal' ? 's' : 'm'}
                                    variant={variant}
                                >
                                    <Table>
                                        {educationList.map((element: any) => (
                                            <ProviderProfileWorkAndEducationItem
                                                key={element.id}
                                                item={element}
                                            />
                                        ))}
                                    </Table>
                                </Module>
                            </ModuleGroup>
                        </Section>
                    </div>
                )}
            </div>
        );
    }

    function renderCertificate() {
        if (
            profile?.providerInfo?.certificateItems &&
            profile?.providerInfo?.certificateItems.length > 0
        ) {
            return (
                <div ref={certificateViewRef}>
                    <ProviderDetailCertificate
                        variant={variant}
                        anchorId="certificate"
                        title={translate('providerContent.certificate.title')}
                        items={profile.providerInfo.certificateItems}
                    />
                </div>
            );
        }

        return null;
    }

    function renderLocation() {
        return (
            <div ref={locationViewRef}>
                <Section spacingBottom="l">
                    <ProviderDetailLocation
                        variant={variant}
                        anchorId="location"
                        title={translate('providerContent.location.title')}
                        locations={profile.locationInfo.locations}
                        offersOnlineSession={
                            profile.locationInfo.onlineSessionOffered
                        }
                        quoteType={quoteType}
                    />
                </Section>
            </div>
        );
    }

    function renderLanguage() {
        const { languageInfo } = profile;

        if (
            !languageInfo ||
            !languageInfo.supportedLanguages ||
            languageInfo.supportedLanguages.length === 0
        ) {
            return null;
        }

        return (
            <ProviderDetailLanguage
                variant={variant}
                anchorId="language"
                title={translate('providerContent.language.title')}
                items={languageInfo.supportedLanguages}
                extraText={languageInfo.extraText}
            />
        );
    }

    function renderClientTypes() {
        const { clientTypes } = providerInfo;

        return (
            <ProviderDetailClientType
                variant={variant}
                anchorId="clients"
                title={translate('providerContent.clientTypes.title')}
                items={clientTypes || []}
            />
        );
    }

    const renderPricingAndInsurance = () => {
        const noCovered = isNoCovered({
            hasZsrNumber: insuranceCoverageInfo.hasZsrNumber,
            hasInsuranceNotCoveredSpecialReason:
                insuranceCoverageInfo.hasInsuranceNotCoveredSpecialReason,
        });
        return (
            <div ref={priceViewRef}>
                <ProviderDetailPricingAndInsurance
                    anchorId="fees"
                    quoteTypes={provider.profile.quoteTypes}
                    chapterPricing={provider.chapterPricing}
                    applicationStates={provider.chapterInfo.applicationStates}
                    providerId={provider.userInfo.firebaseUid}
                    noCovered={noCovered}
                />
            </div>
        );
    };

    useEffect(() => {
        const payload = {
            providerId: provider.userInfo.firebaseUid,
            providerSlug: provider.profile.slug,
            source: apySrc,
        };

        if (aboutInView) {
            track({
                eventType: AnalyticsEventType.ImpressionEvent,
                eventName: 'impression:about',
                data: payload,
            });
        }

        if (priceInView) {
            track({
                eventType: AnalyticsEventType.ImpressionEvent,
                eventName: 'impression:price',
                data: payload,
            });
        }

        if (experienceInView) {
            track({
                eventType: AnalyticsEventType.ImpressionEvent,
                eventName: 'impression:experience',
                data: payload,
            });
        }

        if (certificateInView) {
            track({
                eventType: AnalyticsEventType.ImpressionEvent,
                eventName: 'impression:certificate',
                data: payload,
            });
        }

        if (expertiseInView) {
            track({
                eventType: AnalyticsEventType.ImpressionEvent,
                eventName: 'impression:expertise',
                data: payload,
            });
        }

        if (locationInView) {
            track({
                eventType: AnalyticsEventType.ImpressionEvent,
                eventName: 'impression:location',
                data: payload,
            });
        }
    }, [
        aboutInView,
        experienceInView,
        priceInView,
        expertiseInView,
        certificateInView,
        locationInView,
    ]);

    return (
        <>
            {/* About - Special Quote */}
            {renderAbout()}

            {/* Skills */}
            <div ref={expertiseViewRef}>
                <ProviderDetailMethods variant={variant} provider={provider} />
            </div>

            {providerBasicInfoConfig.pricingAndInsurance &&
                renderPricingAndInsurance()}

            {providerBasicInfoConfig.budgetingToolNudge &&
                renderBudgetingToolNudge()}

            {/* Work and Education */}
            {renderWorkAndEducation()}

            {/* Certificate */}
            {renderCertificate()}

            {renderLanguage()}
            {renderClientTypes()}
            {renderLocation()}
        </>
    );
};

export default ProviderBasicInfo;
