import SuperHeroImg from 'assets/img/superhero-visual.png';
import Button from 'atoms/Button/Button';
import Image from 'atoms/Image/Image';
import { ProviderState } from 'generated/graphql';
import { useMyProviderProfile, useTranslationWithContext } from 'hooks';
import { Link, useLocation } from 'react-router-dom';
import './ProviderNewlyOnboardedCTA.scss';
import Section from 'atoms/Section/Section';

const ProviderNewlyOnboardedCTA = () => {
    const { myProviderProfile } = useMyProviderProfile();
    const { translate } = useTranslationWithContext();
    const { pathname } = useLocation();
    const isActive = pathname === '/provider/get-started';
    if (!myProviderProfile) return <></>;

    const {
        profile: {
            providerStateInfo: { state },
        },
    } = myProviderProfile;

    if (state !== ProviderState.Beginner) return <></>;

    return (
        <Section spacingBottom="s">
            <Link to="/provider/get-started">
                <Button
                    classes={`ProviderNewlyOnboardedCTA ${
                        isActive ? 'is-active' : ''
                    }`}
                    theme="pink-gradient"
                    label={translate('provider.newly.onboarded.cta')}
                    iconArrow
                    startSlot={<Image src={SuperHeroImg} size="xxs" />}
                    isFullsize
                />
            </Link>
        </Section>
    );
};

export default ProviderNewlyOnboardedCTA;
