import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import Badge from 'atoms/Badge/Badge';
import Divider from 'atoms/Divider/Divider';
import Icon, {
    IconCloseCirle,
    IconInsurance,
    IconQuestionCircle,
} from 'atoms/Icon';
import Loader from 'atoms/Loader/Loader';
import Module from 'atoms/Module/Module';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import {
    InsuranceCompany,
    InsuranceCompanyCoverageResult,
    InsuranceCoverageResultType,
} from 'generated/graphql';
import { CHECK_PROVIDER_INSURANCE_COVERAGE } from 'gql/insurance';
import { useTranslationWithContext } from 'hooks';

interface Props {
    providerId: string;
    onSelect: (insuranceCompany: InsuranceCompany) => void;
}
const ProviderDetailInsurance: React.FC<Props> = ({ providerId, onSelect }) => {
    const { translate } = useTranslationWithContext();
    const { data: checkProviderInsuranceCoverageRes } = useQuery(
        CHECK_PROVIDER_INSURANCE_COVERAGE,
        {
            variables: {
                input: {
                    providerId,
                    insuranceCompanyIds: [],
                },
            },
        }
    );

    const renderIconByType = (
        type: InsuranceCoverageResultType,
        iconSize: 'm' | 'xxs'
    ) => {
        switch (type) {
            case InsuranceCoverageResultType.Unsure:
                return (
                    <Icon
                        theme="warning"
                        size={iconSize}
                        icon={<IconQuestionCircle />}
                    />
                );
            case InsuranceCoverageResultType.NotCovered:
                return (
                    <Icon
                        theme="highlighted"
                        size={iconSize}
                        icon={<IconCloseCirle />}
                    />
                );
            default:
                return <></>;
        }
    };

    if (!checkProviderInsuranceCoverageRes) return <Loader />;

    const {
        checkProviderInsuranceCoverage: { results },
    } = checkProviderInsuranceCoverageRes;

    return (
        <Module variant="modal">
            <Title size="s">
                {translate('provider.insurance.checker.subtitle')}
            </Title>
            <Box sx={{ width: '100%' }}>
                <>
                    {results.map((item: InsuranceCompanyCoverageResult) => (
                        <Badge
                            key={item.insuranceCompanyId}
                            startSlot={renderIconByType(item.resultType, 'xxs')}
                            label={item.insuranceCompany.name}
                            size="ml"
                            variant={
                                item.resultType ===
                                InsuranceCoverageResultType.Covered
                                    ? 'pink-gradient'
                                    : 'outlined'
                            }
                            className={`${
                                item.resultType ===
                                InsuranceCoverageResultType.NotCovered
                                    ? 'Badge--disabled'
                                    : ''
                            }`}
                            onClick={() => onSelect(item.insuranceCompany)}
                        />
                    ))}
                </>
            </Box>
        </Module>
    );
};

export default ProviderDetailInsurance;
