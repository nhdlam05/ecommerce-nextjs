import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import Icon, { IconInfoCircle } from 'atoms/Icon';
import Loader from 'atoms/Loader/Loader';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { DialogMode, ModalContext } from 'context/modal';
import {
    ChapterType,
    FunnelQuoteType,
    InsuranceCompany,
    InsurancePackage,
} from 'generated/graphql';
import { GET_INSURANCE_COMPANIES, GET_INSURANCE_COMPANY } from 'gql/insurance';
import { useTranslationWithContext } from 'hooks';
import { omit } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { useQueryString, useQueryStringKey } from 'use-route-as-state';
import type { NoCoverPackage } from './ICInsuranceDetail';
import ICInsuranceDetail from './ICInsuranceDetail';
import ICInsuranceGenenalInfo from './ICInsuranceGenenalInfo';
import './InsuranceChecker.scss';
import InsuranceCompanyInfo from './InsuranceCompanyInfo';
import ICPackageShortInfo from './ICPackageShortInfo';

interface Props {
    providerId: string;
    noCovered?: boolean;
    variant?: 'selectPage' | 'modal' | null;
    selectedValue?: InsurancePackage | NoCoverPackage;
    setSelectedValue: (
        selectedValue?: InsurancePackage | NoCoverPackage
    ) => void;
    quoteType?: FunnelQuoteType;
    chapterType?: ChapterType;
}

export enum View {
    InsuranceChecker = 'INSURANCE_CHECKER',
    InsuranceCompanyInfo = 'INSURANCE_COMPANY_INFO',
    Hidden = 'HIDDEN',
    PackageSelection = 'PACKAGE_SELECTION',
}

const InsuranceChecker: React.FC<Props> = ({
    providerId,
    noCovered,
    variant,
    selectedValue,
    setSelectedValue,
    quoteType,
    chapterType,
}) => {
    const [params, updateParams] = useQueryString();
    const [insuranceCompanyId, updateInsuranceCompanyId] =
        useQueryStringKey('insuranceCompanyId');
    const [packageId, updatePackageId] = useQueryStringKey('packageId');
    const { data: insuranceCompaniesRes } = useQuery(GET_INSURANCE_COMPANIES);
    const { refetch: fetchInsuranceCompany } = useQuery(GET_INSURANCE_COMPANY, {
        skip: true,
    });
    const [selectedInsuranceCompany, setSelectedInsuranceCompany] =
        useState<InsuranceCompany>();
    const { showModal, hideModal } = useContext(ModalContext);
    const { translate } = useTranslationWithContext();
    const [view, setView] = useState<View>(
        insuranceCompanyId ? View.InsuranceCompanyInfo : View.InsuranceChecker
    );
    const [insuranceCompany, setInsuranceCompany] =
        useState<InsuranceCompany>();

    const handleSelectChange = (insuranceCompany: InsuranceCompany) => {
        updateInsuranceCompanyId(insuranceCompany.id);
        setSelectedInsuranceCompany(insuranceCompany);
        setView(View.InsuranceCompanyInfo);
    };

    const onClose = () => {
        hideModal();
    };

    const onReset = () => {
        if (variant === 'selectPage') {
            updateParams({
                ...omit(params, ['packageId']),
            });
            setView(View.InsuranceCompanyInfo);
        } else {
            updateParams({
                ...omit(params, ['packageId', 'insuranceCompanyId']),
            });
            setView(View.InsuranceChecker);
        }
        setSelectedInsuranceCompany(undefined);
        setSelectedValue(undefined);
        hideModal();
    };

    const onSubmit = (insurancePackage?: InsurancePackage | NoCoverPackage) => {
        if (insurancePackage) {
            setSelectedValue(insurancePackage);
            setView(View.PackageSelection);
            if (insurancePackage.id) {
                updatePackageId(insurancePackage.id);
            } else {
                // in case No Coverage, we should remove packageId
                if (params.packageId)
                    updateParams({
                        ...omit(params, ['packageId']),
                    });
            }
            hideModal();
        }
    };

    const showInsuranceDetailModal = (id?: string) => {
        if (!id) return;
        showModal(
            <ICInsuranceDetail
                insuranceIdSelected={id}
                goBack={onClose}
                onReset={onReset}
                onSubmit={onSubmit}
                defaultValue={selectedValue}
                providerId={providerId}
                quoteType={quoteType}
                providerView={false}
                chapterType={chapterType}
            />,
            {
                mode: DialogMode.Custom,
            }
        );
    };

    const getInsuranceCompany = async () => {
        const res = await fetchInsuranceCompany({
            input: {
                id: insuranceCompanyId,
            },
        });
        if (res) {
            const {
                data: {
                    insuranceCompany,
                    insuranceCompany: { packages },
                },
            } = res;
            setInsuranceCompany(insuranceCompany);
            if (packageId) {
                const foundItem = packages.find(
                    (item: InsurancePackage) => item.id === packageId
                );
                if (foundItem) {
                    setSelectedValue(foundItem);
                    setView(View.PackageSelection);
                }
            } else {
                setView(View.InsuranceCompanyInfo);
            }
        }
    };

    useEffect(() => {
        if (selectedInsuranceCompany)
            showInsuranceDetailModal(selectedInsuranceCompany.id);
    }, [selectedInsuranceCompany]);

    const renderContent = () => {
        if (noCovered) {
            return (
                <Section spacingBottom="s">
                    <Module variant="modal" padding="s" radius="xl">
                        <Box display="flex" alignItems="center">
                            <Icon icon={<IconInfoCircle />} size="s" />
                            <Box sx={{ ml: 2 }}>
                                <Title size="m" noMargin>
                                    {translate(
                                        'provider.insurance.no.cover.warning.title'
                                    )}
                                </Title>
                                <Text size="s">
                                    {translate(
                                        'provider.insurance.no.cover.warning.subtitle'
                                    )}
                                </Text>
                            </Box>
                        </Box>
                    </Module>
                </Section>
            );
        }

        if (view === View.InsuranceCompanyInfo) {
            return (
                <InsuranceCompanyInfo
                    insuranceCompany={insuranceCompany}
                    variant={variant}
                    showInsuranceDetailModal={showInsuranceDetailModal}
                />
            );
        }

        if (
            view === View.PackageSelection &&
            selectedValue &&
            insuranceCompany
        ) {
            const { name } = insuranceCompany;
            return (
                <ICPackageShortInfo
                    variant={variant}
                    insuranceCompanyId={insuranceCompanyId}
                    insuranceCompanyName={name}
                    showInsuranceDetailModal={showInsuranceDetailModal}
                    selectedValue={selectedValue}
                    quoteType={quoteType}
                    chapterType={chapterType}
                />
            );
        }

        return (
            <Module variant={variant} padding="none">
                <ICInsuranceGenenalInfo
                    providerId={providerId}
                    onSelect={handleSelectChange}
                    quoteType={quoteType}
                    chapterType={chapterType}
                />
            </Module>
        );
    };

    useEffect(() => {
        if (insuranceCompanyId) {
            getInsuranceCompany();
        }
    }, [insuranceCompanyId]);

    if (!insuranceCompaniesRes) return <Loader />;

    return (
        <div id="insurance">
            <Section spacingBottom="s">{renderContent()}</Section>
        </div>
    );
};

export default InsuranceChecker;
