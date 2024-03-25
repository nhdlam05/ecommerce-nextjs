import Button from 'atoms/Button/Button';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import { AnchorLink } from 'components/common';
import { useTranslationWithContext } from 'hooks';
import { AiOutlineInfoCircle } from 'react-icons/ai';

interface Props {
    onSwitchToTherapy: VoidFunction;
}

const TherapyNudge: React.FC<Props> = ({ onSwitchToTherapy }) => {
    const { translate } = useTranslationWithContext();
    return (
        <Section spacingBottom="m">
            <Module>
                <AiOutlineInfoCircle size="26" fill="#516253" />
                <Text size="s">{translate('insurance.therapy.nudge')}</Text>
                <AnchorLink href="#book">
                    <Button
                        variant="inline"
                        label={translate('insurance.therapy.nudge.cta')}
                        onClick={onSwitchToTherapy}
                    />
                </AnchorLink>
            </Module>
        </Section>
    );
};

export default TherapyNudge;
