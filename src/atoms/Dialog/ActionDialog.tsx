import Button from 'atoms/Button/Button';
import Section from 'atoms/Section/Section';
import DialogContent from './DialogContent';
import DialogFooter from './DialogFooter';
import DialogFullHeader from './DialogFullHeader';

interface Props {
    children: React.ReactNode;
    title?: string;
    hideModal: VoidFunction;
    mainButton?: any;
    secondaryButton?: any;
    forceNoSheetClosed?: boolean;
}

const ActionDialog: React.FC<Props> = ({
    children,
    title,
    hideModal,
    mainButton,
    secondaryButton,
    forceNoSheetClosed,
}) => {
    return (
        <>
            {!forceNoSheetClosed && title ? (
                <DialogFullHeader
                    title={title}
                    onCloseButtonClick={hideModal}
                />
            ) : (
                <></>
            )}

            <DialogContent hasFooter={Boolean(mainButton || secondaryButton)}>
                {children}
            </DialogContent>
            <DialogFooter>
                <Section>{mainButton && <Button {...mainButton} />}</Section>
                {secondaryButton && (
                    <Button variant="naked" {...secondaryButton} />
                )}
            </DialogFooter>
        </>
    );
};

export default ActionDialog;
