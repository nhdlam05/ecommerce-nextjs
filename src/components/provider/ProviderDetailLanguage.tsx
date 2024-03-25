import Badge from 'atoms/Badge/Badge';
import Divider from 'atoms/Divider/Divider';
import Text from 'atoms/Text/Text';
import { Language } from 'generated/graphql';
import { useRenderLanguage } from 'hooks';
import { Optional } from 'model/common';
import React from 'react';
import ProviderDetailContentModule from './ProviderDetailContentModule';

interface Props {
    anchorId?: string;
    title: Optional<string>;
    items: Language[];
    extraText: Optional<string>;
    variant?: 'modal' | null;
}

const ProviderDetailLanguage: React.FC<Props> = ({
    anchorId,
    title,
    items,
    extraText,
    variant,
}) => {
    const { renderLanguage } = useRenderLanguage();

    return (
        <ProviderDetailContentModule
            variant={variant}
            anchorId={anchorId}
            title={title}
        >
            {items.map((lang) => {
                return (
                    <Badge key={lang} size="l" label={renderLanguage(lang)} />
                );
            })}

            {extraText && (
                <>
                    <Divider spacing="s" />
                    <Text>{extraText}</Text>
                </>
            )}
        </ProviderDetailContentModule>
    );
};

export default ProviderDetailLanguage;
