import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, GridSize, GridSpacing } from '@mui/material';
import Button from 'atoms/Button/Button';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import { get, isEmpty, keys, omit } from 'lodash';
import React from 'react';
import { Controller, useForm, UseFormProps } from 'react-hook-form';
import { AnyObjectSchema } from 'yup';
import './FormContainer.scss';

const GRID_FULL_WIDTH = 12;

type InputData = {
    name: string;
    ele?: any;
    plainEle?: React.ReactNode;
    col?: GridSize;
    isHidden?: boolean;
    disabled?: boolean;
};

interface Props {
    schema?: AnyObjectSchema;
    inputs: InputData[];
    buttonLabel?: string;
    isLoading?: boolean;
    errorMessage?: string | React.ReactNode;
    formOption?: UseFormProps;
    actionButton?: any;
    onSubmit: (data: any) => void;
    spacing?: GridSpacing;
}

const addPropsToInput =
    (props: any, InputComponent: any) =>
    ({ field }: any) => {
        // TODO: investigate is ref of react hook necessary
        const rest = omit(field, 'ref');
        return <InputComponent {...props} {...rest} />;
    };

const FormContainer: React.FC<Props> = ({
    schema,
    inputs,
    buttonLabel,
    isLoading,
    formOption,
    errorMessage,
    actionButton: ActionButton,
    spacing = 4,
    onSubmit,
}) => {
    const schemaOption = schema ? { resolver: yupResolver(schema) } : {};
    const {
        control,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
    } = useForm({
        mode: 'onBlur',
        ...formOption,
        ...schemaOption,
    });

    const formatDataBeforeSubmit = (formData: any) => {
        const formatedData = keys(formData).reduce(
            (acc, key) => ({
                ...acc,
                [key]:
                    typeof formData[key] === 'string'
                        ? formData[key].trim()
                        : formData[key],
            }),
            {}
        );
        onSubmit(formatedData);
    };

    return (
        <form onSubmit={handleSubmit(formatDataBeforeSubmit)}>
            <Grid
                container
                spacing={spacing}
                className={`FormContainer ${isDirty ? 'form-dirty' : ''}`}
            >
                {inputs.map(
                    ({
                        name,
                        ele,
                        plainEle,
                        col,
                        isHidden = false,
                        disabled = false,
                    }: InputData) => (
                        <React.Fragment key={name}>
                            {isHidden ? null : (
                                <>
                                    {plainEle && (
                                        <div
                                            style={{
                                                padding: `0 ${
                                                    (spacing as number) * 8
                                                }px`,
                                                width: '100%',
                                            }}
                                        >
                                            {plainEle}
                                        </div>
                                    )}
                                    {ele && (
                                        <Grid
                                            item
                                            xs={GRID_FULL_WIDTH}
                                            sm={col || GRID_FULL_WIDTH}
                                            className={
                                                disabled ? 'disabled' : ''
                                            }
                                        >
                                            <Controller
                                                defaultValue=""
                                                control={control}
                                                name={name}
                                                render={addPropsToInput(
                                                    {
                                                        error: Boolean(
                                                            errors?.[name]
                                                        ),
                                                        helperText:
                                                            errors?.[name]
                                                                ?.message,
                                                    },
                                                    ele
                                                )}
                                            />
                                        </Grid>
                                    )}
                                </>
                            )}
                        </React.Fragment>
                    )
                )}
            </Grid>

            {errorMessage && (
                <Section spacing="s">
                    <Text theme="danger">{errorMessage}</Text>
                </Section>
            )}
            {buttonLabel && (
                <div className="g_center">
                    <Button
                        disabled={!isEmpty(errors)}
                        isLoading={isLoading}
                        size="l"
                        label={buttonLabel}
                        type="submit"
                    />
                </div>
            )}

            {ActionButton && (
                <ActionButton
                    isValid={isEmpty(errors)}
                    allDirty={
                        keys(dirtyFields).length >=
                        keys(get(schema, 'fields', {})).length
                    }
                />
            )}
        </form>
    );
};
export default FormContainer;
