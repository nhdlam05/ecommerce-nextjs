import { IonFooter, IonToolbar } from '@ionic/react';
import Button, { ButtonTheme, ButtonType } from 'atoms/Button/Button';
import { useTranslationWithContext } from 'hooks';
import React from 'react';
import { Translatable } from 'translation';
import './FixedActionForwardFooter.scss';

interface Props {
    label?: Translatable;
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    secondaryActionSlot?: React.ReactNode;
    starSlot?: React.ReactNode; // TODO (for Bookmark icon on content-piece)
    buttonIcon?: React.ReactNode;
    buttonType?: ButtonType;
    theme?: ButtonTheme;
}

const FixedActionForwardFooter: React.FC<Props> = ({
    label,
    onClick,
    disabled = false,
    isLoading = false,
    secondaryActionSlot,
    buttonIcon,
    buttonType,
    theme,
}) => {
    const { translate } = useTranslationWithContext();
    return (
        <IonFooter className="FixedActionForwardFooter ion-no-border">
            <IonToolbar className="FixedActionForwardFooter--toolbar">
                <div className="FixedActionForwardFooter--inner">
                    {onClick && (
                        <Button
                            theme={theme}
                            align="center"
                            size="l"
                            label={
                                label
                                    ? translate(label)
                                    : translate('generic.next')
                            }
                            onClick={onClick}
                            disabled={disabled}
                            isLoading={isLoading}
                            icon={buttonIcon}
                            type={buttonType}
                        />
                    )}

                    {secondaryActionSlot && (
                        <div className="FixedActionForwardFooter--secondary">
                            {secondaryActionSlot}
                        </div>
                    )}
                </div>
            </IonToolbar>
        </IonFooter>
    );
};

export default FixedActionForwardFooter;
