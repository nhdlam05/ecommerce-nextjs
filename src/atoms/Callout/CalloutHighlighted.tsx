import Callout from './Callout';

interface Props {
    icon?: React.ReactNode;
    title: string;
    text: string | React.ReactNode;
}

const CalloutHighlighted: React.FC<Props> = ({ icon, title, text }) => {
    return (
        <Callout icon={icon && icon} iconSize="l" title={title} text={text} />
    );
};

export default CalloutHighlighted;
