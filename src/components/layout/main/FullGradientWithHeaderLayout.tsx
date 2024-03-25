import Button from 'atoms/Button/Button';
import { Header } from 'components/layout/header';
import { FullGradientLayout } from 'components/layout/main';
import { RiAccountCircleFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
    headerTitle?: string;
    height?: 'full' | 'half' | 'third';
    backButton?: boolean;
    onBack?: VoidFunction;
}

const FullGradientWithHeaderLayout: React.FC<Props> = ({
    height,
    headerTitle,
    children,
    backButton = true,
    onBack,
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
        <FullGradientLayout height={height}>
            <Header
                aepsyLogo={!headerTitle}
                theme="nakedWhite"
                title={headerTitle}
                backButton={backButton}
                endSlot={renderHeaderEndSlot()}
                onBack={onBack}
            />
            {children}
        </FullGradientLayout>
    );
};

export default FullGradientWithHeaderLayout;
