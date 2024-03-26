import Button from 'atoms/Button/Button';
import { Header } from 'components/layout/header';
import { RiAccountCircleFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import GreenLayout from './GreenLayout';

interface Props {
    children: React.ReactNode;
    headerTitle?: string;
    backButton?: boolean;
}

const GreenWithHeaderLayout: React.FC<Props> = ({
    headerTitle,
    children,
    backButton = true,
}) => {
    const renderHeaderEndSlot = () => (
        <Link to="/settings">
            <Button
                label={<RiAccountCircleFill size="24" />}
                size="s"
                variant="naked"
            ></Button>
        </Link>
    );

    return (
        <GreenLayout>
            <Header
                aepsyLogo={!headerTitle}
                theme="green"
                title={headerTitle}
                backButton={backButton}
                endSlot={renderHeaderEndSlot()}
            />
            {children}
        </GreenLayout>
    );
};

export default GreenWithHeaderLayout;
