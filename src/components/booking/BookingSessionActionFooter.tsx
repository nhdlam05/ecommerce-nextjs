import Button, { ButtonType } from 'atoms/Button/Button';
import Section from 'atoms/Section/Section';
import { useTranslationWithContext } from 'hooks';
import React from 'react';
import './BookingSessionActionFooter.scss';
import { IonFooter, IonToolbar } from '@ionic/react';

interface Props {
    onMainActionClick: () => void;
    onPrivacyClick?: () => void;
    mainActionDisabled?: boolean;
    isValid?: boolean;
    type?: ButtonType;
    mainButtonLabel?: string;
    isLoading?: boolean;
    additionContent?: any;
    className?: string;
}

const BookingSessionActionFooter: React.FC<Props> = ({
    mainActionDisabled = false,
    onMainActionClick,
    onPrivacyClick,
    isValid = true,
    isLoading = false,
    type = 'button',
    mainButtonLabel,
    additionContent,
    className = '',
}) => {
    const { translate } = useTranslationWithContext();

    const startSlotClass = [
        'BookingSessionActionFooter--slot',
        'is-start',
        onPrivacyClick && 'is-visible',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <div className={`BookingSessionActionFooter ${className}`}>
            <Section spacingTop="s">
                <div className="BookingSessionActionFooter--inner gf gf_h_apart">
                    {/* Start Slot */}
                    <div className={startSlotClass}>
                        {onPrivacyClick && (
                            <Button
                                size="s"
                                variant="inline"
                                label={translate(
                                    'dialog.booking.session.privacy.title'
                                )}
                                onClick={onPrivacyClick}
                            />
                        )}
                    </div>

                    {/* Middle Slot */}
                    <div className="BookingSessionActionFooter--slot is-middle">
                        <Button
                            isLoading={isLoading}
                            type={type}
                            size="m"
                            disabled={mainActionDisabled || !isValid}
                            isMobileFullsize
                            label={mainButtonLabel || translate('generic.next')}
                            onClick={onMainActionClick}
                        />
                    </div>

                    {/* End Slot */}
                    <div className="BookingSessionActionFooter--slot"></div>
                </div>
            </Section>
            {additionContent && additionContent}
        </div>
    );
};

export default BookingSessionActionFooter;
