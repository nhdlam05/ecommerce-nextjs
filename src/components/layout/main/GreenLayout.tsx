import './GreenLayout.scss';

interface Props {
    children: React.ReactNode;
}

const GreenLayout: React.FC<Props> = ({ children }) => (
    <>
        {children}
        <div className="GreenLayout"></div>
    </>
);

export default GreenLayout;
