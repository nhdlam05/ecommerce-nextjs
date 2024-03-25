import { useQuery } from '@apollo/client';
import Button from 'atoms/Button/Button';
import Callout from 'atoms/Callout';
import { DialogContent, DialogFooter, DialogFullHeader } from 'atoms/Dialog';
import Divider from 'atoms/Divider/Divider';
import Icon, { IconQuestionCircle } from 'atoms/Icon';
import Loader from 'atoms/Loader/Loader';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import {
    ChapterType,
    FunnelQuoteType,
    InsuranceCoverageResultType,
    InsurancePackage,
} from 'generated/graphql';
import {
    CHECK_PROVIDER_INSURANCE_COVERAGE,
    GET_INSURANCE_COMPANY,
} from 'gql/insurance';
import { useTranslationWithContext } from 'hooks';
import { first, get } from 'lodash';
import { useState } from 'react';
import { Trans } from 'react-i18next';
import ContactInfo from './ContactInfo';
import CoverageList from './CoverageList';
import DoctorNote from './DoctorNote';
import RequirementsInfo from './RequirementsInfo';
import {
    getPackageMaxAmount,
    getPackageRequireDoctorNote,
} from 'util/insuranceCheckerHelpers';

export type NoCoverPackage = {
    id: null;
};

interface Props {
    insuranceIdSelected?: string | null;
    insuranceSelected?: any | null;
    goBack?: VoidFunction;
    selectable?: boolean;
    onSubmit?: (selectedValue?: InsurancePackage | NoCoverPackage) => void;
    onReset?: VoidFunction;
    defaultValue?: InsurancePackage | NoCoverPackage;
    providerId?: string;
    quoteType?: FunnelQuoteType;
    providerView: boolean;
    forceFullInfoShown?: boolean;
    chapterType?: ChapterType;
}

const ICInsuranceDetail: React.FC<Props> = ({
    insuranceIdSelected,
    insuranceSelected,
    goBack,
    selectable = true,
    onSubmit,
    onReset,
    defaultValue,
    providerId,
    quoteType,
    providerView,
    forceFullInfoShown = false,
    chapterType,
}) => {
    const [selectedValue, setSelectedValue] = useState<
        InsurancePackage | NoCoverPackage | undefined
    >(defaultValue);

    const { data } = useQuery(GET_INSURANCE_COMPANY, {
        variables: {
            input: {
                id: insuranceIdSelected,
            },
        },
        skip: !insuranceIdSelected,
    });
    const noNeedCheckInsuranceCoverage = !insuranceIdSelected || !providerId;
    const { data: checkProviderInsuranceCoverageRes } = useQuery(
        CHECK_PROVIDER_INSURANCE_COVERAGE,
        {
            skip: noNeedCheckInsuranceCoverage,
            variables: {
                input: {
                    providerId,
                    insuranceCompanyIds: [insuranceIdSelected],
                    quoteType:
                        chapterType === ChapterType.Individual
                            ? quoteType
                            : null,
                    chapterType,
                },
            },
        }
    );

    const { translate } = useTranslationWithContext();

    const handleReset = () => {
        setSelectedValue(undefined);
        onReset && onReset();
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(
                selectedValue
                    ? selectedValue
                    : {
                          id: null,
                      }
            );
        }
    };

    function renderCompanyText(clientNumber: number, maxAmount: number) {
        if (!maxAmount && !clientNumber) {
            return null;
        }

        if (clientNumber) {
            return translate({
                key: 'insurance.checker.max.amount.and.client.number.info',
                context: {
                    maxAmount,
                    clientNumber: clientNumber.toLocaleString(),
                },
            });
        }

        return translate({
            key: 'insurance.checker.max.amount.info',
            context: {
                maxAmount,
            },
        });
    }

    const renderFullContent = (insuranceSelected: any) => {
        const {
            packages,
            specialNote,
            supportPageUrl,
            companyPhoneNumber,
            callServiceHours,
            name,
            supportEmail,
            clientInfo: { clientNumber },
            coverageCriteria,
        } = insuranceSelected;
        const maxAmount = getPackageMaxAmount({
            packages,
            chapterType,
        });
        const requireDoctorNoteStatus = getPackageRequireDoctorNote({
            packages,
            quoteType,
            chapterType,
        });

        return (
            <>
                {maxAmount && providerView ? (
                    <Section spacingTop="s">
                        <Title size="ml" noMargin>
                            {name}
                        </Title>
                        {maxAmount && (
                            <Text size="m">
                                {renderCompanyText(clientNumber, maxAmount)}
                            </Text>
                        )}
                    </Section>
                ) : (
                    <></>
                )}
                <Divider invisible spacing="xs" />
                <Section spacingBottom="s">
                    <CoverageList
                        forceFullInfoShown={forceFullInfoShown}
                        quoteType={quoteType}
                        packages={packages}
                        selectable={selectable}
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                        chapterType={chapterType}
                    />
                </Section>

                {providerView && (
                    <>
                        <Divider spacing="m" />
                        <RequirementsInfo coverageCriteria={coverageCriteria} />
                    </>
                )}

                {specialNote && (
                    <>
                        <Divider spacing="m" />
                        <Title size="m">{translate('generic.more.info')}</Title>
                        <Text tag="div" size="s">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: specialNote,
                                }}
                            ></div>
                        </Text>
                    </>
                )}

                <Divider spacing="m" />
                <DoctorNote requireDoctorNoteStatus={requireDoctorNoteStatus} />

                {providerView ? (
                    <>
                        <Divider spacing="m" />
                        <Title size="m">
                            <Trans
                                i18nKey="insurance.checker.new.info.to.share"
                                components={{
                                    strong: <strong />,
                                    a: <a href="mailto:hey@aepsy.com" />,
                                }}
                            />
                        </Title>
                    </>
                ) : (
                    <>
                        <Divider spacing="m" />

                        <ContactInfo
                            companyPhoneNumber={companyPhoneNumber}
                            supportPageUrl={supportPageUrl}
                            callServiceHours={callServiceHours}
                            supportEmail={supportEmail}
                        />
                        <Divider spacing="m" />
                        <Text size="xxs">
                            <Trans
                                i18nKey="provider.insurance.checker.detail"
                                components={{
                                    strong: <strong />,
                                }}
                            />
                        </Text>
                    </>
                )}
            </>
        );
    };

    const renderNoCoverContent = (insuranceSelected: any) => {
        if (!checkProviderInsuranceCoverageRes) return <></>;

        const {
            specialNote,
            supportPageUrl,
            companyPhoneNumber,
            callServiceHours,
            supportEmail,
        } = insuranceSelected;
        const {
            checkProviderInsuranceCoverage: { results },
        } = checkProviderInsuranceCoverageRes;
        const resultType = get(first(results), 'resultType');

        return (
            <>
                <Section spacing="s">
                    {resultType === InsuranceCoverageResultType.Unsure ? (
                        <Callout
                            icon={
                                <Icon
                                    theme="warning"
                                    size="s"
                                    icon={<IconQuestionCircle />}
                                />
                            }
                            iconSize="l"
                            title={translate(
                                'provider.insurance.detial.unsure.warning.title'
                            )}
                            text={translate(
                                'provider.insurance.detial.unsure.warning.subtitle'
                            )}
                        />
                    ) : (
                        <Callout
                            icon="😕"
                            iconSize="l"
                            title={translate(
                                'provider.insurance.detial.no.cover.warning.title'
                            )}
                            text={translate(
                                'provider.insurance.detial.no.cover.warning.subtitle'
                            )}
                        />
                    )}
                </Section>

                {specialNote && (
                    <Section spacingTop="s">
                        <Title size="m">{translate('generic.more.info')}</Title>
                        <Text tag="div" size="s">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: specialNote,
                                }}
                            ></div>
                        </Text>
                    </Section>
                )}

                <Divider spacing="m" />

                <ContactInfo
                    companyPhoneNumber={companyPhoneNumber}
                    supportPageUrl={supportPageUrl}
                    callServiceHours={callServiceHours}
                    supportEmail={supportEmail}
                />
            </>
        );
    };

    const checkNoCoverage = () => {
        if (checkProviderInsuranceCoverageRes) {
            const {
                checkProviderInsuranceCoverage: { results },
            } = checkProviderInsuranceCoverageRes;
            return (
                get(first(results), 'resultType') !==
                InsuranceCoverageResultType.Covered
            );
        }
        return false;
    };

    const renderInsuranceSelected = (insuranceSelected: any) => {
        const { name } = insuranceSelected;

        const noCoverage = checkNoCoverage();

        return (
            <>
                {goBack && (
                    <DialogFullHeader
                        title={
                            name ||
                            translate('provider.insurance.checker.header.title')
                        }
                        onCloseButtonClick={goBack}
                    />
                )}

                <DialogContent hasFooter>
                    {noNeedCheckInsuranceCoverage ||
                    checkProviderInsuranceCoverageRes ? (
                        <Section spacingBottom="l">
                            {!noCoverage || providerView
                                ? renderFullContent(insuranceSelected)
                                : renderNoCoverContent(insuranceSelected)}
                        </Section>
                    ) : (
                        <Loader />
                    )}
                </DialogContent>
                {selectable ? (
                    <DialogFooter>
                        <div>
                            <Button
                                label={translate(
                                    'insurance.checker.button.select'
                                )}
                                onClick={handleSubmit}
                                disabled={!selectedValue && !noCoverage}
                            />
                        </div>
                        {onReset && (
                            <Button
                                variant="naked"
                                label={translate(
                                    'insurance.checker.button.reset'
                                )}
                                onClick={handleReset}
                            />
                        )}
                    </DialogFooter>
                ) : (
                    <DialogFooter>
                        <Button
                            label={translate('generic.go.back')}
                            onClick={goBack}
                        />
                    </DialogFooter>
                )}
            </>
        );
    };

    if (insuranceSelected) {
        return renderInsuranceSelected(insuranceSelected);
    }

    if (insuranceIdSelected) {
        if (data) {
            const { insuranceCompany } = data;
            return renderInsuranceSelected(insuranceCompany);
        }
        return (
            <DialogContent>
                <Loader />
            </DialogContent>
        );
    }

    return (
        <DialogContent>
            <Loader />
        </DialogContent>
    );
};

export default ICInsuranceDetail;
