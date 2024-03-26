import Button from 'atoms/Button/Button';
import HeroIcon from 'atoms/HeroIcon/HeroIcon';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

interface Props {
    onEnterCode: VoidFunction;
}

const RequestCodeSuccess: React.FC<Props> = ({ onEnterCode }) => {
    const { translate } = useTranslationWithContext();

    return (
        <>
            <Section spacingBottom="l">
                <HeroIcon theme="success" align="center" size="s">
                    <IoIosCheckmarkCircleOutline />
                </HeroIcon>
                <Title size="l" align="center">
                    {translate('redeem.code.has.been.send')}
                </Title>
                <Text align="center">
                    {translate('redeem.code.check.your.email')}
                </Text>
            </Section>
            <Button
                align="center"
                label={translate('generic.enter.code')}
                onClick={onEnterCode}
            />
        </>
    );
};

export default RequestCodeSuccess;
