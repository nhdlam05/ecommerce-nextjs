import Button from 'atoms/Button/Button';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';

interface Props {
    onAddEntry?: VoidFunction;
}
const NoEntry: React.FC<Props> = ({ onAddEntry }) => {
    const { translate } = useTranslationWithContext();

    return (
        <Module>
            <Section spacing="m">
                <Title size="xl" align="center">
                    {translate('provider.profile.no.entry')}
                </Title>
                {onAddEntry && (
                    <Button
                        align="center"
                        label={translate('provider.profile.add.an.entry')}
                        onClick={onAddEntry}
                    />
                )}
            </Section>
        </Module>
    );
};

export default NoEntry;
