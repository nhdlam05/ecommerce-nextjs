import DynamicCard from 'atoms/Card/DynamicCard';
import { WhatIsWaitingListInformationModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { Provider, UserFullInfo } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import useAccount from 'hooks/useAccount';
import { buildFullName, buildUserNameWithFallback } from 'model/user';
import moment from 'moment';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { renderFriendlyDateString } from 'util/time/formatTime';
import SessionCardHeader from './SessionCardHeader';

type bookingHeader = {
    user: UserFullInfo | Provider;
};

interface Props {
    user: UserFullInfo;
    bookingHeader?: bookingHeader;
    channelId: string;
    provider: Provider;
    providerUserStatus: any;
    createdAt: string;
}

const WaitingBookingCard: React.FC<Props> = ({
    user,
    bookingHeader,
    channelId,
    provider,
    createdAt,
}) => {
    const history = useHistory();
    const { showModal } = useContext(ModalContext);
    const { translate } = useTranslationWithContext();

    const { isProvider } = useAccount();

    const showWaitingListHowItWorkModal = () => {
        showModal(<WhatIsWaitingListInformationModal />, {
            title: translate('booking.waiting.list.how.it.work'),
        });
    };

    const goToChat = () => history.push('/conversations/' + channelId);

    const clickable = {
        clickable: true,
        onClick: goToChat,
    };

    const userName = bookingHeader
        ? [
              {
                  type: 'title',
                  text: buildUserNameWithFallback(user),
                  align: 'center',
                  size: 'l',
                  sx: {
                      mt: 1,
                      mb: 2,
                  },
                  ...clickable,
              },
          ]
        : [];

    const goToProfileCTA = bookingHeader
        ? [
              {
                  type: 'button',
                  label: isProvider
                      ? translate('provider.save.view.profile')
                      : translate('generic.go.to.chat'),
                  sx: {
                      mt: 3,
                  },
                  isHalfsize: true,
                  ...clickable,
              },
          ]
        : [];

    const count = moment().diff(moment(createdAt), 'days');

    const createdAtText = [
        {
            type: 'text',
            align: 'center',
            size: 'm',
            text: translate({
                key: 'booking.waitingList.since',
                context: {
                    createdAt: renderFriendlyDateString(moment(createdAt)),
                },
            }),
        },
    ];

    const dayCount =
        count > 0
            ? [
                  {
                      type: 'badge',
                      variant: 'warning',
                      label: translate({
                          key:
                              count === 1
                                  ? 'booking.waitingList.day.count.singular'
                                  : 'booking.waitingList.day.count.plural',
                          context: {
                              count,
                          },
                      }),
                      sx: {
                          justifyContent: 'center',
                          mt: 1,
                      },
                  },
              ]
            : [];

    const descriptionText =
        count === 0
            ? [
                  {
                      type: 'text',
                      text: translate({
                          key: 'booking.waiting.user.descrition',
                          context: {
                              providerName: buildFullName(provider.userName),
                          },
                      }),
                      align: 'center',
                      size: 'm',
                      sx: {
                          mb: 2,
                      },
                      ...clickable,
                  },
              ]
            : [];

    const waitingListElements = isProvider
        ? [
              {
                  type: 'title',
                  text: '⏳',
                  align: 'center',
                  size: 'l',
                  sx: {
                      mt: 3,
                  },
                  ...clickable,
              },
              ...userName,
              ...createdAtText,
              ...dayCount,
              ...goToProfileCTA,
          ]
        : [
              {
                  type: 'title',
                  text: '⏳',
                  align: 'center',
                  size: 'l',
                  sx: {
                      mt: 3,
                  },
                  ...clickable,
              },
              {
                  type: 'title',
                  text: translate('booking.waitingList.user.title'),
                  align: 'center',
                  size: 'l',
                  sx: {
                      mb: 2,
                  },
                  ...clickable,
              },
              ...descriptionText,
              ...goToProfileCTA,
              {
                  type: 'button',
                  label: translate('booking.waiting.list.how.it.work'),
                  variant: 'inline',
                  sx: {
                      mt: 1,
                  },
                  onClick: showWaitingListHowItWorkModal,
              },
          ];

    return (
        <DynamicCard
            header={
                bookingHeader ? (
                    <SessionCardHeader
                        {...bookingHeader}
                        channelId={channelId}
                    />
                ) : null
            }
            elements={waitingListElements}
        />
    );
};

export default WaitingBookingCard;
