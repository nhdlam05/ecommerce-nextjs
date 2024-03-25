import Button from 'atoms/Button/Button';
import { CgChevronLeft, CgClose } from 'react-icons/cg';
import './Dialog.scss';
import DialogHeader from './DialogHeader';

interface Props {
    onBackButtonClick?: VoidFunction;
    onCloseButtonClick?: VoidFunction;
    hasDragIndicator?: boolean;
}

const DialogHeaderNoTitle: React.FC<Props> = ({
    onBackButtonClick,
    onCloseButtonClick,
    hasDragIndicator,
}) => {
    const hideModal = () => {
        onCloseButtonClick && onCloseButtonClick();
    };

    return (
        <DialogHeader
            hideModal={hideModal}
            hasDivider={false}
            hasDragIndicator={hasDragIndicator}
            className="no-padding"
        >
            {onBackButtonClick && (
                <div className="DialogFullHeader--left">
                    <Button
                        size="l"
                        variant="inline"
                        label={<CgChevronLeft size="25" />}
                        onClick={onBackButtonClick}
                    />
                </div>
            )}

            {onCloseButtonClick && (
                <div className="DialogFullHeader--right">
                    <Button
                        size="l"
                        variant="inline"
                        label={<CgClose size="22" />}
                        onClick={onCloseButtonClick}
                    />
                </div>
            )}
        </DialogHeader>
    );
};
export default DialogHeaderNoTitle;
