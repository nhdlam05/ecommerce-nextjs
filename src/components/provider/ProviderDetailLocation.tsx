import Badge from 'atoms/Badge/Badge';
import Divider from 'atoms/Divider/Divider';
import Table from 'atoms/Table/Table';
import TableItem from 'atoms/Table/TableItem';
import { GoogleMapLocations } from 'components/common';
import { Address, FunnelQuoteType } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { Optional } from 'model/common';
import React from 'react';
import ProviderDetailContentModule from './ProviderDetailContentModule';

interface Props {
    anchorId?: string;
    title?: Optional<string>;
    locations: Address[];
    offersOnlineSession: boolean;
    quoteType: FunnelQuoteType;
    variant?: 'modal' | null;
}

const ProviderDetailLocation: React.FC<Props> = ({
    anchorId,
    title,
    locations,
    offersOnlineSession,
    quoteType,
    variant,
}) => {
    const { translate } = useTranslationWithContext();
    if (locations && locations.length > 0) {
        return (
            <ProviderDetailContentModule
                variant={variant}
                anchorId={anchorId}
                title={title}
            >
                <GoogleMapLocations locations={locations} />
                <Divider spacing="xxs" invisible />
                <Table>
                    {locations.map((element, index) => {
                        return (
                            <TableItem key={index}>
                                <strong>{element.fullAddress}</strong>
                            </TableItem>
                        );
                    })}
                </Table>

                <Divider spacing="s" invisible />
                {offersOnlineSession && (
                    <Badge
                        label={translate('provider.online.offer')}
                        size="l"
                        variant="info"
                    />
                )}
            </ProviderDetailContentModule>
        );
    }

    return <></>;
};

export default ProviderDetailLocation;
