import { IonHeader, IonToolbar } from '@ionic/react';
import Button from 'atoms/Button/Button';
import ConditionalGoBackArrow from 'atoms/ConditionalGoBackArrow';
import Logo from 'atoms/Logo/Logo';
import Title from 'atoms/Title/Title';
import { AppContext } from 'context/app';
import React, { useContext } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useHistory } from 'react-router';
import './Header.scss';

interface Props {
    title?: string;
    aepsyLogo?: boolean;
    stepper?: any;
    theme?: 'dark' | 'soft' | 'nakedDark' | 'white' | 'nakedWhite' | 'green';
    hideBottomLine?: boolean;
    size?: 's' | 'm';
    backButton?: boolean;
    onBack?: () => void;
    startSlot?: any;
    endSlot?: any;
    goBackConditional?: boolean;
    forceShowBackButton?: boolean;
    additionalContent?: React.ReactNode;
    className?: string;
}

const Header: React.FC<Props> = ({
    title,
    aepsyLogo = false,
    theme = 'dark',
    hideBottomLine = false,
    size = 'm',
    backButton = false,
    onBack,
    startSlot,
    endSlot,
    stepper,
    goBackConditional,
    forceShowBackButton,
    additionalContent,
    className: customClass,
}) => {
    const history = useHistory();
    const {
        pathLocationState: { previousPath },
    } = useContext(AppContext);
    const className = [
        'Header',
        customClass ? customClass : '',
        theme !== undefined ? 'theme-' + theme : '',
        size !== undefined ? 'size-' + size : '',
        hideBottomLine ? 'hideBottomLine' : '',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    function goBackHistory() {
        if (previousPath) {
            history.goBack();
        } else {
            history.push('/');
        }
    }

    function renderBackArrow() {
        return (
            <Button
                label={<IoIosArrowBack size="26" />}
                variant="naked"
                size="s"
                onClick={onBack ? onBack : goBackHistory}
            />
        );
    }

    function renderStartSlot() {
        switch (true) {
            case Boolean(startSlot):
                return startSlot;
            case backButton:
                return renderBackArrow();
            case goBackConditional:
                return (
                    <ConditionalGoBackArrow
                        forceShowBackButton={forceShowBackButton}
                    />
                );
            default:
                return null;
        }
    }

    function renderMiddleSlot() {
        if (aepsyLogo) {
            return <Logo align="center" theme="dark" size="xs" />;
        } else if (stepper) {
            return stepper;
        } else if (title) {
            return (
                <Title tag="span" noMargin size="m" align="center">
                    {title}
                </Title>
            );
        }

        return null;
    }

    return (
        <IonHeader className="ion-no-border">
            <div className={className}>
                <IonToolbar className="Header--toolbar">
                    {additionalContent && additionalContent}
                    <div className="Header--inner">
                        {/* Start */}
                        <span className="Header--slot is-start">
                            {renderStartSlot()}
                        </span>

                        {/* Middle */}
                        <span className="Header--slot Header--content">
                            {renderMiddleSlot()}
                        </span>

                        {/* End */}
                        <span className="Header--slot is-end">{endSlot}</span>
                    </div>
                </IonToolbar>
            </div>
        </IonHeader>
    );
};

export default Header;
