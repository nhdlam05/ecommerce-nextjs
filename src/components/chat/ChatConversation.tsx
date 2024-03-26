import Avatar from 'atoms/Avatar/Avatar';
import Badge from 'atoms/Badge/Badge';
import Text from 'atoms/Text/Text';
import Tile from 'atoms/Tile';
import { Channel, MessageEdge, TextMessageContent } from 'generated/graphql';
import { useAccount, useTranslationWithContext } from 'hooks';
import { isEmpty } from 'lodash';
import { Optional } from 'model/common';
import { buildFullName, buildUserNameWithFallback } from 'model/user';
import React from 'react';
import { Link } from 'react-router-dom';
import { renderSimplifiedFriendlyTimestampString } from 'util/time/formatTime';

interface Props {
    channel: Channel;
}

const ChatConversation: React.FC<Props> = ({ channel }) => {
    const { translate } = useTranslationWithContext();
    const { isUser, isProvider } = useAccount();
    const { userDetails, provider } = channel;

    const displayName = isProvider
        ? buildUserNameWithFallback(userDetails)
        : buildFullName(provider.userName);

    const userAgeRange = isProvider
        ? channel.booking?.bookingInfo?.userAgeRange
        : undefined;

    const avatar = isUser ? channel.provider.userInfo.avatar : null;
    const messages = channel.messages?.edges as MessageEdge[];

    const lastMessage =
        messages && messages.length > 0
            ? (messages[0].node.content as TextMessageContent).text
            : '';

    const hadNewMessage = channel.channelStatus?.unreadMessageCount > 0;

    function displayConversationName(userAgeRange: Optional<string>) {
        return userAgeRange ? `, ${userAgeRange}` : '';
    }

    return (
        <Tile
            link={`/conversations/${channel.id}`}
            title={displayName + displayConversationName(userAgeRange)}
            startSlot={avatar && <Avatar size="xs" src={avatar} />}
            subtitle={lastMessage}
            additionInfo={
                <div>
                    <Link to={`/conversations/${channel.id}`}>
                        {translate('chat.open.conversation')}
                    </Link>
                </div>
            }
            radius="l"
            elevation={hadNewMessage ? 'm' : undefined}
            key={channel.id}
            badge={
                hadNewMessage ? (
                    <Badge
                        label={channel.channelStatus?.unreadMessageCount}
                        variant="notification"
                        size="xs"
                    />
                ) : null
            }
            topRightSlot={
                isEmpty(messages) ? (
                    <></>
                ) : (
                    <Text
                        size="xs"
                        tag="span"
                        align="right"
                        theme={hadNewMessage ? 'dark' : 'soft'}
                    >
                        {renderSimplifiedFriendlyTimestampString(
                            messages[0].node.createdAt
                        )}
                    </Text>
                )
            }
        />
    );
};

export default ChatConversation;
