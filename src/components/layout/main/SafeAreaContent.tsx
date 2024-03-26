import { IonContent } from '@ionic/react';
import { forwardRef } from 'react';
import './SafeAreaContent.scss';

export interface SafeAreaContentProps {
    children: React.ReactNode;
    scrollEvents?: any;
    ref?: any;
    onIonScroll?: (e: any) => void;
    hasFooter?: boolean;
    className?: string;
    id?: any;
}

const SafeAreaContent = forwardRef<any, SafeAreaContentProps>((props, ref) => {
    const { children, hasFooter = false, className, ...others } = props;

    return (
        <IonContent
            className={`SafeAreaContent ion-padding ${className} ${
                hasFooter ? 'has-footer' : ''
            }`}
            {...others}
            ref={ref}
        >
            {children}
        </IonContent>
    );
});

export default SafeAreaContent;
