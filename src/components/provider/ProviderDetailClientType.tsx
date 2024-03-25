import Badge from 'atoms/Badge/Badge';
import { CLIENT_TYPE } from 'constants/common';
import { ProviderClientType } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { Optional } from 'model/common';
import ProviderDetailContentModule from './ProviderDetailContentModule';

interface Props {
    anchorId?: string;
    title: Optional<string>;
    items: ProviderClientType[];
    variant?: 'modal' | null;
}

const ProviderDetailClientType: React.FC<Props> = ({
    anchorId,
    title,
    items,
    variant,
}) => {
    const { translate } = useTranslationWithContext();

    if (items.length === 0) return <></>;
    return (
        <ProviderDetailContentModule
            variant={variant}
            anchorId={anchorId}
            title={title}
        >
            {items.map((item) => {
                return (
                    <Badge
                        key={item}
                        size="l"
                        label={translate(CLIENT_TYPE[item])}
                    />
                );
            })}
        </ProviderDetailContentModule>
    );
};

export default ProviderDetailClientType;
