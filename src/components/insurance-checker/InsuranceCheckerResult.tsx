import { Box, Grid } from '@mui/material';
import Button from 'atoms/Button/Button';
import ExpandedCard from 'atoms/Card/ExpandedCard';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { WhatIsAepsyVideoBackground } from 'components/common';
import {
    ICInsuranceDetail,
    ProviderInsuranceCheckerResultDetail,
} from 'components/insurance-checker';
import { AEPSY_WEBSITE_URL, PROVIDER_TITLE } from 'constants/common';
import { DialogMode, ModalContext } from 'context/modal';
import {
    FunnelQuoteType,
    InsuranceCheckerSource,
    InsuranceCompanyCoverageResult,
    InsuranceConditionOutputDetail,
    InsuranceCoverageConditionOutputType,
    InsuranceCoverageResultType,
    ProviderTitle,
} from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { keys } from 'lodash';
import { useContext } from 'react';
import { Trans } from 'react-i18next';
import { renderIconByType } from 'util/insuranceCheckerHelpers';
import ProviderInsuranceProviderListUnsure from './ProviderInsuranceProviderListUnsure';

interface Props {
    insuranceCompanies: any;
    source: InsuranceCheckerSource;
}

const InsuranceCheckerResult: React.FC<Props> = ({
    insuranceCompanies,
    source,
}) => {
    const { showModal, hideModal } = useContext(ModalContext);
    const { translate, getAepsyWebsiteUrlByLocale } =
        useTranslationWithContext();

    const showInsuranceDetail = (insuranceCompanyId: string) => {
        showModal(
            <ICInsuranceDetail
                providerId=""
                insuranceIdSelected={insuranceCompanyId}
                goBack={hideModal}
                selectable={false}
                providerView
            />,
            {
                mode: DialogMode.Custom,
            }
        );
    };

    const renderAssociationOutputDetail = (
        outputDetail: InsuranceConditionOutputDetail
    ) => {
        const { associationCondition } = outputDetail;
        if (
            associationCondition.outputType ===
            InsuranceCoverageConditionOutputType.Passed
        ) {
            return (
                <ProviderInsuranceCheckerResultDetail
                    output={InsuranceCoverageConditionOutputType.Passed}
                    text={translate('insurance.checker.recognized.association')}
                />
            );
        }

        return <></>;
    };

    const convertOutputDetailForProviderTitleAndLicense = (
        outputDetail: InsuranceConditionOutputDetail
    ) => {
        const { providerTitleCondition, cantonalLicenseCondition } =
            outputDetail;

        if (
            providerTitleCondition.outputType !==
                InsuranceCoverageConditionOutputType.Failed &&
            cantonalLicenseCondition.outputType !==
                InsuranceCoverageConditionOutputType.Failed
        ) {
            return {
                output: InsuranceCoverageConditionOutputType.Passed,
                text: translate('insurance.checker.recognized.title.license'),
            };
        }

        const failedText =
            providerTitleCondition.outputType ===
            InsuranceCoverageConditionOutputType.Failed
                ? translate({
                      key: 'insurance.checker.missing.provider.title',
                      context: {
                          providerTitle: translate(
                              PROVIDER_TITLE[
                                  providerTitleCondition.missingProviderTitle as ProviderTitle
                              ]
                          ),
                      },
                  })
                : translate('insurance.checker.missing.cantonal.permit');

        return {
            output: InsuranceCoverageConditionOutputType.Failed,
            text: failedText,
        };
    };

    const convertOutputDetailForZsrNumber = (
        outputDetail: InsuranceConditionOutputDetail
    ) => {
        const { zsrNumberCondition } = outputDetail;

        const text =
            zsrNumberCondition.outputType ===
            InsuranceCoverageConditionOutputType.NotChecked
                ? translate(
                      'insurance.checker.requirements.zsr.number.not.checked'
                  )
                : translate('insurance.checker.no.zrs.number');

        return {
            output: zsrNumberCondition.outputType,
            text,
        };
    };

    const convertOutputDetailForZsrNumberComplementary = (
        outputDetail: InsuranceConditionOutputDetail
    ) => {
        const { zsrNumberComplementaryCondition } = outputDetail;

        const text =
            zsrNumberComplementaryCondition.outputType ===
            InsuranceCoverageConditionOutputType.NotChecked
                ? translate(
                      'insurance.checker.requirements.zsr.number.complementary.not.checked'
                  )
                : translate('insurance.checker.no.zrs.number.complementary');

        return {
            output: zsrNumberComplementaryCondition.outputType,
            text,
        };
    };

    function renderDoctorNote(item: InsuranceCompanyCoverageResult) {
        return item.insuranceCompany.requireDoctorNote ? (
            <Text size="s">
                {translate('insurance.checker.with.doctor.note')}
            </Text>
        ) : (
            <Text size="s">
                {translate('insurance.checker.without.doctor.note')}
            </Text>
        );
    }

    return (
        <Section>
            {(keys(insuranceCompanies) as InsuranceCoverageResultType[]).map(
                (resultType: InsuranceCoverageResultType) => {
                    const list = insuranceCompanies[resultType];
                    if (list.length === 0) return <></>;
                    return (
                        <>
                            <Section
                                spacingBottom="l"
                                container={
                                    source === InsuranceCheckerSource.PublicPage
                                        ? 'short'
                                        : undefined
                                }
                            >
                                <ModuleGroup
                                    title={translate(
                                        `insurance.checker.${resultType
                                            .replace('_', '.')
                                            .toLowerCase()}.title`
                                    )}
                                >
                                    <Grid container spacing={4}>
                                        {list.map(
                                            (
                                                item: InsuranceCompanyCoverageResult
                                            ) => (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={12}
                                                    md={4}
                                                >
                                                    <ExpandedCard
                                                        padding="s"
                                                        radius="xl"
                                                        onClick={() =>
                                                            showInsuranceDetail(
                                                                item.insuranceCompanyId
                                                            )
                                                        }
                                                    >
                                                        <Box
                                                            display="flex"
                                                            flexDirection="column"
                                                            justifyContent="space-between"
                                                            sx={{
                                                                height: '100%',
                                                            }}
                                                        >
                                                            <div>
                                                                <Section spacingBottom="s">
                                                                    {renderIconByType(
                                                                        item.resultType,
                                                                        'm'
                                                                    )}
                                                                </Section>
                                                                <Title
                                                                    size="ml"
                                                                    noMargin
                                                                >
                                                                    {
                                                                        item
                                                                            .insuranceCompany
                                                                            .name
                                                                    }
                                                                </Title>
                                                                {!item.hasNoCoverage &&
                                                                    renderDoctorNote(
                                                                        item
                                                                    )}
                                                                {item.outputDetail ? (
                                                                    <Section
                                                                        spacingTop="s"
                                                                        spacingBottom="xs"
                                                                    >
                                                                        <ProviderInsuranceCheckerResultDetail
                                                                            {...convertOutputDetailForProviderTitleAndLicense(
                                                                                item.outputDetail
                                                                            )}
                                                                        />
                                                                        <ProviderInsuranceCheckerResultDetail
                                                                            {...convertOutputDetailForZsrNumber(
                                                                                item.outputDetail
                                                                            )}
                                                                        />
                                                                        <ProviderInsuranceCheckerResultDetail
                                                                            {...convertOutputDetailForZsrNumberComplementary(
                                                                                item.outputDetail
                                                                            )}
                                                                        />
                                                                        {renderAssociationOutputDetail(
                                                                            item.outputDetail
                                                                        )}
                                                                    </Section>
                                                                ) : (
                                                                    <Text size="s">
                                                                        {translate(
                                                                            'insurance.checker.no.output.detail'
                                                                        )}
                                                                    </Text>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <Button
                                                                    variant="inline"
                                                                    label={translate(
                                                                        'generic.show.detail'
                                                                    )}
                                                                    size="xs"
                                                                />
                                                                <ProviderInsuranceProviderListUnsure
                                                                    result={
                                                                        item
                                                                    }
                                                                />
                                                            </div>
                                                        </Box>
                                                    </ExpandedCard>
                                                </Grid>
                                            )
                                        )}
                                    </Grid>
                                </ModuleGroup>
                            </Section>
                            {source === InsuranceCheckerSource.PublicPage &&
                            resultType ===
                                InsuranceCoverageResultType.Covered ? (
                                <Section spacing="l" container="large">
                                    <WhatIsAepsyVideoBackground
                                        title={
                                            <Trans
                                                i18nKey={
                                                    'what.is.aepsy.video.background.title'
                                                }
                                                components={{ br: <br /> }}
                                            />
                                        }
                                        subtitle={translate(
                                            'what.is.aepsy.video.background.subtitle'
                                        )}
                                        callToActionLabel={translate(
                                            'generic.learn.more.about.aepsy'
                                        )}
                                        callToActionUrl={getAepsyWebsiteUrlByLocale(
                                            AEPSY_WEBSITE_URL.ForTherapists
                                        )}
                                    />
                                </Section>
                            ) : (
                                <></>
                            )}
                        </>
                    );
                }
            )}
        </Section>
    );
};

export default InsuranceCheckerResult;
