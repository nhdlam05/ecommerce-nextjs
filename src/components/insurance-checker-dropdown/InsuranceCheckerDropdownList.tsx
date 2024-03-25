import { ChapterType, InsuranceCompany } from 'generated/graphql';
import { useState } from 'react';
import { omit } from 'lodash';
import { useQueryString } from 'use-route-as-state';
import InsuranceCheckerDropdownPackageList from './InsuranceCheckerDropdownPackageList';
import InsuranceCheckerDropdownCompanyList from './InsuranceCheckerDropdownCompanyList';
import './InsuranceCheckerDropdownList.scss';

interface Props {
    onClose: VoidFunction;
    onReset: VoidFunction;
    insuranceCompany?: InsuranceCompany;
    chapterType: ChapterType;
}

enum View {
    Company = 'Company',
    Package = 'Package',
}

const InsuranceCheckerDropdownList: React.FC<Props> = ({
    insuranceCompany: defaultInsuraceCompany,
    onClose,
    onReset,
    chapterType,
}) => {
    const [params, updateParams] = useQueryString();

    const [view, setView] = useState<View>(
        defaultInsuraceCompany ? View.Package : View.Company
    );

    const [insuranceCompany, setInsuranceCompany] = useState<
        InsuranceCompany | undefined
    >(defaultInsuraceCompany);

    const onInsuranceCompanySelected = (insuranceCompany: InsuranceCompany) => {
        setInsuranceCompany(insuranceCompany);
        setView(View.Package);
    };

    const onSkip = () => {
        if (insuranceCompany) {
            updateParams({
                ...params,
                insuranceCompanyId: insuranceCompany.id,
            });
        }
    };

    const onInsurancePackageSelected = (packageId?: string | null) => {
        if (insuranceCompany && packageId) {
            updateParams({
                ...params,
                insuranceCompanyId: insuranceCompany.id,
                packageId,
            });
        }
        onClose();
    };

    const onBack = () => {
        setView(View.Company);
    };

    const renderContent = () => {
        if (view === View.Package && insuranceCompany) {
            return (
                <InsuranceCheckerDropdownPackageList
                    insuranceCompany={insuranceCompany}
                    onInsurancePackageSelected={onInsurancePackageSelected}
                    onSkip={onSkip}
                    onBack={onBack}
                    onReset={onReset}
                    chapterType={chapterType}
                    defaultPackageId={params.packageId}
                />
            );
        }

        return (
            <InsuranceCheckerDropdownCompanyList
                onInsuranceCompanySelected={onInsuranceCompanySelected}
                onClose={onClose}
                defaultInsuranceCompanyId={insuranceCompany?.id}
            />
        );
    };

    return (
        <div className="InsuranceCheckerDropdownList">{renderContent()}</div>
    );
};

export default InsuranceCheckerDropdownList;
