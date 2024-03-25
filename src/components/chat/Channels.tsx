import { useQuery } from '@apollo/client';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import { ChatConversation } from 'components/chat';
import { AccountContext } from 'context/account';
import type { Channel } from 'generated/graphql';
import { GET_CHANNELS } from 'gql/chat';
import { useTranslationWithContext } from 'hooks';
import { useContext, useEffect } from 'react';

const MESSAGE_PAGE_SIZE = 1;

interface Props {
    theme?: 'white' | 'smart';
}

const Channels: React.FC<Props> = ({ theme = 'smart' }) => {
    const { latestLiveMessage } = useContext(AccountContext);
    const { translate } = useTranslationWithContext();

    const {
        loading: loadingChannels,
        data: dataChannels,
        refetch: refetchChannels,
    } = useQuery<{
        channels: Channel[];
    }>(GET_CHANNELS, {
        variables: { limit: MESSAGE_PAGE_SIZE, hasUnreadMessage: true },
        fetchPolicy: 'cache-and-network',
    });

    useEffect(() => {
        if (latestLiveMessage) refetchChannels();
    }, [latestLiveMessage]);

    if (loadingChannels && !dataChannels) {
        return <></>;
    }

    const channels = dataChannels?.channels;

    return (
        <>
            {!!channels?.length && (
                <Section spacingBottom="m">
                    <ModuleGroup
                        theme={theme}
                        id="Channels"
                        title={translate('chatOverview.conversations.title')}
                    >
                        {channels.map((channel) => (
                            <ChatConversation
                                key={channel.id}
                                channel={channel}
                            />
                        ))}
                    </ModuleGroup>
                </Section>
            )}
        </>
    );
};

export default Channels;
