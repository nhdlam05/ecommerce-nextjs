import { useQuery } from '@apollo/client';
import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter, DialogFullHeader } from 'atoms/Dialog';
import Loader from 'atoms/Loader/Loader';
import Section from 'atoms/Section/Section';
import Tile from 'atoms/Tile';
import { InsuranceCompany } from 'generated/graphql';
import { GET_INSURANCE_AND_PACKAGES } from 'gql/insurance';
import { useTranslationWithContext } from 'hooks';
import React from 'react';

interface Props {
    onClose: VoidFunction;
    defaultInsuranceCompanyId?: string;
    onInsuranceCompanySelected: (insuranceCompany: InsuranceCompany) => void;
}

const InsuranceCheckerDropdownCompanyList: React.FC<Props> = ({
    onClose,
    defaultInsuranceCompanyId,
    onInsuranceCompanySelected,
}) => {
    const { translate } = useTranslationWithContext();
    const { data: insuranceCompaniesRes } = useQuery(
        GET_INSURANCE_AND_PACKAGES
    );

    const renderInsuranceCompanies = () => {
        if (!insuranceCompaniesRes) return <Loader />;

        const { insuranceCompanies } = insuranceCompaniesRes;

        return (
            <>
                {insuranceCompanies.map((item: InsuranceCompany) => (
                    <Tile
                        radius="l"
                        key={item.id}
                        title={item.name}
                        titleSize="m"
                        onClick={() => onInsuranceCompanySelected(item)}
                        variant="modal"
                        size="s"
                        className={
                            defaultInsuranceCompanyId === item.id
                                ? 'tile-active'
                                : ''
                        }
                    />
                ))}
            </>
        );
    };

    return (
        <>
            <DialogFullHeader
                title={translate('generic.select.your.insurance')}
                onCloseButtonClick={onClose}
            />
            <DialogContent>
                <Section spacing="m">{renderInsuranceCompanies()}</Section>
                <DialogFooter>
                    <Button
                        align="center"
                        label={translate('generic.cancel')}
                        onClick={onClose}
                    />
                </DialogFooter>
            </DialogContent>
        </>
    );
};

export default InsuranceCheckerDropdownCompanyList;
