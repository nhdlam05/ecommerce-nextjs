import Button, { ButtonTheme } from 'atoms/Button/Button';
import ClickableComponent from 'atoms/ClickableComponent';
import Module from 'atoms/Module/Module';
import { useTranslationWithContext } from 'hooks';
import { Optional } from 'model/common';
import React from 'react';
import { Translatable } from 'translation';
import './SessionCard.scss';

export interface SessionCardButtonProps {
    label: Translatable;
    onClick: () => void;
    variant: 'primary' | 'inline' | 'naked';
    theme?: ButtonTheme;
    disabled?: boolean;
}

interface Props {
    children: React.ReactNode;
    mainButton?: SessionCardButtonProps;
    secondaryButton?: Optional<SessionCardButtonProps>;
    onClick?: VoidFunction;
}

const SessionCard: React.FC<Props> = ({
    children,
    mainButton,
    secondaryButton,
    onClick,
}) => {
    const { translate } = useTranslationWithContext();

    function renderButton(buttonProp: SessionCardButtonProps) {
        if (!buttonProp) {
            return null;
        }

        return (
            <Button
                align="center"
                size="l"
                disabled={buttonProp.disabled}
                variant={buttonProp.variant}
                theme={buttonProp.theme}
                onClick={buttonProp.onClick}
                label={translate(buttonProp.label)}
            />
        );
    }

    function renderSecondaryButton(buttonProp: SessionCardButtonProps) {
        if (!buttonProp) {
            return null;
        }

        return (
            <Button
                align="center"
                size="m"
                variant="naked"
                onClick={buttonProp.onClick}
                label={translate(buttonProp.label)}
            />
        );
    }

    function handleClicked() {
        onClick && onClick();
    }

    return (
        <div className="SessionCard">
            <Module radius="l" padding="m" highlighted>
                <ClickableComponent onClick={handleClicked}>
                    {children}
                </ClickableComponent>

                <div className="SessionCard--actions">
                    {mainButton && renderButton(mainButton)}
                    {secondaryButton && renderSecondaryButton(secondaryButton)}
                </div>
            </Module>
        </div>
    );
};

export default SessionCard;
