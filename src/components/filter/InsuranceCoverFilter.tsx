import Checkbox from 'atoms/Checkbox/Checkbox';
import { InsuranceLearnMoreModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { InsuranceCoverageType } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useContext, useEffect, useState } from 'react';
import { logFirebaseEvent } from 'service/auth';
import { Box } from '@mui/material';
import Title from 'atoms/Title/Title';
import Icon, { IconInfoCircle } from 'atoms/Icon';
import { isNil } from 'lodash';

const ANY_VALUE = 'insurance_any';

const SUPPORTED_INSURANCES_TRANSLATION: any = {
    [ANY_VALUE]: 'generic.any',
    [InsuranceCoverageType.NoCovered]:
        'provider.search.filter.insurance.no.covered',
    [InsuranceCoverageType.Covered]: 'provider.search.filter.insurance.covered',
    [InsuranceCoverageType.CoveredByBaseInsurance]:
        'provider.search.filter.basic.insurance.covered',
};

interface Props {
    defaultValues: InsuranceCoverageType | null;
    showBaseInsuranceChoice: boolean;
    onChange: (data: {
        insuranceCoverTypes: InsuranceCoverageType[] | null;
    }) => void;
}

const InsuranceCoverFilter: React.FC<Props> = ({
    defaultValues,
    showBaseInsuranceChoice,
    onChange,
}) => {
    const [insuranceCoverType, setInsuranceCoverType] =
        useState<InsuranceCoverageType | null>(defaultValues);
    const { showModal } = useContext(ModalContext);
    const { translate } = useTranslationWithContext();

    const handleChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        if (value === ANY_VALUE && checked) {
            setInsuranceCoverType(null);
            onChange({ insuranceCoverTypes: null });
            logFirebaseEvent('insurance_coverage_filter_choice_clicked', {
                choices: null,
            });
        } else {
            const newInsuranceCoverType = checked ? value : null;
            setInsuranceCoverType(newInsuranceCoverType);
            onChange({ insuranceCoverTypes: newInsuranceCoverType });
            logFirebaseEvent('insurance_coverage_filter_choice_clicked', {
                choices: [newInsuranceCoverType],
            });
        }
    };

    const filteredResults = showBaseInsuranceChoice
        ? [
              { coverType: ANY_VALUE },
              { coverType: InsuranceCoverageType.NoCovered },
              { coverType: InsuranceCoverageType.Covered },
              { coverType: InsuranceCoverageType.CoveredByBaseInsurance },
          ]
        : [
              { coverType: ANY_VALUE },
              { coverType: InsuranceCoverageType.NoCovered },
              { coverType: InsuranceCoverageType.Covered },
          ];

    const showLearnMoreModal = () => {
        logFirebaseEvent('insurance_coverage_filter_more_info_modal');
        showModal(<InsuranceLearnMoreModal />, {
            title: translate('provider.search.filter.insurance.learn.more'),
            isExtralModal: true,
        });
    };

    useEffect(() => {
        if (defaultValues) setInsuranceCoverType(defaultValues);
    }, [defaultValues]);

    return (
        <>
            <div className="FilterSelectionDetail--title">
                <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <Title size="m" noMargin>
                        {translate('provider.search.filter.insurance.title')}
                    </Title>
                    <Box sx={{ ml: 1 }}>
                        <Icon
                            icon={<IconInfoCircle />}
                            theme="action"
                            size="xxs"
                            onClick={showLearnMoreModal}
                            className="cursor-pointer"
                        />
                    </Box>
                </Box>
            </div>
            <div className="FilterSelection--singleChoice-wrapper">
                {filteredResults.map((item: any) => (
                    <Checkbox
                        id={item.coverType}
                        value={item.coverType}
                        type="checkbox"
                        variant="badge"
                        name={item.coverType}
                        key={item.coverType}
                        align="left"
                        checked={
                            (isNil(insuranceCoverType) &&
                                item.coverType === ANY_VALUE) ||
                            item.coverType === insuranceCoverType
                        }
                        onChange={handleChange}
                    >
                        {translate(
                            SUPPORTED_INSURANCES_TRANSLATION[item.coverType]
                        )}
                    </Checkbox>
                ))}
            </div>
        </>
    );
};

export default InsuranceCoverFilter;
