import Title from 'atoms/Title/Title';
import { PROVIDER_TITLE } from 'constants/common';
import { InsuranceCoverageCriteria } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import ProviderInsuranceCheckerResultDetail from './ProviderInsuranceCheckerResultDetail';

interface Props {
    coverageCriteria: InsuranceCoverageCriteria;
}
const RequirementsInfo: React.FC<Props> = ({ coverageCriteria }) => {
    const {
        minimumProviderTitle,
        requireCantonalPermit,
        requireNoZsrNumber,
        hasSupportedAssociations,
        requiredZsrComplementaryInsurance,
    } = coverageCriteria;
    const { translate } = useTranslationWithContext();
    return (
        <>
            <Title size="m">{translate('generic.requirements')}</Title>
            <ProviderInsuranceCheckerResultDetail
                text={translate({
                    key: 'insurance.checker.requirements.provider.title.min',
                    context: {
                        providerTitle: translate(
                            PROVIDER_TITLE[minimumProviderTitle]
                        ),
                    },
                })}
            />
            <ProviderInsuranceCheckerResultDetail
                text={translate(
                    requireCantonalPermit
                        ? 'insurance.checker.requirements.cantonal.permit'
                        : 'insurance.checker.requirements.no.cantonal.permit'
                )}
            />

            {requireNoZsrNumber && (
                <ProviderInsuranceCheckerResultDetail
                    text={translate(
                        'insurance.checker.requirements.no.zrs.number'
                    )}
                />
            )}

            {requiredZsrComplementaryInsurance && (
                <ProviderInsuranceCheckerResultDetail
                    text={translate(
                        'insurance.checker.no.zrs.number.complementary'
                    )}
                />
            )}

            <ProviderInsuranceCheckerResultDetail
                text={translate(
                    hasSupportedAssociations
                        ? 'insurance.checker.requirements.association.yes'
                        : 'insurance.checker.requirements.association.no'
                )}
            />
        </>
    );
};

export default RequirementsInfo;
