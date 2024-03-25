import Text from 'atoms/Text/Text';
import { ModalContext } from 'context/modal';
import { Maybe, ProviderMultiLangInfo } from 'generated/graphql';
import {
    useContentByPreferLang,
    usePlatform,
    useTranslationWithContext,
} from 'hooks';
import { useContext } from 'react';
import ProviderDescriptionModal from './ProviderDescriptionModal';

interface Props {
    content: any;
    providerName: string;
    onShowMoreDescription: VoidFunction;
    providerMultiLangInfo?: Maybe<ProviderMultiLangInfo>;
}

const ProviderDescription: React.FC<Props> = ({
    content,
    providerMultiLangInfo,
    providerName,
    onShowMoreDescription,
}) => {
    const { getProviderInfoByPreferLang } = useContentByPreferLang();
    const { showModal } = useContext(ModalContext);
    const { translate } = useTranslationWithContext();
    const { isDesktop } = usePlatform();

    const getContent = () => {
        const multiLangContent = getProviderInfoByPreferLang(
            providerMultiLangInfo
        );
        if (multiLangContent) {
            return multiLangContent;
        }
        return {
            about: content.data,
            additionalInfo: content.additionalInfo,
            sessionInfo: content.sessionInfo,
        };
    };

    const showAboutModal = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        if (isDesktop) {
            const { about, additionalInfo, sessionInfo } = getContent();

            showModal(
                <ProviderDescriptionModal
                    about={about}
                    additionalInfo={additionalInfo}
                    sessionInfo={sessionInfo}
                />,
                {
                    title: providerName,
                }
            );
        } else {
            onShowMoreDescription();
        }
    };

    const renderContent = () => {
        const multiLangContent = getProviderInfoByPreferLang(
            providerMultiLangInfo
        );

        const about = multiLangContent ? multiLangContent.about : content.about;

        return (
            <>
                <Text size="xs" tag="span">
                    {about?.substring(0, 85)}
                </Text>
                <Text size="xs" tag="span" isLink>
                    {' '}
                    {translate('provider.card.read.more')}
                </Text>
            </>
        );
    };

    return (
        <div onClick={showAboutModal} className="cursor-pointer">
            {renderContent()}
        </div>
    );
};

export default ProviderDescription;
