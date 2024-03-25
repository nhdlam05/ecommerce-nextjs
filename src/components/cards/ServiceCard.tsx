import Button from 'atoms/Button/Button';
import Image from 'atoms/Image/Image';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import { MouseEvent, useState } from 'react';
import { AiTwotoneStar } from 'react-icons/ai';
import './ServiceCard.scss';

interface Props {
    title: string;
    button: {
        label: string;
        onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    };
    subtitle?: string;
    isSuggested?: boolean;
    minimalLayout?: boolean;
    children?: React.ReactNode;
    image?: {
        src: string;
        alt: string;
    };
    topSlot?: React.ReactNode;
}

const ServiceCard: React.FC<Props> = ({
    isSuggested = false,
    minimalLayout,
    image,
    title,
    subtitle,
    children,
    button,
    topSlot,
}) => {
    const { translate } = useTranslationWithContext();
    const [showMoreInfo, setShowMoreInfo] = useState(false);

    const classNames = `ServiceCard ${
        minimalLayout && !showMoreInfo ? 'hide-image' : ''
    }`;

    function handleShowMore() {
        setShowMoreInfo(!showMoreInfo);
    }

    function renderCollapsableContent() {
        return (
            <>
                <Button
                    label={
                        showMoreInfo
                            ? translate('generic.showLess')
                            : translate('generic.learnMore')
                    }
                    variant="naked"
                    align="center"
                    onClick={handleShowMore}
                />
                {showMoreInfo && <Text tag="div">{children}</Text>}
            </>
        );
    }

    return (
        <div className={classNames}>
            {isSuggested && (
                <div className="FlashyHighlight">
                    <i>
                        <AiTwotoneStar size={16} />
                    </i>
                </div>
            )}

            <Module radius="l" highlighted={isSuggested} padding="l">
                {image && (
                    <div className="ServiceCard--image">
                        {<Image src={image.src} alt={image.alt} size="m" />}
                    </div>
                )}

                {topSlot && topSlot}

                <Title size="l" align="center">
                    {title}
                </Title>
                {subtitle && (
                    <Text size="m" align="center">
                        {subtitle}
                    </Text>
                )}

                {children && renderCollapsableContent()}

                {(!minimalLayout || showMoreInfo) && (
                    <Section spacingTop="xs">
                        <Button
                            size="l"
                            align="center"
                            label={button.label}
                            onClick={button.onClick}
                        />
                    </Section>
                )}
            </Module>
        </div>
    );
};

export default ServiceCard;
