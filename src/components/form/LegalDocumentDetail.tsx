import { useMutation } from '@apollo/client';
import Button from 'atoms/Button/Button';
import Callout from 'atoms/Callout';
import Icon, { IconAttach } from 'atoms/Icon';
import Section from 'atoms/Section/Section';
import StatusBlock from 'atoms/StatusBlock';
import Typography from 'atoms/Typography';
import { LEGAL_DOCUMENT } from 'constants/common';
import {
    LegalDocument,
    LegalDocumentUrl,
    LegalDocumentVerificationStatus,
} from 'generated/graphql';
import { DELETE_LEGAL_DOCUMENT } from 'gql/provider';
import { useAlert, useTranslationWithContext } from 'hooks';
import moment from 'moment';
import { Trans } from 'react-i18next';
import { HiOutlineTrash } from 'react-icons/hi';
import { renderFriendlyDateString } from 'util/time/formatTime';

const getBulletColorByStatus = (status: LegalDocumentVerificationStatus) => {
    switch (status) {
        case LegalDocumentVerificationStatus.VerificationPending:
            return 'warning';
        case LegalDocumentVerificationStatus.Rejected:
            return 'danger';
        case LegalDocumentVerificationStatus.Approved:
        default:
            return 'success';
    }
};
interface Props {
    data: LegalDocument;
    onDelete?: VoidFunction;
    isReviewer?: boolean;
}
const LegalDocumentDetail: React.FC<Props> = ({
    data,
    onDelete,
    isReviewer,
}) => {
    const { presentAlert } = useAlert();
    const [deleteLegalDocument, { loading }] = useMutation(
        DELETE_LEGAL_DOCUMENT
    );
    const { translate } = useTranslationWithContext();
    const theme = getBulletColorByStatus(data.status);

    const renderSubtitleByStatusForReviewer = (
        status: LegalDocumentVerificationStatus,
        verifiedAt: string,
        createdAt: string
    ) => {
        switch (status) {
            case LegalDocumentVerificationStatus.VerificationPending:
                return `Sent on ${renderFriendlyDateString(moment(createdAt))}`;
            case LegalDocumentVerificationStatus.Rejected:
                return '';
            case LegalDocumentVerificationStatus.Approved:
            default:
                return `Verified on ${renderFriendlyDateString(
                    moment(verifiedAt)
                )}`;
        }
    };

    const renderSubtitleByStatus = (
        status: LegalDocumentVerificationStatus,
        verifiedAt: string
    ) => {
        switch (status) {
            case LegalDocumentVerificationStatus.VerificationPending:
                return translate('document.content.in.review');
            case LegalDocumentVerificationStatus.Rejected:
                return (
                    <Trans i18nKey="document.content.rejected">
                        <a href="mailto:hey@aepsy.com"></a>
                    </Trans>
                );
            case LegalDocumentVerificationStatus.Approved:
            default:
                return translate({
                    key: 'generic.last.updated',
                    context: {
                        date: renderFriendlyDateString(moment(verifiedAt)),
                    },
                });
        }
    };

    const handleDelete = async (id: string) => {
        presentAlert(
            translate('legal.document.delete.title'),
            null,
            async () => {
                await deleteLegalDocument({
                    variables: {
                        input: {
                            id,
                        },
                    },
                });
                onDelete && onDelete();
            }
        );
    };

    return (
        <Section>
            <StatusBlock
                theme={theme}
                title={translate(
                    `generic.${data.status.replace('_', '.').toLowerCase()}`
                )}
                subtitle={
                    isReviewer
                        ? renderSubtitleByStatusForReviewer(
                              data?.status,
                              data?.verifiedAt,
                              data?.createdAt
                          )
                        : renderSubtitleByStatus(data?.status, data?.verifiedAt)
                }
            />

            {data.documentUrls.map((legalDocumentUrl: LegalDocumentUrl) => (
                <Section spacingTop="s" key={legalDocumentUrl.id}>
                    <Callout
                        icon={<Icon icon={<IconAttach />} />}
                        title={
                            <Typography variant="body1">
                                {translate(
                                    LEGAL_DOCUMENT[data.legalDocumentType]
                                )}
                            </Typography>
                        }
                        text={
                            <a href={legalDocumentUrl.url} target="_blank">
                                <Button
                                    size="xs"
                                    variant="inline"
                                    label={translate('generic.view.document')}
                                />
                            </a>
                        }
                        endSlot={
                            isReviewer ||
                            data.status ===
                                LegalDocumentVerificationStatus.Approved ? (
                                <></>
                            ) : (
                                <Button
                                    label={<HiOutlineTrash />}
                                    variant="inline"
                                    onClick={() =>
                                        handleDelete(legalDocumentUrl.id)
                                    }
                                    isLoading={loading}
                                />
                            )
                        }
                    />
                </Section>
            ))}

            {!isReviewer && (
                <Section spacingTop="s">
                    <Typography text="secondary" variant="subtitle1">
                        <Trans i18nKey="document.content.contact.us">
                            <a href="mailto:experts@aepsy.com">
                                <></>
                            </a>
                        </Trans>
                    </Typography>
                </Section>
            )}
        </Section>
    );
};

export default LegalDocumentDetail;
