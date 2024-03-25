import Badge from 'atoms/Badge/Badge';
import Section from 'atoms/Section/Section';
import { Trans } from 'react-i18next';

const BookingSessionWaitingTimeInfo = () => {
    const className = ['BookingSessionWaitingTimeInfo']
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <div className={className}>
            <Section spacingTop="xxs" spacingBottom="l">
                <div>
                    <Badge
                        align="left"
                        size="l"
                        variant="warning"
                        label={
                            <Trans i18nKey="booking.session.waiting.time.info">
                                <a
                                    href="https://www.ch.ch/de/notfallnummern-erste-hilfe/"
                                    target="_blank"
                                    rel="noreferrer"
                                />
                            </Trans>
                        }
                    />
                </div>
            </Section>
        </div>
    );
};

export default BookingSessionWaitingTimeInfo;
