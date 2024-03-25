import { CertificateItem } from 'generated/graphql';
import React from 'react';
import ProviderDetailContentModule from '../ProviderDetailContentModule';
import ProviderDetailCertificateContent from './ProviderDetailCertificateContent';

interface Props {
    anchorId?: string;
    title?: string;
    items: CertificateItem[];
    variant?: 'modal' | null;
}

const ProviderDetailCertificate: React.FC<Props> = ({
    anchorId,
    title,
    items,
    variant,
}) => {
    return (
        <ProviderDetailContentModule
            variant={variant}
            anchorId={anchorId}
            title={title}
        >
            <ProviderDetailCertificateContent items={items} />
        </ProviderDetailContentModule>
    );
};

export default ProviderDetailCertificate;
