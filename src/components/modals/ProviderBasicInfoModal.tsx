import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import Avatar from 'atoms/Avatar/Avatar';
import Loader from 'atoms/Loader/Loader';
import Title from 'atoms/Title/Title';
import ProviderBasicInfo from 'components/provider/ProviderBasicInfo';
import {
    AvailabilityDurationType,
    FunnelQuoteType,
    Provider,
} from 'generated/graphql';
import { GET_PROVIDER_BY_SLUG } from 'gql/provider';
import { useTranslationWithContext } from 'hooks';
import { getProviderAudioUrl } from 'model/provider';
import { buildFullName } from 'model/user';

interface Props {
    slug: string;
    quoteType: FunnelQuoteType;
}
const ProviderBasicInfoModal: React.FC<Props> = ({ slug, quoteType }) => {
    const { currentLang } = useTranslationWithContext();
    const { data: providerData, loading: providerLoading } = useQuery<{
        providerBySlug: Provider;
    }>(GET_PROVIDER_BY_SLUG, {
        variables: {
            slug,
            duration: AvailabilityDurationType.FifteenMin,
            metadataInput: {
                source: 'PROVIDER_INFO_MODAL',
            },
        },
    });

    if (!providerData || providerLoading) return <Loader />;

    const provider = providerData?.providerBySlug;

    const providerReviewUrl = `/review/for-provider?providerId=${provider.userInfo.firebaseUid}`;

    return (
        <>
            <Title size="ml" align="center">
                {buildFullName(provider.userName)}
            </Title>

            <Box display="flex" justifyContent="center">
                <Avatar
                    src={provider.userInfo.avatar}
                    audioSrc={getProviderAudioUrl(
                        provider.profile.providerInfo,
                        currentLang
                    )}
                    size="m"
                />
            </Box>
            {/* <Section spacingTop="s" spacingBottom="m">
                <Title size="s" align="center">
                    <Link to={providerReviewUrl}>
                        {translate('user.review.provider.leave.a.review')}
                    </Link>
                </Title>
            </Section> */}
            <ProviderBasicInfo
                quoteType={quoteType}
                provider={provider}
                variant="modal"
                config={{
                    pricingAndInsurance: false,
                    budgetingToolNudge: false,
                }}
            />
            {/* <ModuleGroup
                title={translate('user.review.provider.public.review')}
            >
                <Module variant="modal">
                    <Section container="short">
                        <Icon
                            align="center"
                            size="xl"
                            icon={<IconHoldingHeart />}
                            theme="danger"
                        />
                        <Section spacing="s">
                            <Title align="center" size="ml">
                                {translate(
                                    'user.review.provider.leave.a.review'
                                )}
                            </Title>
                            <Text align="center" size="s">
                                {translate(
                                    'user.review.provider.public.review.desc'
                                )}
                            </Text>
                        </Section>
                        <Link to={providerReviewUrl}>
                            <Button
                                label={translate(
                                    'user.review.provider.leave.a.review'
                                )}
                                align="center"
                            />
                        </Link>
                    </Section>
                </Module>
            </ModuleGroup> */}
        </>
    );
};

export default ProviderBasicInfoModal;
