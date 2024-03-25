import Text from 'atoms/Text/Text';
import { Optional } from 'model/common';
import Title, { TitleSize } from '../Title/Title';

interface Props {
    author?: Optional<string>;
    size?: TitleSize;
    children: React.ReactNode;
}

const Quote: React.FC<Props> = ({ author, children, size = 'xxl' }) => {
    return (
        <figure className="Quote">
            <blockquote>
                <Title font="alt" size={size}>
                    {children}
                </Title>
            </blockquote>
            {author && (
                <figcaption>
                    <Text tag="span">– {author}</Text>
                </figcaption>
            )}
        </figure>
    );
};

export default Quote;
