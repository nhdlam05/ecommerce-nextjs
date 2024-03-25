import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import Title from 'atoms/Title/Title';
import { FormContainer } from 'components/form';
import { Gender, Maybe } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useMemo, useState } from 'react';
import * as yup from 'yup';
import SelectInput from 'atoms/SelectInput/SelectInput';
import { getGenderOptions } from 'util/globalHelpers';
import Section from 'atoms/Section/Section';

export type GenderFormData = {
    gender: string;
};

interface Props {
    gender?: Maybe<Gender>;
    onSave: (formData: any) => void;
}

const GenderForm: React.FC<Props> = ({ gender, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { translate } = useTranslationWithContext();

    const schema: yup.SchemaOf<GenderFormData> = useMemo(
        () =>
            yup.object().shape({
                gender: yup.string().required(
                    translate({
                        key: 'error.field.is.required',
                    })
                ),
            }),
        [translate]
    );

    const handleSubmit = (formData: GenderFormData) => {
        setIsLoading(true);
        onSave({ ...formData });
    };

    return (
        <DialogContent>
            <FormContainer
                inputs={[
                    {
                        name: 'gender',
                        ele: (props: any) => (
                            <>
                                <Title noMargin size="s">
                                    {translate('generic.gender')}
                                </Title>
                                <Section spacingTop="s">
                                    <SelectInput
                                        {...props}
                                        items={getGenderOptions()}
                                        label={translate('generic.gender')}
                                    />
                                </Section>
                            </>
                        ),
                        col: 12,
                    },
                ]}
                schema={schema}
                onSubmit={handleSubmit}
                formOption={{
                    defaultValues: {
                        gender,
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

export default GenderForm;
