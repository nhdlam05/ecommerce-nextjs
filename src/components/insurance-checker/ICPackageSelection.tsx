import { useQuery } from '@apollo/client';
import Callout from 'atoms/Callout';
import Icon, { IconQuestionCircle } from 'atoms/Icon';
import Loader from 'atoms/Loader/Loader';
import Section from 'atoms/Section/Section';
import {
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
import CoverageList from './CoverageList';
import Title from 'atoms/Title/Title';
import Text from 'atoms/Text/Text';
import { Trans } from 'react-i18next';

export type NoCoverPackage = {
    id: null;
};

interface Props {
    insuranceIdSelected?: string | null;
    selectable?: boolean;
    selectedValue?: InsurancePackage | NoCoverPackage;
    setSelectedValue: (
        selectedValue?: InsurancePackage | NoCoverPackage
    ) => void;
    providerId?: string;
    defaultValue?: string;
    quoteType?: FunnelQuoteType;
}

const ICPackageSelection: React.FC<Props> = ({
    insuranceIdSelected,
    selectable = true,
    selectedValue,
    setSelectedValue,
    providerId,
    defaultValue,
    quoteType,
}) => {
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
                },
            },
        }
    );

    const { translate } = useTranslationWithContext();

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
            name,
            clientInfo: { clientNumber },
        } = insuranceSelected;
        const packagesSortedByMaxAmount = packages
            .map((item: any) => item.maxAmount)
            .sort((a: any, b: any) => b - a);
        const maxAmount = packagesSortedByMaxAmount[0];

        return (
            <>
                <Section spacing="s">
                    <Title size="ml" noMargin>
                        {name}
                    </Title>
                    <Text size="m">
                        {renderCompanyText(clientNumber, maxAmount)}
                    </Text>
                </Section>
                <CoverageList
                    quoteType={quoteType}
                    defaultValue={defaultValue}
                    packages={packages}
                    selectable={selectable}
                    selectedValue={selectedValue}
                    setSelectedValue={setSelectedValue}
                />
            </>
        );
    };

    const renderNoCoverContent = () => {
        if (!checkProviderInsuranceCoverageRes) return <></>;

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
        const noCoverage = checkNoCoverage();

        return (
            <>
                {!noCoverage
                    ? renderFullContent(insuranceSelected)
                    : renderNoCoverContent()}

                <Section spacingTop="s">
                    <Text size="s" align="center">
                        <Trans i18nKey="secondary.insurance.package.selection.important.note">
                            <strong />
                        </Trans>
                    </Text>
                </Section>
            </>
        );
    };

    if (insuranceIdSelected) {
        if (data) {
            const { insuranceCompany } = data;
            return renderInsuranceSelected(insuranceCompany);
        }
        return <Loader />;
    }

    return <Loader />;
};

export default ICPackageSelection;
