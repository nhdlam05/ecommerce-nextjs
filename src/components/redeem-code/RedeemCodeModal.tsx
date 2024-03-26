import { DialogContent } from 'atoms/Dialog';
import Section from 'atoms/Section/Section';
import { useState } from 'react';
import RedeemCode from './RedeemCode';
import RequestCode from './RequestCode';

const BODY_TYPE = {
    RedeemCode: 'RedeemCode',
    RequestCode: 'RequestCode',
};

const RedeemCodeModal = () => {
    const [bodyType, setBodyType] = useState(BODY_TYPE.RedeemCode);

    const handleShowRequestCode = () => setBodyType(BODY_TYPE.RequestCode);

    const handleShowRedeemCode = () => setBodyType(BODY_TYPE.RedeemCode);

    return (
        <DialogContent hasFooter={false}>
            <Section container="tiny">
                <Section spacingBottom="s">
                    {bodyType === BODY_TYPE.RedeemCode && (
                        <RedeemCode onShowRequestCode={handleShowRequestCode} />
                    )}
                    {bodyType === BODY_TYPE.RequestCode && (
                        <RequestCode onEnterCode={handleShowRedeemCode} />
                    )}
                </Section>
            </Section>
        </DialogContent>
    );
};

export default RedeemCodeModal;
