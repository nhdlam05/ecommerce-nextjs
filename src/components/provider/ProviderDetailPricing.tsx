import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import Text from 'atoms/Text/Text';
import { NoCoverPackage } from 'components/insurance-checker';
import { getDurationFromDurationType } from 'constants/common';
import {
    ChapterType,
    FunnelQuoteType,
    InsuranceCompany,
    InsuranceCoverageResultType,
    InsurancePackage,
    ProviderPricing,
} from 'generated/graphql';
import { CHECK_PROVIDER_INSURANCE_COVERAGE } from 'gql/insurance';
import { useTranslationWithContext } from 'hooks';
import { first, get } from 'lodash';
import { useMemo } from 'react';
import { useQueryStringKey } from 'use-route-as-state';
import {
    getSinglePackageMaxAmount,
    getPackageDiscountWithPrice,
} from 'util/insuranceCheckerHelpers';

interface Props {
    providerId: string;
    pricing: ProviderPricing[];
    selectedCoverage?: InsurancePackage | NoCoverPackage;
    selectedInsuranceCompany?: InsuranceCompany;
    canShowInsuranceInfo: boolean;
    quoteType: FunnelQuoteType;
    isLast: boolean;
    chapterType: ChapterType;
}

const ProviderDetailPricing: React.FC<Props> = ({
    providerId,
    canShowInsuranceInfo,
    pricing,
    selectedCoverage,
    quoteType,
    isLast,
    chapterType,
}) => {
    const { translate } = useTranslationWithContext();
    const [insuranceCompanyId] = useQueryStringKey('insuranceCompanyId');

    const { data: checkProviderInsuranceCoverageRes } = useQuery(
        CHECK_PROVIDER_INSURANCE_COVERAGE,
        {
            skip: !canShowInsuranceInfo || !insuranceCompanyId,
            variables: {
                input: {
                    providerId,
                    insuranceCompanyIds: [insuranceCompanyId],
                    quoteType:
                        chapterType === ChapterType.Individual
                            ? quoteType
                            : null,
                    chapterType,
                },
            },
        }
    );

    const isCovered = useMemo(() => {
        if (checkProviderInsuranceCoverageRes) {
            const {
                checkProviderInsuranceCoverage: { results },
            } = checkProviderInsuranceCoverageRes;
            const resultType = get(first(results), 'resultType');
            return resultType === InsuranceCoverageResultType.Covered;
        }
        return false;
    }, [checkProviderInsuranceCoverageRes, insuranceCompanyId]);

    const maxAmount = useMemo(() => {
        if (!selectedCoverage) return 0;
        return getSinglePackageMaxAmount({
            coverage: selectedCoverage,
            quoteType,
            chapterType,
        });
    }, [selectedCoverage, chapterType, quoteType]);

    return (
        <>
            {pricing.map((p: ProviderPricing) => {
                const { discountAmount, isFree } = isCovered
                    ? getPackageDiscountWithPrice({
                          price: p.price,
                          insurancePackage: selectedCoverage,
                          quoteType,
                          chapterType,
                      })
                    : {
                          discountAmount: 0,
                          isFree: 0,
                      };
                return (
                    <div
                        className="ProviderDetailPricingAndInsurance--pricingItem"
                        key={p.id}
                    >
                        <Text size="m">{`${getDurationFromDurationType(
                            p.durationType
                        )}min`}</Text>
                        <div className="ProviderDetailPricingAndInsurance--pricingWrapper">
                            {discountAmount && canShowInsuranceInfo ? (
                                <Box sx={{ mr: 1 }}>
                                    <Text theme="purple" size="m">
                                        <strong>
                                            *{discountAmount}
                                            CHF
                                        </strong>
                                    </Text>
                                </Box>
                            ) : (
                                <></>
                            )}
                            <Text
                                size="m"
                                className={
                                    canShowInsuranceInfo && isFree
                                        ? 'strikethrough'
                                        : ''
                                }
                            >
                                {p.price}CHF
                            </Text>
                        </div>
                    </div>
                );
            })}

            {canShowInsuranceInfo && maxAmount && isCovered && isLast ? (
                <Text theme="purple" size="s">
                    <strong>
                        {translate({
                            key: 'providerContent.generic.insurance.note',
                            context: {
                                amount: maxAmount,
                            },
                        })}
                    </strong>
                </Text>
            ) : (
                <></>
            )}
        </>
    );
};

export default ProviderDetailPricing;
