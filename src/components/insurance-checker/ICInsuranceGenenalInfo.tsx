import { useQuery } from '@apollo/client';
import Badge from 'atoms/Badge/Badge';
import Icon, { IconCloseCirle, IconQuestionCircle } from 'atoms/Icon';
import Loader from 'atoms/Loader/Loader';
import {
    ChapterType,
    FunnelQuoteType,
    InsuranceCompany,
    InsuranceCompanyCoverageResult,
    InsuranceCoverageResultType,
} from 'generated/graphql';
import { CHECK_PROVIDER_INSURANCE_COVERAGE } from 'gql/insurance';

interface Props {
    providerId: string;
    onSelect: (insuranceCompany: InsuranceCompany) => void;
    chapterType?: ChapterType;
    quoteType?: FunnelQuoteType;
}
const ICInsuranceGenenalInfo: React.FC<Props> = ({
    providerId,
    onSelect,
    quoteType,
    chapterType,
}) => {
    const { data: checkProviderInsuranceCoverageRes } = useQuery(
        CHECK_PROVIDER_INSURANCE_COVERAGE,
        {
            variables: {
                input: {
                    providerId,
                    insuranceCompanyIds: [],
                    quoteType:
                        chapterType === ChapterType.Individual
                            ? quoteType
                            : null,
                    chapterType,
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
        <div className="ICSelectInsurance">
            <div className="ICSelectInsurance--listWrapper">
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
            </div>
        </div>
    );
};

export default ICInsuranceGenenalInfo;
