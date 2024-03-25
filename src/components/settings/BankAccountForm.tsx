import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import InputText from 'atoms/InputText/InputText';
import Section from 'atoms/Section/Section';
import Title from 'atoms/Title/Title';
import { FormContainer } from 'components/form';
import { Maybe, PersonalBillingAddress } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useMemo, useState } from 'react';
import * as yup from 'yup';

export type BankAccountFormData = {
    bankAccountNumber: string;
    companyName?: string;
    zipCode: string;
    city: string;
    streetAndNumber: string;
};

interface Props {
    personalBillingAddress?: Maybe<PersonalBillingAddress>;
    bankAccountNumber: string;
    onSave: (formData: any) => void;
}

const BankAccountForm: React.FC<Props> = ({
    bankAccountNumber,
    personalBillingAddress,
    onSave,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { translate } = useTranslationWithContext();

    const schema: yup.SchemaOf<BankAccountFormData> = useMemo(
        () =>
            yup.object().shape({
                bankAccountNumber: yup
                    .string()
                    .trim()
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate('generic.bank.account'),
                            },
                        })
                    ),
                companyName: yup.string().notRequired(),
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

    const handleSubmit = (formData: BankAccountFormData) => {
        setIsLoading(true);
        const {
            bankAccountNumber,
            companyName,
            zipCode,
            city,
            streetAndNumber,
        } = formData;
        onSave({
            bankAccountNumber,
            personalBillingAddress: {
                zipCode,
                city,
                streetAndNumber,
                companyName,
            },
        });
    };

    return (
        <DialogContent>
            <FormContainer
                inputs={[
                    {
                        name: 'bankAccountNumber',
                        ele: (props: any) => (
                            <Section spacingTop="s">
                                <Title size="s">
                                    {translate('generic.bank.account')}
                                </Title>
                                <InputText
                                    {...props}
                                    placeholder={translate(
                                        'generic.bank.account.placeholder'
                                    )}
                                />
                            </Section>
                        ),
                        col: 12,
                    },
                    {
                        name: 'companyName',
                        ele: (props: any) => (
                            <>
                                <Title size="s">
                                    {translate(
                                        'setting.account.billing.companyName'
                                    )}
                                </Title>
                                <InputText
                                    {...props}
                                    placeholder={translate(
                                        'setting.account.billing.companyName.placeholder'
                                    )}
                                />
                            </>
                        ),
                        col: 12,
                    },
                    {
                        name: 'streetAndNumber',
                        ele: (props: any) => (
                            <>
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
                            </>
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
                        bankAccountNumber,
                        ...personalBillingAddress,
                        companyName: personalBillingAddress?.companyName || '',
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

export default BankAccountForm;
