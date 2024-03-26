import DialogFullHeader from './DialogFullHeader';

interface Props {
    children: React.ReactNode;
    title?: string;
    hideModal: VoidFunction;
}

const CustomDialog: React.FC<Props> = ({ children, title, hideModal }) => {
    return (
        <>
            {title && (
                <DialogFullHeader
                    title={title}
                    onCloseButtonClick={hideModal}
                />
            )}

            {children}
        </>
    );
};

export default CustomDialog;
