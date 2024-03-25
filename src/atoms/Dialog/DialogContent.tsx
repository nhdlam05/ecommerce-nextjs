import { forwardRef } from 'react';
import { ReactNode } from 'react-markdown';
import './Dialog.scss';

// padding note
// xs: 1 button
// s: 2 buttons

interface Props {
    children: ReactNode;
    hasFooter?: boolean;
    footerSize?: 'm' | 'l';
}

const DialogContent = forwardRef<any, Props>(
    ({ children, hasFooter = true, footerSize, ...others }, ref) => {
        return (
            <div
                className={`Dialog--contentWrapper ${
                    hasFooter ? 'has-footer' : ''
                } ${footerSize ? `footer-size-${footerSize}` : ''}`}
                {...others}
                ref={ref}
            >
                {children}
            </div>
        );
    }
);

export default DialogContent;
