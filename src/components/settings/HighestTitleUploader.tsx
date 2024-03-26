import { useQuery } from '@apollo/client';
import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import SelectInput from 'atoms/SelectInput/SelectInput';
import { DocumentUploader, LegalDocumentDetail } from 'components/form';
import { HIGHEST_TITLE_LIST } from 'constants/common';
import { LegalDocumentType } from 'generated/graphql';
import { GET_MY_LEGAL_DOCUMENT } from 'gql/provider';
import { useTranslationWithContext } from 'hooks';
import { get } from 'lodash';
import { useMemo, useState } from 'react';

interface Props {
    padding?: 'm' | 'none';
}

const HighestTitleUploader: React.FC<Props> = ({ padding = 'm' }) => {
    const { translate } = useTranslationWithContext();
    const [legalDocumentType, setLegalDocumentType] =
        useState<LegalDocumentType>(
            LegalDocumentType.PsychotherapistCertificate
        );

    const {
        data: getPsychotherapistCertificateRes,
        refetch: refetchPsychotherapistCertificate,
    } = useQuery(GET_MY_LEGAL_DOCUMENT, {
        variables: {
            input: {
                legalDocumentType: LegalDocumentType.PsychotherapistCertificate,
            },
        },
    });

    const {
        data: getSpecialistTitleCertificateRes,
        refetch: refetchSpecialistTitleCertificate,
    } = useQuery(GET_MY_LEGAL_DOCUMENT, {
        variables: {
            input: {
                legalDocumentType: LegalDocumentType.SpecialistTitleCertificate,
            },
        },
    });

    const {
        data: getMasterPsychologyCertificateRes,
        refetch: refetchMasterPsychologyCertificate,
    } = useQuery(GET_MY_LEGAL_DOCUMENT, {
        variables: {
            input: {
                legalDocumentType:
                    LegalDocumentType.MasterPsychologyCertificate,
            },
        },
    });

    const myLegalDocument = useMemo(() => {
        if (getPsychotherapistCertificateRes?.myLegalDocument)
            return getPsychotherapistCertificateRes?.myLegalDocument;
        if (getSpecialistTitleCertificateRes?.myLegalDocument)
            return getSpecialistTitleCertificateRes?.myLegalDocument;
        if (getMasterPsychologyCertificateRes?.myLegalDocument)
            return getMasterPsychologyCertificateRes?.myLegalDocument;
        return null;
    }, [
        getPsychotherapistCertificateRes,
        getSpecialistTitleCertificateRes,
        getMasterPsychologyCertificateRes,
    ]);

    const refetch = () => {
        const type = get(
            myLegalDocument,
            'legalDocumentType',
            legalDocumentType
        );
        if (type === LegalDocumentType.PsychotherapistCertificate)
            refetchPsychotherapistCertificate();
        if (type === LegalDocumentType.SpecialistTitleCertificate)
            refetchSpecialistTitleCertificate();
        if (type === LegalDocumentType.MasterPsychologyCertificate)
            refetchMasterPsychologyCertificate();
    };

    const onLegalDocumentChange = (e: any) => {
        setLegalDocumentType(e.target.value);
    };

    return (
        <ModuleGroup
            titleSize="m"
            title={translate('upload.highest.title')}
            subtitle={translate('upload.highest.title.subtitle')}
        >
            <Module padding={padding}>
                {myLegalDocument ? (
                    <LegalDocumentDetail
                        data={myLegalDocument}
                        onDelete={refetch}
                    />
                ) : (
                    <>
                        <Section spacingBottom="s">
                            <SelectInput
                                value={legalDocumentType}
                                onChange={onLegalDocumentChange}
                                items={HIGHEST_TITLE_LIST.map((item: any) => ({
                                    ...item,
                                    label: translate(item.label),
                                }))}
                            />
                        </Section>
                        <DocumentUploader
                            legalDocumentType={legalDocumentType}
                            onDone={refetch}
                        />
                    </>
                )}
            </Module>
        </ModuleGroup>
    );
};

export default HighestTitleUploader;
