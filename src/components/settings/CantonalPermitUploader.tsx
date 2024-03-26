import { useQuery } from '@apollo/client';
import Item from 'atoms/Item';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Toggle from 'atoms/Toggle';
import { DocumentUploader, LegalDocumentDetail } from 'components/form';
import { LegalDocumentType } from 'generated/graphql';
import { GET_MY_LEGAL_DOCUMENT } from 'gql/provider';
import { useMyProviderProfile, useTranslationWithContext } from 'hooks';

interface Props {
    variant?: 'modal' | '';
    padding?: 'none' | 'm';
}

const CantonalPermitUploader: React.FC<Props> = ({
    variant = '',
    padding = 'm',
}) => {
    const { translate } = useTranslationWithContext();
    const { myProviderProfile } = useMyProviderProfile();

    const { data: getMyCantonalPermitRes, refetch } = useQuery(
        GET_MY_LEGAL_DOCUMENT,
        {
            variables: {
                input: {
                    legalDocumentType:
                        LegalDocumentType.CantonalPermitCertificate,
                },
            },
        }
    );

    if (!myProviderProfile) return <></>;

    const {
        profile: {
            permitInfo: { hasCantonalPermit },
        },
    } = myProviderProfile;

    return (
        <>
            <Module variant={variant} padding="none">
                <Item
                    title={
                        hasCantonalPermit
                            ? translate(
                                  'provider.insurance.factor.has.cantonal.permit'
                              )
                            : translate(
                                  'provider.insurance.factor.missing.cantonal.permit'
                              )
                    }
                    endSlot={
                        <Toggle
                            disabled
                            onChange={() => {}}
                            checked={hasCantonalPermit}
                        />
                    }
                />
            </Module>

            <Section spacingTop="s">
                <Module padding={padding}>
                    {getMyCantonalPermitRes?.myLegalDocument ? (
                        <LegalDocumentDetail
                            data={getMyCantonalPermitRes?.myLegalDocument}
                            onDelete={refetch}
                        />
                    ) : (
                        <DocumentUploader
                            legalDocumentType={
                                LegalDocumentType.CantonalPermitCertificate
                            }
                            onDone={refetch}
                        />
                    )}
                </Module>
            </Section>
        </>
    );
};

export default CantonalPermitUploader;
