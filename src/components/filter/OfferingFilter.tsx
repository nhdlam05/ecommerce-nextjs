import Checkbox from 'atoms/Checkbox/Checkbox';
import { CLIENT_TYPES } from 'constants/common';
import { ProviderClientType } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useEffect, useState } from 'react';
import Title from 'atoms/Title/Title';
import { Grid } from '@mui/material';
import { logFirebaseEvent } from 'service/auth';

interface Props {
    defaultValues: ProviderClientType[];
    onChange: (data: { clientTypes: ProviderClientType[] }) => void;
}

const OfferingFilter: React.FC<Props> = ({ defaultValues, onChange }) => {
    const [clientTypes, setClientTypes] =
        useState<ProviderClientType[]>(defaultValues);
    const { translate } = useTranslationWithContext();

    const handleChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        const newValue = checked
            ? [...clientTypes, value]
            : clientTypes.filter(
                  (item: ProviderClientType | null) => item !== value
              );

        setClientTypes(newValue);
        onChange({ clientTypes: newValue });
        logFirebaseEvent('client_type_filter_choice_clicked', {
            choices: [newValue],
        });
    };

    useEffect(() => {
        if (defaultValues) setClientTypes(defaultValues);
    }, [defaultValues]);

    return (
        <>
            <div className="FilterSelectionDetail--title">
                <Title size="m">
                    {translate('provider.search.filter.offering.title')}{' '}
                    {clientTypes.length > 0 ? `(${clientTypes.length})` : ''}
                </Title>
            </div>
            <div className="FilterSelection--multiChoice-wrapper">
                <Grid container>
                    {CLIENT_TYPES.map((item: any) => (
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            key={item.clientType}
                        >
                            <Checkbox
                                id={item.clientType}
                                value={item.clientType}
                                type="checkbox"
                                variant="inline"
                                name={item.clientType}
                                align="left"
                                checked={clientTypes.includes(item.clientType)}
                                onChange={handleChange}
                            >
                                {translate(item.label)}
                            </Checkbox>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </>
    );
};

export default OfferingFilter;
