import './BasicLayout.scss';

interface Props {
    children: React.ReactNode;
    className?: string;
}

const BasicLayout: React.FC<Props> = ({ children, className = '' }) => (
    <div className={`BasicLayout ${className}`}>{children}</div>
);

export default BasicLayout;
