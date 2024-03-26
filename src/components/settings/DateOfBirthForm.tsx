import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import Title from 'atoms/Title/Title';
import { FormContainer } from 'components/form';
import { Maybe } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useMemo, useState } from 'react';
import * as yup from 'yup';
import DateTimePicker from 'atoms/DateTimePicker';

export type DateOfBirthFormData = {
    dateOfBirth: string;
};

interface Props {
    dateOfBirth?: Maybe<Date>;
    onSave: (formData: any) => void;
}

const DateOfBirthForm: React.FC<Props> = ({ dateOfBirth, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { translate } = useTranslationWithContext();
    const schema: yup.SchemaOf<DateOfBirthFormData> = useMemo(
        () =>
            yup.object().shape({
                dateOfBirth: yup.mixed().required(
                    translate({
                        key: 'error.field.is.required',
                    })
                ),
            }),
        [translate]
    );
    const handleSubmit = (formData: any) => {
        setIsLoading(true);
        onSave({ dateOfBirth: formData.dateOfBirth.format('YYYY-MM-DD') });
    };

    return (
        <DialogContent>
            <FormContainer
                inputs={[
                    {
                        name: 'dateOfBirth',
                        ele: (props: any) => (
                            <>
                                <Title size="s">
                                    {translate('generic.date.of.birth')}
                                </Title>
                                <DateTimePicker
                                    {...props}
                                    presentation="date"
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
                        dateOfBirth,
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

export default DateOfBirthForm;
