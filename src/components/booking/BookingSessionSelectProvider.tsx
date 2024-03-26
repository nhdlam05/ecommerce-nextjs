import Button from 'atoms/Button/Button';
import Section from 'atoms/Section/Section';
import SelectInput from 'atoms/SelectInput/SelectInput';
import { Provider } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { buildFullName } from 'model/user';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type SelectFieldData = {
    providerId: string;
};

interface Props {
    handleProviderChosen: (providerId: string) => void;
    providers: Provider[];
}

const BookingSessionSelectProvider: React.FC<Props> = ({
    providers,
    handleProviderChosen,
}) => {
    const { translate } = useTranslationWithContext();
    const className = ['gf gf_h_center'].join(' ').replace(/\s{2,}/g, ' ');

    const {
        control,
        formState: { errors },
    } = useForm<SelectFieldData>();

    const [selected, setSelected] = useState(providers[0].userInfo.firebaseUid);

    function handleSelectSwitch(target: any) {
        setSelected(target.value);
    }

    function handleConfirm() {
        handleProviderChosen(selected);
    }

    const providerOption = providers.map((p) => ({
        label: buildFullName(p.userName),
        value: p.userInfo.firebaseUid,
    }));

    return (
        <>
            <div className={className}>
                <div className="gfItem_stretch">
                    <Controller
                        name="providerId"
                        defaultValue={providers[0].userInfo.firebaseUid}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <SelectInput
                                items={providerOption}
                                id="providerId"
                                value={value}
                                onChange={async (event: any) => {
                                    onChange(event);
                                    handleSelectSwitch(event.target);
                                }}
                                error={!!errors.providerId}
                                helperText={errors?.providerId?.message}
                            />
                        )}
                    />
                </div>
            </div>
            <Section spacingBottom="s" spacingTop="s">
                <div className="g_center">
                    <Button
                        label={translate('generic.next')}
                        onClick={handleConfirm}
                        size="l"
                    />
                </div>
            </Section>
        </>
    );
};

export default BookingSessionSelectProvider;
