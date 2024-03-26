import './FooterActionButton.scss';

interface Props {
    icon: React.ReactNode;
    isActive?: boolean;
}

const FooterActionButton: React.FC<Props> = ({ icon, isActive }) => {
    return (
        <div className={`FooterActionButton ${isActive ? 'is-active' : ''}`}>
            <span className="FooterActionButton--icon">{icon}</span>
        </div>
    );
};

export default FooterActionButton;
