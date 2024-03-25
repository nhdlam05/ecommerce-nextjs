import { useQuery } from '@apollo/client';
import Button from 'atoms/Button/Button';
import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import { DocumentUploader, LegalDocumentDetail } from 'components/form';
import HowToFindCriminalRecordModal from 'components/modals/HowToFindCriminalRecordModal';
import { ModalContext } from 'context/modal';
import { LegalDocumentType } from 'generated/graphql';
import { GET_MY_LEGAL_DOCUMENT } from 'gql/provider';
import { useTranslationWithContext } from 'hooks';
import { useContext } from 'react';

interface Props {
    padding?: 'm' | 'none';
}

const CriminalRecordUploader: React.FC<Props> = ({ padding = 'm' }) => {
    const { translate } = useTranslationWithContext();
    const { data: getMyLegalDocumentRes, refetch } = useQuery(
        GET_MY_LEGAL_DOCUMENT,
        {
            variables: {
                input: {
                    legalDocumentType: LegalDocumentType.CriminalRecord,
                },
            },
        }
    );

    const { showModal } = useContext(ModalContext);

    const onShowModal = () => showModal(<HowToFindCriminalRecordModal />);

    return (
        <ModuleGroup
            titleSize="m"
            title={translate('upload.criminal.record.title')}
            subtitle={translate('upload.criminal.record.subtitle')}
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
                            legalDocumentType={LegalDocumentType.CriminalRecord}
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

export default CriminalRecordUploader;
