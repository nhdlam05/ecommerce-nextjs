import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import React from 'react';
import { Trans } from 'react-i18next';

interface Props {
    waitingListTime: string | number;
    onMainActionButtonClick: () => void;
}

const BookingSessionWaitingListIntro: React.FC<Props> = ({
    waitingListTime,
    onMainActionButtonClick,
}) => {
    const { translate } = useTranslationWithContext();
    const className = ['BookingSessionWaitingListIntro']
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <div className={className}>
            <Section spacingTop="xxs" spacingBottom="l">
                <Title size="xl" align="center">
                    <Trans
                        i18nKey="booking.session.waiting.list.title"
                        values={{
                            waitingListTime,
                            week: translate(
                                waitingListTime === 1
                                    ? 'generic.week'
                                    : 'generic.week_plural'
                            ),
                        }}
                        components={{
                            highlight: <span className="is-highlighted" />,
                        }}
                    />
                </Title>
                <Text size="m" align="center">
                    {translate('booking.session.waiting.list.subtitle')}
                </Text>
                <Divider spacing="s" invisible />

                <div>
                    <Button
                        theme="ghosted"
                        label={translate('booking.session.waiting.list.cta')}
                        onClick={onMainActionButtonClick}
                    />
                </div>
            </Section>
        </div>
    );
};

export default BookingSessionWaitingListIntro;
