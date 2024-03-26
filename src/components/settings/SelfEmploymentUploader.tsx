import { useQuery } from '@apollo/client';
import Button from 'atoms/Button/Button';
import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import { DocumentUploader, LegalDocumentDetail } from 'components/form';
import { HowToFindSelfEmploymentCertificateModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { LegalDocumentType } from 'generated/graphql';
import { GET_MY_LEGAL_DOCUMENT } from 'gql/provider';
import { useTranslationWithContext } from 'hooks';
import { useContext } from 'react';

interface Props {
    padding?: 'm' | 'none';
}

const SelfEmploymentUploader: React.FC<Props> = ({ padding = 'm' }) => {
    const { translate } = useTranslationWithContext();
    const { data: getMyLegalDocumentRes, refetch } = useQuery(
        GET_MY_LEGAL_DOCUMENT,
        {
            variables: {
                input: {
                    legalDocumentType:
                        LegalDocumentType.SelfEmploymentCertificate,
                },
            },
        }
    );

    const { showModal } = useContext(ModalContext);

    const onShowModal = () =>
        showModal(<HowToFindSelfEmploymentCertificateModal />);

    return (
        <ModuleGroup
            titleSize="m"
            title={translate('upload.self.employment.title')}
            subtitle={translate('upload.self.employment.subtitle')}
        >
            <Module padding={padding}>
                {getMyLegalDocumentRes?.myLegalDocument ? (
                    <LegalDocumentDetail
                        data={getMyLegalDocumentRes?.myLegalDocument}
                        onDelete={refetch}
                    />
                ) : (
                    <>
                        <DocumentUploader
                            legalDocumentType={
                                LegalDocumentType.SelfEmploymentCertificate
                            }
                            onDone={refetch}
                        />
                        <Section spacingTop="s">
                            <Button
                                align="center"
                                variant="link"
                                label={translate(
                                    'generic.way.to.find.legal.document.cta'
                                )}
                                onClick={onShowModal}
                            />
                        </Section>
                    </>
                )}
            </Module>
        </ModuleGroup>
    );
};

export default SelfEmploymentUploader;
