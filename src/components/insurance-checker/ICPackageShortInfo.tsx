import Icon, { IconSwitch } from 'atoms/Icon';
import Module from 'atoms/Module/Module';
import Tile from 'atoms/Tile';
import {
    ChapterType,
    FunnelQuoteType,
    InsurancePackage,
} from 'generated/graphql';
import { logFirebaseEvent } from 'service/auth';
import { NoCoverPackage } from './ICInsuranceDetail';
import { useMemo } from 'react';
import { getPackageDescription } from 'util/insuranceCheckerHelpers';
import Title from 'atoms/Title/Title';

interface Props {
    variant?: 'selectPage' | 'modal' | null;
    insuranceCompanyId?: string;
    showInsuranceDetailModal: (insuranceCompanyId?: string) => void;
    selectedValue?: InsurancePackage | NoCoverPackage;
    insuranceCompanyName: string;
    quoteType?: FunnelQuoteType;
    title?: React.ReactNode | string;
    chapterType?: ChapterType;
}

const ICPackageShortInfo: React.FC<Props> = ({
    insuranceCompanyName,
    variant,
    insuranceCompanyId,
    showInsuranceDetailModal,
    selectedValue,
    quoteType,
    title,
    chapterType,
}) => {
    const onClick = () => {
        logFirebaseEvent('insurance_checker_company_detail_view', {
            companyId: insuranceCompanyId,
        });
        showInsuranceDetailModal(insuranceCompanyId);
    };

    const description = useMemo(() => {
        if (!selectedValue) return '';
        return getPackageDescription({
            coverage: selectedValue,
            quoteType,
            chapterType,
        });
    }, [selectedValue, quoteType, chapterType]);

    return (
        <Module
            variant={variant}
            highlighted
            radius="xl"
            padding="m"
            onClick={onClick}
            title={title}
            className="cursor-pointer"
            theme="purple"
        >
            <Tile
                title={
                    !selectedValue?.id ? (
                        insuranceCompanyName
                    ) : (
                        <>
                            <Title size="m" tag="span" noMargin>
                                {insuranceCompanyName} -{' '}
                            </Title>
                            <Title
                                size="m"
                                theme="text-light"
                                tag="span"
                                noMargin
                            >
                                {selectedValue.name}
                            </Title>
                        </>
                    )
                }
                subtitle={description}
                topRightSlot={<Icon icon={<IconSwitch />} theme="purple" />}
                noMargin
            />
        </Module>
    );
};
export default ICPackageShortInfo;
