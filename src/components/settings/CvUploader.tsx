import { useQuery } from '@apollo/client';
import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import Typography from 'atoms/Typography';
import { DocumentUploader, LegalDocumentDetail } from 'components/form';
import { LegalDocumentType } from 'generated/graphql';
import { GET_MY_CV_DOCUMENT } from 'gql/provider';
import { useTranslationWithContext } from 'hooks';
import { Trans } from 'react-i18next';

interface Props {
    padding?: 'm' | 'none';
}

const CvUploader: React.FC<Props> = ({ padding = 'm' }) => {
    const { translate } = useTranslationWithContext();
    const { data: getMyCvDocumentRes, refetch } = useQuery(GET_MY_CV_DOCUMENT);

    return (
        <ModuleGroup
            titleSize="m"
            title={translate('generic.upload.your.cv')}
            subtitle={translate('generic.upload.your.cv.subtitle')}
        >
            <Module padding={padding}>
                {getMyCvDocumentRes?.myLegalDocument ? (
                    <LegalDocumentDetail
                        data={getMyCvDocumentRes?.myLegalDocument}
                        onDelete={refetch}
                    />
                ) : (
                    <>
                        <DocumentUploader
                            legalDocumentType={
                                LegalDocumentType.CurriculumVitae
                            }
                            onDone={refetch}
                        />
                        <Section spacingTop="s">
                            <Typography variant="body2" align="center">
                                <Trans i18nKey="document.uploader.contact.us">
                                    <a href="mailto:hey@aepsy.com">
                                        <></>
                                    </a>
                                </Trans>
                            </Typography>
                        </Section>
                    </>
                )}
            </Module>
        </ModuleGroup>
    );
};

export default CvUploader;
