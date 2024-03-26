import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import InputText from 'atoms/InputText/InputText';
import Title from 'atoms/Title/Title';
import { FormContainer } from 'components/form';
import { PHONE_REGEX } from 'constants/common';
import { useTranslationWithContext } from 'hooks';
import { Optional } from 'model/common';
import { useMemo, useState } from 'react';
import * as yup from 'yup';

export type PhoneNumberFormData = {
    phoneNumber: Optional<string>;
};

interface Props {
    phoneNumber: Optional<string>;
    onSave: (formData: any) => void;
}

const PhoneNumberForm: React.FC<Props> = ({ phoneNumber, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { translate } = useTranslationWithContext();

    const schema: yup.SchemaOf<PhoneNumberFormData> = useMemo(
        () =>
            yup.object().shape({
                phoneNumber: yup
                    .mixed()
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate('generic.phoneNumber'),
                            },
                        })
                    )
                    .test('phone', translate('error.phone.invalid'), (value) =>
                        Boolean(value.replace(/\s/g, '').match(PHONE_REGEX))
                    ),
            }),
        [translate]
    );

    const handleSubmit = (formData: PhoneNumberFormData) => {
        setIsLoading(true);
        onSave({ ...formData });
    };

    return (
        <DialogContent>
            <FormContainer
                inputs={[
                    {
                        name: 'phoneNumber',
                        ele: (props: any) => (
                            <>
                                <Title size="s">
                                    {translate('generic.phoneNumber')}
                                </Title>
                                <InputText
                                    {...props}
                                    placeholder={translate(
                                        'generic.phoneNumber'
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
                        phoneNumber,
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

export default PhoneNumberForm;
