import Avatar from 'atoms/Avatar/Avatar';
import ClickableComponent from 'atoms/ClickableComponent';
import IconInCircle from 'atoms/IconInCircle';
import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import Title from 'atoms/Title/Title';
import { TitleProps } from 'components/booking/UpcomingBookingsOrProviders';
// import { RebookingUserContext } from 'context/rebooking';
import { Provider } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { buildFullName } from 'model/user';
// import { useContext } from 'react';
import { BsCalendar } from 'react-icons/bs';
import { useHistory } from 'react-router';

interface Props extends TitleProps {
    myProviders?: Provider[];
}

const SessionCardNewBooking: React.FC<Props> = ({ myProviders, title }) => {
    const history = useHistory();
    //  const { showRebookingModal } = useContext(RebookingUserContext);
    const { translate } = useTranslationWithContext();

    const directBookingProviders = myProviders?.filter(
        (provider) => provider?.bookingInfo?.allowDirectBooking
    );

    const onMainButtonClick = () => {
        // if (!directBookingProviders?.length) {
        //     history.push('/get-provider');
        // } else {
        //     showRebookingModal();
        // }

        // TODO: check condition to allow user book direct booking from here

        history.push('/get-provider');
    };

    function renderTitle() {
        return directBookingProviders && directBookingProviders.length === 1
            ? translate({
                  key: 'booking.book_new_session.with',
                  context: {
                      name: buildFullName(directBookingProviders[0].userName),
                  },
              })
            : translate('booking.book_new_session');
    }

    function renderIcon() {
        if (directBookingProviders && directBookingProviders.length === 1) {
            return (
                <Avatar
                    theme="soft"
                    src={directBookingProviders[0].userInfo.avatar}
                    size="s"
                    align="center"
                />
            );
        }
        return <IconInCircle icon={<BsCalendar size="32" />} size="s" />;
    }

    return (
        <ModuleGroup
            theme="dark"
            title={
                title?.hasTitle && directBookingProviders?.length
                    ? translate('myProvider.new.booking.title')
                    : undefined
            }
        >
            <ClickableComponent onClick={onMainButtonClick}>
                <Module highlighted padding="l" radius="l">
                    <Section spacingBottom="s">
                        <div className="g_center">{renderIcon()}</div>
                    </Section>
                    <Section>
                        <Title align="center" size="ml" noMargin>
                            {renderTitle()}
                        </Title>
                    </Section>
                </Module>
            </ClickableComponent>
        </ModuleGroup>
    );
};

export default SessionCardNewBooking;
