import Img from 'assets/img/Romina_Marie_Aepsy_Banner.png';
import Image from 'atoms/Image/Image';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Typography from 'atoms/Typography';
import { ProviderRecommendationCTA } from 'components/common';
import { useTranslationWithContext } from 'hooks';
import './AskForProviderRecommendation.scss';

interface Props {
    title?: string;
    subtitle?: string;
    source: string;
    variant?: 'horizontal' | 'vertical';
}

const AskForProviderRecommendation: React.FC<Props> = ({
    title = 'provider.recommendation.banner.title',
    subtitle = 'provider.recommendation.banner.subtitle',
    variant = 'vertical',
    source,
}) => {
    const { translate } = useTranslationWithContext();
    return (
        <div className={`AskForProviderRecommendation variant-${variant}`}>
            <Module radius="l" highlighted>
                <div className="AskForProviderRecommendation--wrapper">
                    <div className="AskForProviderRecommendation--left">
                        <Image
                            src={Img}
                            size={variant === 'vertical' ? 'm' : 's'}
                        />
                    </div>
                    <div className="AskForProviderRecommendation--right">
                        <Section spacingBottom="xs">
                            <Typography variant="h4">
                                {translate(title)}
                            </Typography>
                        </Section>
                        <Typography variant="body1" text="secondary">
                            {translate(subtitle)}
                        </Typography>
                        <Section spacingTop="s">
                            <ProviderRecommendationCTA
                                source={source}
                                size="m"
                            />
                        </Section>
                    </div>
                </div>
            </Module>
        </div>
    );
};

export default AskForProviderRecommendation;
