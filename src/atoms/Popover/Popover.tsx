import { IonContent, IonPopover } from '@ionic/react';
import { DialogFooter } from 'atoms/Dialog';
import { useEffect, useState } from 'react';
import './Popover.scss';

interface Props {
    name: string;
    content: any;
    footer?: any;
    active?: boolean;
    controller?: any;
    controllerProps?: any;
    option?: any;
    className?: string;
}
const Popover: React.FC<Props> = ({
    name,
    content,
    footer,
    active = false,
    controllerProps = {},
    controller: Controller,
    option = {},
    className = '',
}) => {
    const popoverOption = {
        arrow: false,
        showBackdrop: false,
        alignment: 'start',
        ...option,
    };
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);
    const onClose = () => setIsOpen(false);

    const renderContent = () => {
        if (typeof content === 'object') {
            return content;
        }

        const Content = content;
        return <Content onClose={onClose} />;
    };

    const renderFooter = () => {
        if (!footer) return <></>;
        if (typeof footer === 'object') {
            return <DialogFooter>{footer}</DialogFooter>;
        }

        const Footer = footer;
        return (
            <DialogFooter>
                <Footer onClose={onClose} />
            </DialogFooter>
        );
    };

    useEffect(() => {
        return () => {
            setIsOpen(false);
        };
    }, []);

    return (
        <div className={`Popover ${isOpen ? 'Popover--is-open' : ''}`}>
            <Controller
                isOpen={isOpen}
                active={active}
                onClick={toggleOpen}
                name={name}
                {...controllerProps}
            />
            <IonPopover
                isOpen={isOpen}
                className={`Popover--wrapper ${className}`}
                trigger={`Popover-${name}`}
                onDidDismiss={onClose}
                {...popoverOption}
            >
                <IonContent className="Popover--content">
                    <div
                        className={`Popover--contentWrapper ${
                            footer ? 'has-footer' : ''
                        }`}
                    >
                        {renderContent()}
                    </div>
                </IonContent>
                {renderFooter()}
            </IonPopover>
        </div>
    );
};

export default Popover;
