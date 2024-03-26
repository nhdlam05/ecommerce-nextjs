import Button from 'atoms/Button/Button';
import Title from 'atoms/Title/Title';
import { CgChevronLeft, CgClose } from 'react-icons/cg';
import './Dialog.scss';
import DialogHeader from './DialogHeader';

interface Props {
    title?: string;
    onBackButtonClick?: VoidFunction;
    onCloseButtonClick?: VoidFunction;
}

const DialogFullHeader: React.FC<Props> = ({
    title,
    onBackButtonClick,
    onCloseButtonClick,
}) => {
    const hideModal = () => {
        onCloseButtonClick && onCloseButtonClick();
    };

    if (title?.length === 0) return <></>;

    return (
        <DialogHeader hideModal={hideModal}>
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
            <Title size="s" align="center">
                {title}
            </Title>

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
export default DialogFullHeader;
