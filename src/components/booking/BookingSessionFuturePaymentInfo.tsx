import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import AccordionGroup from 'atoms/AccordionGroup/AccordionGroup';
import Icon, {
    IconBlocked,
    IconDottedCheck,
    IconFullCheck,
    IconTheme,
} from 'atoms/Icon';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import {
    ChapterType,
    InsuranceCompany,
    InsurancePackage,
    Maybe,
} from 'generated/graphql';
import { GET_INSURANCE_COMPANY } from 'gql/insurance';
import { useTranslationWithContext } from 'hooks';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { TranslationKey } from 'translation';
import { useQueryString } from 'use-route-as-state';
import {
    getPackageDescription,
    getPackageMaxAmount,
} from 'util/insuranceCheckerHelpers';

interface Props {
    noCovered: boolean;
    chapterType: ChapterType;
}

enum InsuranceType {
    SeflPayment = 'SELF_PAYMENT',
    SupplementaryInsurance = 'SUPPLEMENTARY_INSURANCE',
    BaseInsurance = 'BASE_INSURANCE',
}

type InsuranceInfo = {
    title: TranslationKey;
    titleContext?: any;
    content: string;
    contentContext?: any;
    icon: React.ReactElement;
    theme: IconTheme;
    type: InsuranceType;
};

const BookingSessionFuturePaymentInfo: React.FC<Props> = ({
    noCovered,
    chapterType,
}) => {
    const { translate } = useTranslationWithContext();
    const { refetch: excuteGetInsuranceCompany } = useQuery(
        GET_INSURANCE_COMPANY,
        { skip: true }
    );
    const [{ packageId, insuranceCompanyId }] = useQueryString();
    const [data, setData] = useState<{
        defaultExpanded: InsuranceType;
        supplementaryInsuranceInfo: InsuranceInfo;
    }>();

    const getInsuranceCompany = async (id: string) => {
        const { data } = await excuteGetInsuranceCompany({
            input: {
                id,
            },
        });
        if (data) {
            const { insuranceCompany } = data;
            return insuranceCompany;
        }
        return null;
    };

    const getSupInsuranceTitle = (
        insuranceCompany: InsuranceCompany
    ): { title: TranslationKey; titleContext?: any } => {
        if (insuranceCompany) {
            return {
                title: 'insurance.confirm.via.supplementary.with.selected.insurance',
                titleContext: {
                    companyName: insuranceCompany.name,
                },
            };
        }
        return {
            title: 'insurance.confirm.via.supplementary.insurance',
        };
    };

    const getNoSelectedPackageContent = ({
        packages,
        chapterType,
    }: {
        packages?: Maybe<InsurancePackage[]>;
        chapterType: ChapterType;
    }) => {
        const maxAmount = getPackageMaxAmount({
            packages,
            chapterType,
        });
        if (maxAmount > 0) {
            return {
                content: 'insurance.confirm.covered.with.no.selected.package',
                contentContext: {
                    maxAmount,
                },
            };
        }
        return {
            content: 'insurance.confirm.covered.content',
        };
    };

    const getSupInsuranceContent = ({
        insuranceCompany,
        packageId,
        chapterType,
    }: {
        insuranceCompany: InsuranceCompany;
        packageId: string;
        chapterType: ChapterType;
    }) => {
        if (insuranceCompany) {
            const { packages } = insuranceCompany;
            if (packageId) {
                const selectedPackage = packages?.find(
                    (item: InsurancePackage) => item.id === packageId
                );
                if (selectedPackage) {
                    const description = getPackageDescription({
                        coverage: selectedPackage,
                        chapterType,
                    });
                    return {
                        content:
                            'insurance.confirm.covered.with.selected.package',
                        contentContext: {
                            package: `${selectedPackage.name} - ${description}`,
                        },
                    };
                }
                return getNoSelectedPackageContent({ packages, chapterType });
            }
            return getNoSelectedPackageContent({ packages, chapterType });
        }
        return {
            content: 'insurance.confirm.covered.content',
        };
    };

    const getSup = async () => {
        const insuranceCompany = await getInsuranceCompany(insuranceCompanyId);
        return {
            ...getSupInsuranceTitle(insuranceCompany),
            ...getSupInsuranceContent({
                insuranceCompany,
                packageId,
                chapterType,
            }),
            icon: <IconDottedCheck />,
            theme: 'green' as IconTheme,
            type: InsuranceType.SupplementaryInsurance,
        };
    };

    const getData = async () => {
        if (noCovered) {
            setData({
                supplementaryInsuranceInfo: {
                    title: 'insurance.confirm.via.supplementary.insurance',
                    content: 'insurance.confirm.no.covered.content',
                    icon: <IconBlocked />,
                    theme: 'highlighted',
                    type: InsuranceType.SupplementaryInsurance,
                },
                defaultExpanded: InsuranceType.SeflPayment,
            });
            return;
        }

        if (insuranceCompanyId) {
            const supplementaryInsuranceInfo = await getSup();
            setData({
                supplementaryInsuranceInfo,
                defaultExpanded: InsuranceType.SupplementaryInsurance,
            });
        } else {
            setData({
                supplementaryInsuranceInfo: {
                    title: 'insurance.confirm.via.supplementary.insurance',
                    content: 'insurance.confirm.covered.content',
                    icon: <IconDottedCheck />,
                    theme: 'green',
                    type: InsuranceType.SupplementaryInsurance,
                },
                defaultExpanded: InsuranceType.SeflPayment,
            });
        }
    };

    useEffect(() => {
        getData();
    }, [noCovered, chapterType, insuranceCompanyId, packageId]);

    if (!data) return <></>;

    const INSURANCES_INFO: InsuranceInfo[] = [
        {
            title: 'insurance.confirm.self.payment',
            content: 'insurance.confirm.self.payment.content',
            icon: <IconFullCheck />,
            theme: 'green',
            type: InsuranceType.SeflPayment,
        },
        {
            ...data.supplementaryInsuranceInfo,
        },
        {
            title: 'insurance.confirm.via.base.insurance',
            content: 'insurance.confirm.via.base.insurance.content',
            icon: <IconBlocked />,
            theme: 'highlighted',
            type: InsuranceType.BaseInsurance,
        },
    ];

    return (
        <Section spacingTop="xxs" spacingBottom="m">
            <Title size="l" noMargin align="left">
                {translate('booking.session.future.payment.info.title')}
            </Title>

            <Section spacingTop="xs">
                <Text size="m">
                    {translate('booking.session.future.payment.info.subtitle')}
                </Text>
            </Section>
            <Section spacingTop="s">
                {INSURANCES_INFO.map((item) => (
                    <Section spacingBottom="s" key={item.type}>
                        <AccordionGroup
                            variant="modal"
                            comingFrom={item.type}
                            defaultExpanded={data.defaultExpanded === item.type}
                            data={[
                                {
                                    isMarkdown: false,
                                    question: (
                                        <Box display="flex" alignItems="center">
                                            <Box sx={{ mr: 1 }}>
                                                <Icon
                                                    icon={item.icon}
                                                    size="s"
                                                    theme={item.theme}
                                                />
                                            </Box>
                                            <Title
                                                align="left"
                                                size="m"
                                                noMargin
                                            >
                                                {translate({
                                                    key: item.title,
                                                    ...(item.titleContext
                                                        ? {
                                                              context:
                                                                  item.titleContext,
                                                          }
                                                        : {}),
                                                })}
                                            </Title>
                                        </Box>
                                    ),
                                    answer: '',
                                    content: (
                                        <>
                                            <Section spacingBottom="s">
                                                <Text
                                                    size="s"
                                                    align="left"
                                                    text="secondary"
                                                >
                                                    <Trans
                                                        i18nKey={item.content}
                                                        components={{
                                                            br: <br />,
                                                            bold: <strong />,
                                                        }}
                                                        values={
                                                            item.contentContext
                                                        }
                                                    />
                                                </Text>
                                            </Section>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </Section>
                ))}
            </Section>
        </Section>
    );
};

export default BookingSessionFuturePaymentInfo;
