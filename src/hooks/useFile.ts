import { useToast, useTranslationWithContext } from 'hooks';
import useAlert from 'hooks/useAlert';

export const useFile = () => {
    const { showToast } = useToast();
    const { presentAlert } = useAlert();
    const { translate } = useTranslationWithContext();

    const resolveFile = ({
        acceptedFileTypes,
        type,
        size,
        maxSize,
        onSubmit,
        onCancel,
    }: any) => {
        if (!acceptedFileTypes.includes(type)) {
            showToast({
                message: translate('upload.file.file.type.error'),
                position: 'bottom',
                color: 'primary',
            });
            onCancel && onCancel();
            return;
        }

        if (size > maxSize) {
            showToast({
                message: translate({
                    key: 'upload.file.file.size.error',
                    context: {
                        maxSize: `${maxSize / 1000000}mb`,
                    },
                }),
                position: 'bottom',
                color: 'primary',
            });
            onCancel && onCancel();
            return;
        }

        presentAlert(
            translate('upload.file.confirm.title'),
            undefined,
            onSubmit,
            onCancel
        );
    };

    const uploadFailed = () => {
        showToast({
            message: translate('upload.file.error'),
            position: 'bottom',
            color: 'primary',
        });
    };

    return { resolveFile, uploadFailed };
};
