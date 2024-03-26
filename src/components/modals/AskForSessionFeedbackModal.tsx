import FeedbackImg from 'assets/img/feedback-image.png';
import Image from 'atoms/Image/Image';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import moment from 'moment';
import { renderFriendlyDateString } from 'util/time/formatTime';

interface Props {
    date?: string;
}

const AskForSessionFeedbackModal: React.FC<Props> = ({ date }) => {
    const { translate } = useTranslationWithContext();

    return (
        <>
            <Image size="s" src={FeedbackImg} />
            <Section spacing="s">
                <Title size="m" align="center" noMargin>
                    {translate(
                        date
                            ? {
                                  key: 'ask.for.session.feedback.title',
                                  context: {
                                      date: renderFriendlyDateString(
                                          moment(date)
                                      ),
                                  },
                              }
                            : 'ask.for.session.feedback.title.without.date'
                    )}
                </Title>
                <Text size="s" align="center">
                    {translate('ask.for.session.feedback.subtitle')}
                </Text>
            </Section>
        </>
    );
};

export default AskForSessionFeedbackModal;
