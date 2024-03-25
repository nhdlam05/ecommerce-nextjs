import { useMutation } from '@apollo/client';
import ContractImg from 'assets/img/contract-sign-aepsy.png';
import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter, DialogFullHeader } from 'atoms/Dialog';
import Image from 'atoms/Image/Image';
import Loader from 'atoms/Loader/Loader';
import MarkdownText from 'atoms/MarkdownText';
import Section from 'atoms/Section/Section';
import SingleCheckbox from 'atoms/SingleCheckbox/SingleCheckbox';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import Typography from 'atoms/Typography';
import { HaveReadKey, MarkdownContentKey } from 'constants/common';
import { ContractAcceptanceStatus } from 'generated/graphql';
import {
    GET_PROVIDER_CONTRACT_INFO,
    UPDATE_CONTRACT_ACCEPTANCE_STATUS,
} from 'gql/provider';
import {
    useFetchMarkdownData,
    useHaveRead,
    useToast,
    useTranslationWithContext,
} from 'hooks';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

interface Props {
    providerName?: string;
    viewOnly?: boolean;
    hideModal: VoidFunction;
}

const ContractModal: React.FC<Props> = ({
    hideModal,
    providerName,
    viewOnly,
}) => {
    const { markAsRead } = useHaveRead({
        key: HaveReadKey.AskForReviewProviderContract,
    });
    const { showToast } = useToast();
    const { translate, currentLang } = useTranslationWithContext();
    const { content } = useFetchMarkdownData({
        key: MarkdownContentKey.ContractModal,
    });
    const [agreement, setAgreement] = useState(false);
    const [skipLoading, setSkipLoading] = useState(false);
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [updateContractAcceptanceStatus] = useMutation(
        UPDATE_CONTRACT_ACCEPTANCE_STATUS,
        {
            refetchQueries: [
                {
                    query: GET_PROVIDER_CONTRACT_INFO,
                    variables: {
                        input: {},
                    },
                },
            ],
        }
    );

    const onAgreementChange = (e: any) => setAgreement(e.target.checked);

    const renderTitle = () => {
        if (providerName) {
            return translate({
                key: 'contract.modal.need.review.title',
                context: {
                    providerName,
                },
            });
        }
        return translate('contract.modal.view.only.title');
    };

    const onAccept = async () => {
        setAcceptLoading(true);
        await updateContractAcceptanceStatus({
            variables: {
                input: {
                    status: ContractAcceptanceStatus.Accepted,
                },
            },
        });
        setAcceptLoading(false);
        hideModal();
        showToast({
            message: translate('generic.saved.successfully'),
            position: 'bottom',
            color: 'success',
        });
    };

    const onSkip = async () => {
        setSkipLoading(true);
        await updateContractAcceptanceStatus({
            variables: {
                input: {
                    status: ContractAcceptanceStatus.Skipped,
                },
            },
        });
        setSkipLoading(false);
        hideModal();
    };

    const renderPrimaryCTA = () => {
        if (viewOnly) {
            return (
                <Button
                    label={translate('generic.close')}
                    align="center"
                    onClick={hideModal}
                />
            );
        }
        return (
            <Button
                label={translate('generic.submit')}
                align="center"
                disabled={!agreement}
                onClick={onAccept}
                isLoading={acceptLoading}
            />
        );
    };

    const renderSecondaryCTA = () => {
        if (viewOnly) {
            return (
                <Section spacingTop="s">
                    <Text size="s" align="center">
                        <Trans i18nKey="generic.contact.hey.aepsy">
                            <a href="mailto:hey@aepsy.com" />
                        </Trans>
                    </Text>
                </Section>
            );
        }
        return (
            <Button
                variant="naked"
                label={translate('contract.modal.skip')}
                onClick={onSkip}
                isLoading={skipLoading}
            />
        );
    };

    const onClose = () => {
        if (!viewOnly) {
            onSkip();
        } else {
            hideModal();
        }
    };

    useEffect(() => {
        return () => {
            markAsRead();
        };
    }, []);

    return (
        <>
            <DialogFullHeader
                title={translate('contract.modal.header.title')}
                onCloseButtonClick={onClose}
            />
            <DialogContent footerSize="l">
                <Section spacing="s">
                    <Image src={ContractImg} size="m" align="center" />
                    <Typography variant="h4" align="center">
                        {renderTitle()}
                    </Typography>
                    <Section spacing="s">
                        {content ? (
                            <MarkdownText content={content} />
                        ) : (
                            <Loader />
                        )}
                    </Section>
                </Section>
                <DialogFooter backgroundTransparent={false}>
                    <>
                        {!viewOnly && (
                            <Section spacingBottom="m">
                                <SingleCheckbox
                                    checked={agreement}
                                    onChange={onAgreementChange}
                                >
                                    <Title size="s">
                                        <Trans i18nKey="contract.modal.terms.conditions">
                                            <a
                                                href={`https://aepsy.com/${currentLang}/terms/`}
                                                target="_blank"
                                            ></a>
                                        </Trans>
                                    </Title>
                                </SingleCheckbox>
                            </Section>
                        )}
                        {renderPrimaryCTA()}
                        {renderSecondaryCTA()}
                    </>
                </DialogFooter>
            </DialogContent>
        </>
    );
};

export default ContractModal;
