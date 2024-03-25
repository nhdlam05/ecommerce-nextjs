import { Box } from '@mui/material';
import DynamicCard from 'atoms/Card/DynamicCard';
import { Provider } from 'generated/graphql';
import { useAccount, useTranslationWithContext } from 'hooks';
import { BsCalendar } from 'react-icons/bs';
import { useHistory } from 'react-router';
import SessionCardHeader from './SessionCardHeader';

interface Props {
    userId: string;
    bookingHeader: any;
    channelId: string;
    provider: Provider;
    providerUserStatus: any;
}

const IntroChatCard: React.FC<Props> = ({ bookingHeader, channelId }) => {
    const { translate } = useTranslationWithContext();
    const { isUser } = useAccount();
    const history = useHistory();

    const goToChat = () => history.push('/conversations/' + channelId);

    const allElements = [
        {
            type: 'node',
            node: (
                <Box
                    display="flex"
                    justifyContent="center"
                    sx={{ mt: 2, mb: 1 }}
                >
                    <BsCalendar size="36" fill="#849187" />
                </Box>
            ),
        },
        {
            type: 'title',
            align: 'center',
            size: 'ml',
            text: translate('session.card.nothing.upcoming.provider.title'),
        },
    ];

    const buttonElement = (() => {
        if (isUser && bookingHeader) {
            return [
                {
                    type: 'button',
                    label: translate(
                        isUser ? 'generic.go.to.chat' : 'generic.go.to.profile'
                    ),
                    sx: {
                        mt: 3,
                        mb: 1,
                    },
                    onClick: goToChat,
                },
            ];
        }
        return [];
    })();

    const hintElement = isUser
        ? [
              {
                  type: 'text',
                  size: 'xs',
                  align: 'center',
                  text: translate('booking.request.new.booking.introduction'),
              },
          ]
        : [];

    return (
        <DynamicCard
            elements={[...allElements, ...hintElement, ...buttonElement]}
            header={
                bookingHeader ? (
                    <SessionCardHeader
                        {...bookingHeader}
                        channelId={channelId}
                    />
                ) : null
            }
        />
    );
};

export default IntroChatCard;
