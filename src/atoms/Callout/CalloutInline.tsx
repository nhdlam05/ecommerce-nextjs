import Callout from './Callout';

interface Props {
    icon?: React.ReactNode;
    text: string | React.ReactNode;
}

const CalloutInline: React.FC<Props> = ({ icon, text }) => {
    return <Callout icon={icon && icon} iconSize="m" text={text} />;
};

export default CalloutInline;
