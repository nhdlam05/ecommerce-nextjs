import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { HoveringProviders } from 'components/interactive-motion';
import { useTranslationWithContext } from 'hooks';

interface Props {
    theme?: 'white' | 'dark';
}

const ProvidersIntroBlock: React.FC<Props> = ({ theme = 'dark' }) => {
    const { translate } = useTranslationWithContext();
    return (
        <>
            <Section container="short" spacingBottom="l">
                <Title
                    size="xxl"
                    align="center"
                    font="alt"
                    theme={theme === 'white' ? theme : undefined}
                >
                    {translate('matching.welcome.title')}
                </Title>
                <Text align="center" theme={theme}>
                    {translate('matching.welcome.subtitle')}
                </Text>
            </Section>

            <HoveringProviders />
        </>
    );
};

export default ProvidersIntroBlock;
