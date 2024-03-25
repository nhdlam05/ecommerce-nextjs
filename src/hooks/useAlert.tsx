import { useIonAlert } from '@ionic/react';
import { Optional } from 'model/common';
import { useTranslationWithContext } from '.';

const useAlert = () => {
    const { translate } = useTranslationWithContext();
    const [present, dismiss] = useIonAlert();

    function presentAlert(
        header: string,
        content: Optional<string>,
        onConfirm: () => Promise<void>,
        onCancel?: () => Promise<void>
    ) {
        if (!content) {
            present({
                header,
                buttons: [
                    {
                        text: translate('generic.cancel'),
                        handler: onCancel,
                    },
                    {
                        text: translate('generic.confirm'),
                        handler: () => {
                            dismiss();
                            onConfirm();
                        },
                    },
                ],
                backdropDismiss: false,
            });
        } else {
            present({
                header,
                message: content,
                buttons: [
                    translate('generic.cancel'),
                    {
                        text: translate('generic.confirm'),
                        handler: () => {
                            dismiss();
                            onConfirm();
                        },
                    },
                ],
                onDidDismiss: onCancel,
            });
        }
    }

    return { presentAlert };
};

export default useAlert;
