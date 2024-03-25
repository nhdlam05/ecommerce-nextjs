import MarkdownText from 'atoms/MarkdownText/MarkdownText';
import Section from 'atoms/Section/Section';
import { useTranslationWithContext } from 'hooks';

interface Props {
    content: string;
    link?: string;
}

const DescriptionSheet: React.FC<Props> = ({ content, link }) => {
    const { translate } = useTranslationWithContext();
    return (
        <Section spacing="s">
            <MarkdownText content={content} />
            {link && (
                <a href={link} target="_blank" rel="noreferrer">
                    {translate('generic.read.more')}
                </a>
            )}
        </Section>
    );
};

export default DescriptionSheet;
