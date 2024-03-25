import Text from 'atoms/Text/Text';
import { Trans } from 'react-i18next';
import { FiLock } from 'react-icons/fi';
import { Translatable } from 'translation';
import './FeedbackReviewTitle.scss';

interface Props {
    text?: Translatable;
}

const FeedbackReviewTitle: React.FC<Props> = ({ text }) => {
    return (
        <div className="g_center g_clearfix">
            <div className="g_1_2 g_center">
                <Text size="s" noMargin align="center">
                    <FiLock className="FeedbackReviewTitle--icon" />{' '}
                    <Trans
                        i18nKey={
                            (text as string) || 'user.review.default.title'
                        }
                        components={{ bold: <strong /> }}
                    />
                </Text>
            </div>
        </div>
    );
};

export default FeedbackReviewTitle;
