import { useSubscription } from '@apollo/client';
import { UserContext } from 'context/user';
import { Message } from 'generated/graphql';
import { LIVE_MESSAGE } from 'gql/chat';
import { useContext, useEffect } from 'react';

interface UseChatSubscriptionProps {
    callback?: (liveMessage: Message) => void;
}

const useChatSubscription = ({ callback }: UseChatSubscriptionProps) => {
    const { user: fireBaseUser } = useContext(UserContext);

    const { data: dataLiveMessage } = useSubscription<{ liveMessage: Message }>(
        LIVE_MESSAGE,
        { skip: !fireBaseUser }
    );

    useEffect(() => {
        if (dataLiveMessage?.liveMessage) {
            callback && callback(dataLiveMessage?.liveMessage);
        }
    }, [dataLiveMessage]);
};

export default useChatSubscription;
