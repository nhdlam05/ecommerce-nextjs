import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import InputText from 'atoms/InputText/InputText';
import Section from 'atoms/Section/Section';
import Title from 'atoms/Title/Title';
import { FormContainer } from 'components/form';
import { Address, Maybe } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useMemo, useState } from 'react';
import * as yup from 'yup';

export type BillingAddressFormData = {
    zipCode: string;
    city: string;
    streetAndNumber: string;
};

interface Props {
    billingAddress?: Maybe<Address>;
    onSave: (formData: any) => void;
}

const BillingAddressForm: React.FC<Props> = ({ billingAddress, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { translate } = useTranslationWithContext();

    const schema: yup.SchemaOf<BillingAddressFormData> = useMemo(
        () =>
            yup.object().shape({
                city: yup
                    .string()
                    .trim()
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate(
                                    'setting.account.billing.city'
                                ),
                            },
                        })
                    ),
                zipCode: yup
                    .string()
                    .trim()
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate(
                                    'setting.account.billing.zip'
                                ),
                            },
                        })
                    ),
                streetAndNumber: yup
                    .string()
                    .trim()
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate(
                                    'setting.account.billing.streetAndNumber'
                                ),
                            },
                        })
                    ),
            }),
        [translate]
    );

    const handleSubmit = (formData: BillingAddressFormData) => {
        const { zipCode, city, streetAndNumber } = formData;
        setIsLoading(true);
        onSave({
            billingAddress: {
                zipCode,
                city,
                streetAndNumber,
            },
        });
    };

    return (
        <DialogContent>
            <FormContainer
                inputs={[
                    {
                        name: 'streetAndNumber',
                        ele: (props: any) => (
                            <Section spacingTop="s">
                                <Title size="s">
                                    {translate(
                                        'setting.account.billing.streetAndNumber'
                                    )}
                                </Title>
                                <InputText
                                    {...props}
                                    placeholder={translate(
                                        'setting.account.billing.streetAndNumber.placeholder'
                                    )}
                                />
                            </Section>
                        ),
                        col: 12,
                    },
                    {
                        name: 'zipCode',
                        ele: (props: any) => (
                            <>
                                <Title size="s">
                                    {translate('setting.account.billing.zip')}
                                </Title>
                                <InputText
                                    {...props}
                                    type="numberic"
                                    placeholder={translate(
                                        'setting.account.billing.zip.placeholder'
                                    )}
                                />
                            </>
                        ),
                        col: 12,
                    },
                    {
                        name: 'city',
                        ele: (props: any) => (
                            <>
                                <Title size="s">
                                    {translate('setting.account.billing.city')}
                                </Title>
                                <InputText
                                    {...props}
                                    placeholder={translate(
                                        'setting.account.billing.city.placeholder'
                                    )}
                                />
                            </>
                        ),
                        col: 12,
                    },
                ]}
                schema={schema}
                onSubmit={handleSubmit}
                formOption={{
                    defaultValues: {
                        ...billingAddress,
                        // workaround since backend use different field for streetAndNumber
                        streetAndNumber: billingAddress?.fullAddress,
                    },
                }}
                actionButton={(props: any) => (
                    <DialogFooter>
                        <Button
                            {...props}
                            label={translate('generic.save')}
                            type="submit"
                            isLoading={isLoading}
                        />
                    </DialogFooter>
                )}
            />
        </DialogContent>
    );
};

export default BillingAddressForm;
