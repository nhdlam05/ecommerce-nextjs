import { Box } from '@mui/material';
import Button from 'atoms/Button/Button';
import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { UserRecommendationModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { useTranslationWithContext } from 'hooks';
import { useContext } from 'react';
import { logFirebaseEvent } from 'service/auth';

interface Props {
    theme: 'dark' | 'white';
}

const AskForUserRecommendation: React.FC<Props> = ({ theme }) => {
    const { showModal } = useContext(ModalContext);
    const { translate } = useTranslationWithContext();

    const showUserRecommendationModal = () => {
        logFirebaseEvent('recommendation_link_view');
        showModal(<UserRecommendationModal />);
    };

    return (
        <ModuleGroup
            title={translate('ask.for.user.recommendation.group.title')}
            theme={theme}
        >
            <Module padding="none" highlightedShort radius="xl">
                <Box sx={{ p: 3 }}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        sx={{ mb: 3 }}
                    >
                        <Title size="l" align="center" noMargin>
                            🎁
                        </Title>
                    </Box>
                    <Title size="m" noMargin>
                        {translate('ask.for.user.recommendation.title')}
                    </Title>
                    <Text size="xs">
                        {translate('ask.for.user.recommendation.subtitle')}
                    </Text>
                    <Section spacingTop="xs">
                        <Button
                            label={translate('ask.for.user.recommendation.cta')}
                            onClick={showUserRecommendationModal}
                            variant="inline"
                            iconArrow
                        />
                    </Section>
                </Box>
            </Module>
        </ModuleGroup>
    );
};

export default AskForUserRecommendation;
