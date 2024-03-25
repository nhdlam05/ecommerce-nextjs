import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import InputText from 'atoms/InputText/InputText';
import Title from 'atoms/Title/Title';
import { FormContainer } from 'components/form';
import { Maybe, UserName } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useMemo, useState } from 'react';
import * as yup from 'yup';

export type FullNameFormData = {
    firstName: string;
    lastName: string;
};

interface Props {
    userName?: Maybe<UserName>;
    onSave: (formData: any) => void;
}

const FullNameForm: React.FC<Props> = ({ userName, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { translate } = useTranslationWithContext();

    const schema: yup.SchemaOf<FullNameFormData> = useMemo(
        () =>
            yup.object().shape({
                firstName: yup
                    .string()
                    .trim()
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate('generic.first.name'),
                            },
                        })
                    ),
                lastName: yup
                    .string()
                    .trim()
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate('generic.last.name'),
                            },
                        })
                    ),
            }),
        [translate]
    );

    const handleSubmit = (formData: FullNameFormData) => {
        setIsLoading(true);
        onSave({ ...formData });
    };

    return (
        <DialogContent>
            <FormContainer
                inputs={[
                    {
                        name: 'firstName',
                        ele: (props: any) => (
                            <>
                                <Title size="s">
                                    {translate('generic.first.name')}
                                </Title>
                                <InputText
                                    {...props}
                                    placeholder={translate(
                                        'generic.first.name'
                                    )}
                                />
                            </>
                        ),
                        col: 12,
                    },
                    {
                        name: 'lastName',
                        ele: (props: any) => (
                            <>
                                <Title size="s">
                                    {translate('generic.last.name')}
                                </Title>
                                <InputText
                                    {...props}
                                    placeholder={translate('generic.last.name')}
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
                        firstName: userName?.firstName,
                        lastName: userName?.lastName,
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

export default FullNameForm;
