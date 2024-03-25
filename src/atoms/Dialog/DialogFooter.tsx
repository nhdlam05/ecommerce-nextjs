import './Dialog.scss';

interface Props {
    className?: string;
    children: React.ReactNode;
    backgroundTransparent?: boolean;
}

const DialogFooter: React.FC<Props> = ({
    children,
    className,
    backgroundTransparent = true,
}) => {
    return (
        <div
            className={`Dialog--footer ${className} ${
                backgroundTransparent ? '' : 'bg-white'
            }`}
        >
            {children}
        </div>
    );
};
export default DialogFooter;
