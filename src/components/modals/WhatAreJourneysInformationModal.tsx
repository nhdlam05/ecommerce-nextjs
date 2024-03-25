import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import { useTranslationWithContext } from 'hooks';

const WhatAreJourneysInformation: React.FC = () => {
    const { translate } = useTranslationWithContext();
    return (
        <Section>
            <Text>{translate('choose.journey.what.are.journeys.text')}</Text>
        </Section>
    );
};

export default WhatAreJourneysInformation;
