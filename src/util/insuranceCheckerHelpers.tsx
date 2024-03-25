import i18n from 'i18next';
import Icon, {
    IconCheckCircle,
    IconCloseCirle,
    IconQuestionCircle,
} from 'atoms/Icon';
import { INSURANCE_CHECKER_RESULT } from 'constants/common';
import {
    ChapterType,
    DiscountInfo,
    DiscountType,
    FunnelQuoteType,
    FunnelQuoteTypeDiscountInfo,
    InsuranceCoverageResultType,
    InsurancePackage,
    Maybe,
} from 'generated/graphql';
import { compact, first, flatten, isEmpty } from 'lodash';
import { NoCoverPackage } from 'components/insurance-checker';
import Badge from 'atoms/Badge/Badge';

export const convertResultsToList = (results: any[]) =>
    results.reduce((acc: any, cur: any) => {
        const { resultType } = cur;
        return {
            ...acc,
            [resultType]: [...acc[resultType], cur],
        };
    }, INSURANCE_CHECKER_RESULT);

export const renderBadgeByType = (type: InsuranceCoverageResultType) => {
    switch (type) {
        case InsuranceCoverageResultType.Covered:
            return (
                <Badge
                    variant="success"
                    label={i18n.t('insurance.checker.covered.title') as string}
                />
            );
        case InsuranceCoverageResultType.Unsure:
            return (
                <Badge
                    variant="warning"
                    label={i18n.t('insurance.checker.unsure.title') as string}
                />
            );
        case InsuranceCoverageResultType.NotCovered:
        default:
            return (
                <Badge
                    variant="error"
                    label={
                        i18n.t('insurance.checker.not.covered.title') as string
                    }
                />
            );
    }
};

export const renderIconByType = (
    type: InsuranceCoverageResultType,
    iconSize: 'm' | 'xxs'
) => {
    switch (type) {
        case InsuranceCoverageResultType.Covered:
            return (
                <Icon
                    theme="success"
                    size={iconSize}
                    icon={<IconCheckCircle />}
                />
            );
        case InsuranceCoverageResultType.Unsure:
            return (
                <Icon
                    theme="warning"
                    size={iconSize}
                    icon={<IconQuestionCircle />}
                />
            );
        case InsuranceCoverageResultType.NotCovered:
        default:
            return (
                <Icon
                    theme="highlighted"
                    size={iconSize}
                    icon={<IconCloseCirle />}
                />
            );
    }
};

export const isNoCovered = ({
    hasInsuranceNotCoveredSpecialReason,
    hasZsrNumber,
    otherReason,
}: {
    hasInsuranceNotCoveredSpecialReason: boolean | null;
    hasZsrNumber: boolean | null;
    otherReason?: boolean | null;
}): boolean =>
    Boolean(hasZsrNumber) ||
    Boolean(hasInsuranceNotCoveredSpecialReason) ||
    Boolean(otherReason);

export const getPackageMaxAmount = ({
    packages,
    chapterType,
}: {
    packages?: Maybe<InsurancePackage[]>;
    chapterType?: ChapterType;
}): number => {
    if (!packages) return 0;
    const packagesSortedByMaxAmount = compact(
        flatten(
            packages.map((item: InsurancePackage) => {
                const {
                    discountInfo,
                    individualDiscountInfo,
                    coupleDiscountInfo,
                } = item;
                if (chapterType === ChapterType.Couple) {
                    return coupleDiscountInfo
                        ? coupleDiscountInfo.maxAmount
                        : 0;
                }
                if (individualDiscountInfo) {
                    return individualDiscountInfo?.map(
                        (item: FunnelQuoteTypeDiscountInfo) =>
                            item.discountInfo.maxAmount
                    );
                }

                return discountInfo?.maxAmount;
            })
        )
    );

    if (isEmpty(packagesSortedByMaxAmount)) return 0;
    const maxAmount = first(
        packagesSortedByMaxAmount.sort(
            (a?: Maybe<number>, b?: Maybe<number>) => {
                if (!a || !b) return -1;
                return b - a;
            }
        )
    );
    return maxAmount ? maxAmount : 0;
};

export const getFunnelQuoteTypeDiscountInfoMaxAmount = ({
    packages,
    quoteType,
}: {
    packages?: Maybe<FunnelQuoteTypeDiscountInfo[]>;
    quoteType?: FunnelQuoteType;
}) => {
    if (!packages) return 0;
    const filteredList = quoteType
        ? packages.filter(
              (item: FunnelQuoteTypeDiscountInfo) =>
                  item.quoteType === quoteType
          )
        : packages;
    const packagesSortedByMaxAmount = filteredList
        .map((item: FunnelQuoteTypeDiscountInfo) => item.discountInfo.maxAmount)
        .sort((a?: Maybe<number>, b?: Maybe<number>) => {
            if (!a || !b) return -1;
            return b - a;
        });
    return packagesSortedByMaxAmount[0];
};

export const getSinglePackageMaxAmount = ({
    coverage,
    quoteType,
    chapterType,
}: {
    coverage: InsurancePackage | NoCoverPackage;
    quoteType?: FunnelQuoteType;
    chapterType?: ChapterType;
}) => {
    if (!coverage || !coverage?.id) return 0;
    const { discountInfo, individualDiscountInfo, coupleDiscountInfo } =
        coverage;

    if (chapterType === ChapterType.Couple) {
        return coupleDiscountInfo ? coupleDiscountInfo.maxAmount : 0;
    }

    if (individualDiscountInfo) {
        return getFunnelQuoteTypeDiscountInfoMaxAmount({
            packages: individualDiscountInfo,
            quoteType,
        });
    }

    return discountInfo?.maxAmount;
};

export const getPackageDescriptionByQuoteType = ({
    coverage,
    quoteType,
}: {
    coverage: InsurancePackage;
    quoteType?: FunnelQuoteType;
}) => {
    if (!coverage.individualDiscountInfo) return i18n.t('generic.no.coverage');
    if (quoteType) {
        const foundQuoteType = coverage.individualDiscountInfo.find(
            (item: FunnelQuoteTypeDiscountInfo) => item.quoteType === quoteType
        );
        if (!foundQuoteType) return '';
        return isEmpty(foundQuoteType.discountInfo.description)
            ? i18n.t('generic.no.coverage')
            : foundQuoteType.discountInfo.description;
    }
};

export const getPackageDescription = ({
    coverage,
    quoteType,
    chapterType,
}: {
    coverage: InsurancePackage | NoCoverPackage;
    quoteType?: FunnelQuoteType;
    chapterType?: ChapterType;
}) => {
    if (!coverage.id) return i18n.t('generic.no.coverage');
    const { discountInfo, individualDiscountInfo, coupleDiscountInfo } =
        coverage;

    if (chapterType === ChapterType.Couple) {
        return coupleDiscountInfo
            ? coupleDiscountInfo.description
            : i18n.t('generic.no.coverage');
    }

    if (discountInfo) {
        return discountInfo.description;
    }

    if (individualDiscountInfo) {
        if (quoteType) {
            return getPackageDescriptionByQuoteType({
                coverage,
                quoteType,
            });
        }
        return i18n.t('insurance.checker.mutliple.coverage.generic.text', {
            maxAmount: getFunnelQuoteTypeDiscountInfoMaxAmount({
                packages: individualDiscountInfo,
            }),
        });
    }

    return '';
};

export const getSingleDiscountPrice = ({
    discountInfo,
    price,
}: {
    discountInfo: DiscountInfo;
    price: number;
}): { isFree: boolean; discountAmount: number } => {
    const { value, discountType } = discountInfo;

    if (!value || value === 0) {
        return {
            isFree: false,
            discountAmount: 0,
        };
    }

    if (discountType === DiscountType.Amount)
        return value >= price
            ? {
                  isFree: true,
                  discountAmount: 0,
              }
            : {
                  isFree: false,
                  discountAmount: price - value,
              };
    if (discountType === DiscountType.Percentage) {
        const discount = price - Math.round((value * price) / 100);
        return {
            isFree: discount === 0,
            discountAmount: discount,
        };
    }

    return {
        isFree: false,
        discountAmount: 0,
    };
};

export const getPackageDiscountWithPrice = ({
    price,
    insurancePackage,
    quoteType,
    chapterType,
}: {
    price: number;
    insurancePackage?: InsurancePackage | NoCoverPackage;
    quoteType?: FunnelQuoteType;
    chapterType?: ChapterType;
}): { isFree: boolean; discountAmount: number } => {
    if (!insurancePackage || !insurancePackage?.id) {
        return {
            isFree: false,
            discountAmount: 0,
        };
    }

    const { discountInfo, individualDiscountInfo, coupleDiscountInfo } =
        insurancePackage;

    if (chapterType === ChapterType.Couple) {
        return coupleDiscountInfo
            ? getSingleDiscountPrice({
                  price,
                  discountInfo: coupleDiscountInfo,
              })
            : {
                  isFree: false,
                  discountAmount: 0,
              };
    }

    if (discountInfo) {
        return getSingleDiscountPrice({
            price,
            discountInfo,
        });
    }

    if (individualDiscountInfo) {
        if (quoteType) {
            const foundItemByQuoteType = individualDiscountInfo.find(
                (item: FunnelQuoteTypeDiscountInfo) =>
                    item.quoteType === quoteType
            );
            if (foundItemByQuoteType) {
                return getSingleDiscountPrice({
                    price,
                    discountInfo: foundItemByQuoteType.discountInfo,
                });
            }
        }
        const allDiscountInfo = individualDiscountInfo.map(
            (item: FunnelQuoteTypeDiscountInfo) => item.discountInfo
        );
        const discountInfoHavingValue = allDiscountInfo.find(
            (item: DiscountInfo) => item.value
        );
        if (discountInfoHavingValue) {
            return getSingleDiscountPrice({
                price,
                discountInfo: discountInfoHavingValue,
            });
        }
    }
    return {
        isFree: false,
        discountAmount: 0,
    };
};

export enum RequireDoctorNoteStatus {
    Required = 'REQUIRED',
    NotRequired = 'NOT_REQUIRED',
    MayRequired = 'MAY_REQUIRED',
}

export const getPackageRequireDoctorNote = ({
    packages,
    quoteType,
    chapterType,
}: {
    packages: Array<InsurancePackage | NoCoverPackage>;
    quoteType?: FunnelQuoteType;
    chapterType?: ChapterType;
}): RequireDoctorNoteStatus => {
    const res = flatten(
        packages.map((item: InsurancePackage | NoCoverPackage) => {
            if (item.id) {
                const {
                    discountInfo,
                    individualDiscountInfo,
                    coupleDiscountInfo,
                } = item;

                if (chapterType === ChapterType.Couple) {
                    return coupleDiscountInfo
                        ? coupleDiscountInfo.requireDoctorNote
                        : false;
                }
                if (individualDiscountInfo) {
                    if (quoteType) {
                        const foundItem = individualDiscountInfo?.find(
                            (d: FunnelQuoteTypeDiscountInfo) =>
                                d.quoteType === quoteType
                        );
                        return foundItem
                            ? foundItem.discountInfo.requireDoctorNote
                            : false;
                    }
                    return individualDiscountInfo?.map(
                        (d: FunnelQuoteTypeDiscountInfo) =>
                            d.discountInfo.requireDoctorNote
                    );
                }
                return discountInfo?.requireDoctorNote;
            }
            return false;
        })
    );
    if (compact(res).length === 0) return RequireDoctorNoteStatus.NotRequired;
    if (compact(res).length < res.length)
        return RequireDoctorNoteStatus.MayRequired;
    return RequireDoctorNoteStatus.Required;
};
