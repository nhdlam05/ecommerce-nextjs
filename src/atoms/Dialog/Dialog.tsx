import { forwardRef } from 'react';
import './Dialog.scss';

interface Props {
    children: React.ReactNode;
    onBackdropClicked?: VoidFunction;
    container?: 'large' | 'short' | 'tiny' | 'fullScreen';
    className?: string;
}

const Dialog = forwardRef<any, Props>(
    ({ children, onBackdropClicked, container, className }, ref) => {
        return (
            <div className={`Dialog ${className}`} ref={ref}>
                <div className="Dialog--backdrop" onClick={onBackdropClicked} />

                <div className={`Dialog--module container-${container}`}>
                    <div className="Dialog--content">{children}</div>
                </div>
            </div>
        );
    }
);

export default Dialog;
