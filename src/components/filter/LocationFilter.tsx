import Button from 'atoms/Button/Button';
import Checkbox from 'atoms/Checkbox/Checkbox';
import Divider from 'atoms/Divider/Divider';
import { HowDoesOnlineWorkModal } from 'components/modals';
import { DialogMode, ModalContext } from 'context/modal';
import { Booking, BookingLocationType, ProviderArea } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useContext, useEffect, useState } from 'react';
import Title from 'atoms/Title/Title';
import { Grid } from '@mui/material';
import Section from 'atoms/Section/Section';
import { PROVIDER_AREA_DATA } from 'constants/providerArea';
import Callout from 'atoms/Callout';
import { logFirebaseEvent } from 'service/auth';

export const ANY_VALUE = 'LOCATION_ANY';

interface Props {
    defaultValues: ProviderArea[];
    defaultLocationType: BookingLocationType;
    onChange: (data: {
        providerAreas: ProviderArea[];
        locationType: BookingLocationType | null;
    }) => void;
}

const LocationFilter: React.FC<Props> = ({
    defaultValues,
    defaultLocationType,
    onChange,
}) => {
    const { showModal } = useContext(ModalContext);
    const [providerAreas, setProviderAreas] =
        useState<ProviderArea[]>(defaultValues);
    const { translate } = useTranslationWithContext();

    const [viewAll, setViewAll] = useState(false);
    const [locationType, setLocationType] = useState<
        BookingLocationType | 'LOCATION_ANY'
    >(defaultLocationType);
    const hasOnlineOption =
        locationType === BookingLocationType.Online ||
        locationType === BookingLocationType.All;

    const handleChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        const newProviderAreas = checked
            ? [...providerAreas, value]
            : [...providerAreas].filter((item: ProviderArea) => item !== value);
        setProviderAreas(newProviderAreas);

        const newLocationType = getLocationType(newProviderAreas);
        onChange({
            providerAreas: newProviderAreas,
            locationType: newLocationType,
        });
        logFirebaseEvent('location_filter_choice_clicked', {
            choices: newProviderAreas,
            locationType: newLocationType,
        });
    };

    const getLocationType = (providerAreas: ProviderArea[]) => {
        if (providerAreas.length > 0) {
            return hasOnlineOption
                ? BookingLocationType.All
                : BookingLocationType.InPerson;
        }
        if (hasOnlineOption) return BookingLocationType.Online;
        return null;
    };

    const onLocationChange = (e: any) => {
        const {
            target: { checked },
        } = e;
        let newLocationtype: BookingLocationType | 'LOCATION_ANY';

        if (checked) {
            newLocationtype =
                providerAreas.length > 0
                    ? BookingLocationType.All
                    : BookingLocationType.Online;
        } else {
            newLocationtype =
                providerAreas.length > 0
                    ? BookingLocationType.InPerson
                    : 'LOCATION_ANY';
        }
        setLocationType(newLocationtype);

        onChange({
            providerAreas,
            locationType:
                newLocationtype === 'LOCATION_ANY' ? null : newLocationtype,
        });

        logFirebaseEvent('location_filter_choice_clicked', {
            choices: providerAreas,
            locationType:
                newLocationtype === 'LOCATION_ANY' ? null : newLocationtype,
        });
    };

    const onShowHowDoesOnlineWorkModal = () =>
        showModal(<HowDoesOnlineWorkModal />, {
            title: translate('provider.search.how.does.online.work'),
            mode: DialogMode.Info,
            isExtralModal: true,
        });

    const onToggleViewAll = () => setViewAll(!viewAll);

    const renderCount = () => {
        let count = 0;
        count += providerAreas.length > 0 ? providerAreas.length : 0;
        count += hasOnlineOption ? 1 : 0;
        return count;
    };

    useEffect(() => {
        if (defaultValues) setProviderAreas(defaultValues);
        if (defaultLocationType) setLocationType(defaultLocationType);
    }, [defaultValues, defaultLocationType]);

    return (
        <>
            <div className="FilterSelectionDetail--title">
                <Title size="m">
                    {translate('provider.search.filter.location.title')}{' '}
                    {`(${renderCount()})`}
                </Title>
            </div>
            <div className="FilterSelection--multiChoice-wrapper">
                <Checkbox
                    id={BookingLocationType.Online}
                    value={BookingLocationType.Online}
                    type="checkbox"
                    variant="inline"
                    name={BookingLocationType.Online}
                    align="left"
                    onChange={onLocationChange}
                    checked={hasOnlineOption}
                >
                    Online
                </Checkbox>
                {locationType === ANY_VALUE ||
                locationType === BookingLocationType.InPerson ? (
                    <Section spacingBottom="xs">
                        <Callout
                            icon="ℹ️"
                            title={translate(
                                'provider.search.online.nudge.title'
                            )}
                            text={translate(
                                'provider.search.online.nudge.subtitle'
                            )}
                        />
                    </Section>
                ) : (
                    <></>
                )}
                <Button
                    variant="inline"
                    onClick={onShowHowDoesOnlineWorkModal}
                    label={translate('provider.search.how.does.online.work')}
                />
                <Divider spacing="xs" />
                <Grid
                    container
                    className={`FilterSelection--toggle ${
                        viewAll ? 'view-all' : ''
                    }`}
                >
                    {PROVIDER_AREA_DATA.filter(
                        (item: any) => item.value !== ProviderArea.Other
                    ).map((item: any) => (
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            key={item.value}
                        >
                            <Checkbox
                                id={item.value}
                                value={item.value}
                                type="checkbox"
                                variant="inline"
                                name={item.value}
                                align="left"
                                onChange={handleChange}
                                checked={providerAreas.includes(item.value)}
                            >
                                {translate(item.label)}
                            </Checkbox>
                        </Grid>
                    ))}
                </Grid>
                <Section spacingBottom="s">
                    <Button
                        variant="inline"
                        label={translate(
                            viewAll ? 'generic.showLess' : 'generic.showMore'
                        )}
                        onClick={onToggleViewAll}
                    />
                </Section>
            </div>
        </>
    );
};

export default LocationFilter;
