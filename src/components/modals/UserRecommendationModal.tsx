import { useQuery } from '@apollo/client';
import Button from 'atoms/Button/Button';
import IconText from 'atoms/IconText/IconText';
import Loader from 'atoms/Loader/Loader';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { CopyUrlClipboard } from 'components/common';
import { HowRecommendationWorkModal } from 'components/modals';
import { MY_RECOMMENDATION_INFO } from 'gql/account';
import { useTranslationWithContext } from 'hooks';
import { HiOutlineMail } from 'react-icons/hi';
import { ImWhatsapp } from 'react-icons/im';
import { EmailShareButton, WhatsappShareButton } from 'react-share';
import { logFirebaseEvent } from 'service/auth';
import './UserRecommendationModal.scss';

const UserRecommendationModal = () => {
    const { translate } = useTranslationWithContext();
    const { data: myUserRecommendationInfoRes, loading } = useQuery(
        MY_RECOMMENDATION_INFO
    );

    if (!myUserRecommendationInfoRes || loading) return <Loader />;

    const {
        myUserRecommendationInfo: { recommendationLink },
    } = myUserRecommendationInfoRes;

    return (
        <div className="UserRecommendationModal">
            <Title size="xl" align="center" font="alt">
                {translate('my.user.recommendation.title')}
            </Title>
            <Text size="xs" align="center">
                {translate('my.user.recommendation.subtitle')}
            </Text>

            <Section spacingTop="m" spacingBottom="l">
                <Title size="m">
                    {translate('my.user.recommendation.share.me')}
                </Title>
                <CopyUrlClipboard
                    url={recommendationLink}
                    onCopy={() =>
                        logFirebaseEvent('recommendation_link_copy_clicked')
                    }
                    successMessage={translate('generic.link.copied')}
                />
                <Section spacingTop="m">
                    <Title size="s">
                        {translate('my.user.recommendation.share.via.channel')}
                    </Title>
                    <EmailShareButton
                        url={recommendationLink}
                        className="ReferralInvites--ctas"
                        onShareWindowClose={() =>
                            logFirebaseEvent(
                                'recommendation_link_share_email_clicked'
                            )
                        }
                    >
                        <Button
                            isFullsize
                            size="s"
                            label={
                                <IconText
                                    theme="white"
                                    icon={<HiOutlineMail />}
                                    text="E-Mail"
                                />
                            }
                        />
                    </EmailShareButton>
                    <WhatsappShareButton
                        url={recommendationLink}
                        separator=" "
                        className="ReferralInvites--ctas is-whatsapp"
                        onShareWindowClose={() =>
                            logFirebaseEvent(
                                'recommendation_link_share_whatsapp_clicked'
                            )
                        }
                    >
                        <Button
                            size="s"
                            isFullsize
                            label={
                                <IconText
                                    theme="white"
                                    icon={<ImWhatsapp />}
                                    text="WhatsApp"
                                />
                            }
                        />
                    </WhatsappShareButton>
                </Section>
            </Section>
            <Title size="m" noMargin>
                {translate('generic.how.does.it.work')}
            </Title>
            <HowRecommendationWorkModal size="s" />
        </div>
    );
};

export default UserRecommendationModal;
