import Module from 'atoms/Module/Module';
import './InsuranceCheckerDropdown.scss';
import Icon, { IconCheckCircle, IconCloseCirle, IconPlus } from 'atoms/Icon';
import { useQueryString } from 'use-route-as-state';
import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_INSURANCE_COMPANY } from 'gql/insurance';
import {
    ChapterType,
    FunnelQuoteType,
    InsuranceCompany,
    InsurancePackage,
} from 'generated/graphql';
import { NoCoverPackage } from 'components/insurance-checker/ICInsuranceDetail';
import Title from 'atoms/Title/Title';
import { getPackageDescription } from 'util/insuranceCheckerHelpers';
import { useTranslationWithContext } from 'hooks';
import { isEmpty, omit } from 'lodash';
import { DialogMode, ModalContext } from 'context/modal';
import InsuranceCheckerDropdownList from './InsuranceCheckerDropdownList';
import { Box } from '@mui/material';
import Loader from 'atoms/Loader/Loader';

interface Props {
    onInsuranceCompanyChange?: (insuranceCompany: InsuranceCompany) => void;
    onInsurancePackageChange?: (
        selectedCoverage: InsurancePackage | NoCoverPackage
    ) => void;
    preferredQuoteType: FunnelQuoteType;
    chapterType: ChapterType;
}

const InsuranceCheckerDropdown: React.FC<Props> = ({
    onInsuranceCompanyChange,
    onInsurancePackageChange,
    preferredQuoteType,
    chapterType,
}) => {
    const { showModal, hideModal } = useContext(ModalContext);
    const { translate } = useTranslationWithContext();
    const [params, updateParams] = useQueryString();
    const { packageId, insuranceCompanyId } = params;
    const [insuranceCompany, setInsuranceCompany] =
        useState<InsuranceCompany>();
    const [selectedCoverage, setSelectedCoverage] = useState<
        InsurancePackage | NoCoverPackage
    >();
    const { refetch: executeGetInsuranceCompany } = useQuery(
        GET_INSURANCE_COMPANY,
        {
            skip: true,
        }
    );
    const [loading, setLoading] = useState(false);

    const onReset = () => {
        updateParams({
            ...omit(params, ['insuranceCompanyId', 'packageId']),
        });
        setInsuranceCompany(undefined);
        setSelectedCoverage(undefined);
        hideModal();
    };

    const showListModal = () => {
        showModal(
            <InsuranceCheckerDropdownList
                onReset={onReset}
                onClose={hideModal}
                insuranceCompany={insuranceCompany}
                chapterType={chapterType}
            />,
            {
                mode: DialogMode.Custom,
            }
        );
    };

    const getIsCovered = () => {
        if (!insuranceCompany) return false;

        const { coachingCovered } = insuranceCompany;

        return (
            preferredQuoteType === FunnelQuoteType.Therapy ||
            (preferredQuoteType === FunnelQuoteType.Coaching && coachingCovered)
        );
    };

    const getInsuranceCompany = async ({
        insuranceCompanyId,
        packageId,
    }: {
        insuranceCompanyId?: string;
        packageId?: string;
    }) => {
        setLoading(true);
        // TODO: move this logic of get and store insurance info to context
        const { data } = await executeGetInsuranceCompany({
            input: {
                id: insuranceCompanyId,
            },
        });

        if (data) {
            const { insuranceCompany } = data;
            setInsuranceCompany(insuranceCompany);
            onInsuranceCompanyChange &&
                onInsuranceCompanyChange(insuranceCompany);
            if (packageId) {
                const { packages } = insuranceCompany;
                const foundItem = packages.find(
                    (item: InsurancePackage) => item.id === packageId
                );
                if (foundItem) {
                    setSelectedCoverage(foundItem);
                    onInsurancePackageChange &&
                        onInsurancePackageChange(foundItem);
                }
            }
        }
        setLoading(false);
    };

    const renderContent = () => {
        if (insuranceCompany) {
            const { packages, name } = insuranceCompany;
            return (
                <>
                    {isEmpty(packages) ? (
                        <Icon
                            theme="lighter"
                            icon={<IconCloseCirle />}
                            size="xs"
                        />
                    ) : (
                        <Icon
                            theme="success"
                            icon={<IconCheckCircle />}
                            size="xs"
                        />
                    )}
                    <Title
                        size="s"
                        noMargin
                        className="InsuranceCheckerDropdown--title"
                    >
                        {name} -{' '}
                        <Title size="s" theme="text-light" tag="span">
                            {selectedCoverage
                                ? getPackageDescription({
                                      coverage: selectedCoverage,
                                      chapterType,
                                  })
                                : translate(
                                      'insurance.company.info.add.your.package'
                                  )}
                        </Title>
                    </Title>
                    {!selectedCoverage && (
                        <Icon size="xxs" theme="purple" icon={<IconPlus />} />
                    )}
                </>
            );
        }

        if (loading)
            return (
                <div className="InsuranceCheckerDropdown--loading">
                    <Loader size={20} />
                </div>
            );

        return (
            <>
                <Box sx={{ mr: 2 }}>
                    <Title theme="soft" noMargin size="s">
                        {translate('generic.select.your.insurance')}
                    </Title>
                </Box>
                <Icon size="xxs" theme="purple" icon={<IconPlus />} />
            </>
        );
    };

    useEffect(() => {
        if (insuranceCompanyId) {
            getInsuranceCompany({ insuranceCompanyId, packageId });
        }
    }, [insuranceCompanyId, packageId]);

    if (!getIsCovered || chapterType !== ChapterType.Individual) return <></>;

    return (
        <Module
            className="InsuranceCheckerDropdown"
            variant="modal"
            radius="l"
            theme="purple"
            onClick={showListModal}
        >
            {renderContent()}
        </Module>
    );
};

export default InsuranceCheckerDropdown;
