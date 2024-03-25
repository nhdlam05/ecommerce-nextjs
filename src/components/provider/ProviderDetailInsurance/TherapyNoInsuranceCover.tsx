import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import { useTranslationWithContext } from 'hooks';
import { AiOutlineInfoCircle } from 'react-icons/ai';

interface Props {
    variant?: 'modal' | null;
}

const TherapyNoInsuranceCover: React.FC<Props> = ({ variant }) => {
    const { translate } = useTranslationWithContext();
    return (
        <Section spacingBottom="m">
            <Module variant={variant}>
                <AiOutlineInfoCircle size="26" fill="#516253" />
                <Text size="s">{translate('insurance.therapy.not.cover')}</Text>
            </Module>
        </Section>
    );
};

export default TherapyNoInsuranceCover;
