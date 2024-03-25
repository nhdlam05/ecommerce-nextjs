import Button from 'atoms/Button/Button';
import Icon, {
    IconBoatHelp,
    IconCirclesInCircle,
    IconSecurityCheck,
} from 'atoms/Icon';
import MarkdownText from 'atoms/MarkdownText';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import { MarkdownContentKey } from 'constants/common';
import { useFetchMarkdownData, useTranslationWithContext } from 'hooks';
import { useEffect, useState } from 'react';
import './UserConsentAgreement.scss';
import { MarkdownContent } from 'generated/graphql';
import Loader from 'atoms/Loader/Loader';

interface Content extends MarkdownContent {
    readMore: boolean;
}

const UserConsentAgreement = () => {
    const { translate } = useTranslationWithContext();
    const { contents: markdownContents } = useFetchMarkdownData({
        keys: [
            MarkdownContentKey.UserConsentCollaboration,
            MarkdownContentKey.UserConsentEmergencies,
            MarkdownContentKey.UserConsentSecurity,
        ],
    });

    const [contents, setContents] = useState<Content[]>([]);

    const toggleReadMore = (content: Content) => {
        setContents(
            contents.map((item: Content) =>
                content.key === item.key
                    ? { ...item, readMore: !content.readMore }
                    : item
            )
        );
    };

    const getIconByKey = (key: string) => {
        switch (key) {
            case MarkdownContentKey.UserConsentCollaboration:
                return <IconCirclesInCircle />;
            case MarkdownContentKey.UserConsentEmergencies:
                return <IconBoatHelp />;
            default:
                return <IconSecurityCheck />;
        }
    };

    useEffect(() => {
        if (markdownContents) {
            setContents(
                markdownContents.map((item: MarkdownContent) => ({
                    ...item,
                    readMore: false,
                }))
            );
        }
    }, [markdownContents]);

    return (
        <div className="UserConsentAgreement">
            {contents ? (
                contents.map((item: Content) => (
                    <Section spacingBottom="m">
                        <Module variant="modal" radius="giant">
                            <div
                                className={`UserConsentAgreement--item ${
                                    item.readMore ? 'read-more' : ''
                                }`}
                            >
                                <Icon
                                    icon={getIconByKey(item.key)}
                                    size="m"
                                    theme="dark"
                                />
                                {item.content && (
                                    <div>
                                        <MarkdownText content={item.content} />
                                        <Button
                                            variant="inline"
                                            label={translate(
                                                item.readMore
                                                    ? 'generic.showLess'
                                                    : 'generic.showMore'
                                            )}
                                            onClick={() => toggleReadMore(item)}
                                        />
                                    </div>
                                )}
                            </div>
                        </Module>
                    </Section>
                ))
            ) : (
                <Loader />
            )}
        </div>
    );
};
export default UserConsentAgreement;
