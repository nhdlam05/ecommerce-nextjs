import Button from 'atoms/Button/Button';
import { useTranslationWithContext } from 'hooks';
import DialogContent from './DialogContent';
import DialogFooter from './DialogFooter';
import DialogFullHeader from './DialogFullHeader';

interface Props {
    children: React.ReactNode;
    title?: string;
    hideModal: VoidFunction;
}

const InfoDialog: React.FC<Props> = ({ children, title, hideModal }) => {
    const { translate } = useTranslationWithContext();

    return (
        <>
            {title && (
                <DialogFullHeader
                    title={title}
                    onCloseButtonClick={hideModal}
                />
            )}
            <DialogContent>{children}</DialogContent>
            <DialogFooter>
                <Button
                    align="center"
                    label={translate('generic.go.back')}
                    onClick={hideModal}
                />
            </DialogFooter>
        </>
    );
};

export default InfoDialog;
