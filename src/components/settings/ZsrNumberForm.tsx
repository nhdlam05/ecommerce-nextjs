import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import InputText from 'atoms/InputText/InputText';
import Item from 'atoms/Item';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import SelectInput from 'atoms/SelectInput/SelectInput';
import Title from 'atoms/Title/Title';
import Toggle from 'atoms/Toggle';
import { FormContainer } from 'components/form';
import { ProviderProfileModifyCallout } from 'components/provider';
import { Maybe } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useMemo, useState } from 'react';
import * as yup from 'yup';

export type ZsrNumberFormData = {
    zsrNumber?: string | null;
    zsrNumberForComplementaryInsurance?: string | null;
    hasZsrNumber?: boolean;
};

enum ZsrType {
    BaseInsurance = 'BASE_INSURACE',
    SupplementaryInsurance = 'SUPPLEMENTARY_INSURANCE',
}

interface Props {
    zsrNumber: string;
    zsrNumberForComplementaryInsurance?: Maybe<string>;
    onSave: (formData: ZsrNumberFormData) => void;
    hasWarning?: boolean;
}

const ZsrNumberForm: React.FC<Props> = ({
    zsrNumberForComplementaryInsurance,
    zsrNumber,
    onSave,
    hasWarning = false,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { translate } = useTranslationWithContext();
    const [hasZsrNumber, setHasZsrNumber] = useState(
        Boolean(zsrNumber) || Boolean(zsrNumberForComplementaryInsurance)
    );
    const [zsrType, setZsrType] = useState<ZsrType>(
        zsrNumberForComplementaryInsurance
            ? ZsrType.SupplementaryInsurance
            : ZsrType.BaseInsurance
    );

    const ZRS_TYPES = useMemo(() => {
        return [
            {
                value: ZsrType.BaseInsurance,
                label: translate('zsr.base.insurance'),
            },
            {
                value: ZsrType.SupplementaryInsurance,
                label: translate('zsr.supplementary.insurance'),
            },
        ];
    }, [translate]);

    const schema: yup.SchemaOf<ZsrNumberFormData> = useMemo(
        () =>
            yup.object().shape({
                zsrNumber: hasZsrNumber
                    ? yup
                          .string()
                          .trim()
                          .required(
                              translate({
                                  key: 'error.field.is.required',
                                  context: {
                                      fieldName:
                                          translate('generic.zsr.number'),
                                  },
                              })
                          )
                    : yup.mixed().nullable().notRequired(),
                hasZsrNumber: yup.mixed().nullable().notRequired(),
                zsrNumberForComplementaryInsurance: yup
                    .mixed()
                    .nullable()
                    .notRequired(),
            }),
        [translate, hasZsrNumber]
    );

    const onHasZsrNumberChange = () => setHasZsrNumber(!hasZsrNumber);

    const handleSubmit = (formData: ZsrNumberFormData) => {
        setIsLoading(true);
        const value = hasZsrNumber ? formData.zsrNumber : '';

        onSave(
            zsrType === ZsrType.BaseInsurance
                ? { zsrNumber: value, zsrNumberForComplementaryInsurance: null }
                : { zsrNumberForComplementaryInsurance: value, zsrNumber: null }
        );
    };

    const onZsrTypeChange = (event: any) => {
        setZsrType(event.target.value);
    };

    return (
        <DialogContent>
            {hasWarning && (
                <Section spacingTop="m">
                    <ProviderProfileModifyCallout />
                </Section>
            )}
            <FormContainer
                inputs={[
                    {
                        name: 'hasZsrNumber',
                        ele: (props: any) => (
                            <Section spacingTop="s">
                                <Module variant="modal" padding="none">
                                    <Item
                                        title={translate(
                                            hasZsrNumber
                                                ? 'provider.insurance.factor.has.zsr.number'
                                                : 'provider.insurance.factor.no.zsr.number'
                                        )}
                                        endSlot={
                                            <Toggle
                                                onChange={onHasZsrNumberChange}
                                                checked={hasZsrNumber}
                                            />
                                        }
                                    />
                                </Module>
                            </Section>
                        ),
                    },
                    {
                        name: 'zsrType',
                        ele: (props: any) => (
                            <>
                                <Section spacingBottom="s">
                                    <Title size="s" noMargin>
                                        {translate('setting.account.zsr.type')}
                                    </Title>
                                </Section>
                                <SelectInput
                                    items={ZRS_TYPES}
                                    value={zsrType}
                                    onChange={onZsrTypeChange}
                                />
                            </>
                        ),
                        col: 12,
                        isHidden: !hasZsrNumber,
                    },
                    {
                        name: 'zsrNumber',
                        ele: (props: any) => (
                            <>
                                <Section spacingBottom="s">
                                    <Title size="s" noMargin>
                                        {translate('generic.zsr.number')}
                                    </Title>
                                </Section>
                                <InputText
                                    {...props}
                                    placeholder={translate(
                                        'generic.zsr.number'
                                    )}
                                />
                            </>
                        ),
                        col: 12,
                        isHidden: !hasZsrNumber,
                    },
                ]}
                schema={schema}
                onSubmit={handleSubmit}
                formOption={{
                    defaultValues: {
                        zsrNumber: zsrNumberForComplementaryInsurance
                            ? zsrNumberForComplementaryInsurance
                            : zsrNumber,
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

export default ZsrNumberForm;
