import { IonAlert } from '@ionic/react';
import { useTranslationWithContext } from 'hooks';
import React from 'react';
import './AlertModal.scss';

export interface AlertButtonProps {
    label: string;
    onClick: () => void;
}

interface Props {
    isShown: boolean;
    title?: string;
    subtitle?: string;
    message?: string;
    mainButton: AlertButtonProps;
    secondaryButton?: AlertButtonProps;
    onDismiss?: () => void;
}

const AlertModal: React.FC<Props> = ({
    isShown,
    title,
    subtitle,
    message,
    mainButton,
    secondaryButton,
    onDismiss,
}) => {
    const { translate } = useTranslationWithContext();

    const buttons = React.useMemo(() => {
        const primaryButton = {
            text: mainButton.label,
            handler: mainButton?.onClick,
        };

        return [
            ...(secondaryButton
                ? [
                      {
                          text: 'back' || null,
                          role: 'cancel' || null,
                          cssClass: 'secondary' || null,
                          handler: secondaryButton?.onClick,
                      },
                  ]
                : []),
            primaryButton,
        ];
    }, [mainButton, secondaryButton]);

    return (
        <div className="AlertModal">
            <IonAlert
                isOpen={isShown}
                onDidDismiss={onDismiss}
                cssClass="AlertModal--inner"
                header={title}
                subHeader={subtitle}
                message={message}
                buttons={buttons}
            />
        </div>
    );
};

export default AlertModal;
