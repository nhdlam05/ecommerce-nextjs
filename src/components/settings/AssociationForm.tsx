import Button from 'atoms/Button/Button';
import Checkbox from 'atoms/Checkbox/Checkbox';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import Item from 'atoms/Item';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Toggle from 'atoms/Toggle';
import { FormContainer } from 'components/form';
import { RegisteredAssociation } from 'constants/common';
import { Maybe } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { isEmpty } from 'lodash';
import { useState } from 'react';

interface Props {
    associations: Maybe<string[]> | undefined;
    onSave: (associations: { associations: any }) => void;
}

const REGISTERED_ASSOCIATIONS = [
    {
        value: RegisteredAssociation.FSP,
        label: RegisteredAssociation.FSP,
    },
    {
        value: RegisteredAssociation.SBAP,
        label: RegisteredAssociation.SBAP,
    },
    {
        value: RegisteredAssociation.ASP,
        label: RegisteredAssociation.ASP,
    },
];

const AssociationForm: React.FC<Props> = ({
    associations: defaultAssociations,
    onSave,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { translate } = useTranslationWithContext();
    const [hasAssociations, setHasAssociations] = useState(
        !isEmpty(defaultAssociations)
    );
    const [associations, setAssociations] = useState<any>(
        defaultAssociations || [RegisteredAssociation.FSP]
    );

    const onHasZsrNumberChange = () => {
        setAssociations(hasAssociations ? [] : [RegisteredAssociation.FSP]);
        setHasAssociations(!hasAssociations);
    };

    const handleSubmit = () => {
        setIsLoading(true);
        onSave({ associations: hasAssociations ? associations : [] });
    };

    const onAssociationsChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;
        const newValues = checked
            ? [...associations, value]
            : associations.filter((item: string) => item !== value);
        setAssociations(newValues);
    };

    return (
        <DialogContent>
            <FormContainer
                inputs={[
                    {
                        name: 'associations',
                        ele: (props: any) => (
                            <Section spacingTop="s">
                                <Module variant="modal" padding="none">
                                    <Item
                                        title={translate(
                                            hasAssociations
                                                ? 'provider.insurance.factor.association.yes'
                                                : 'provider.insurance.factor.association.no'
                                        )}
                                        endSlot={
                                            <Toggle
                                                onChange={onHasZsrNumberChange}
                                                checked={hasAssociations}
                                            />
                                        }
                                    />
                                </Module>
                            </Section>
                        ),
                    },
                    {
                        name: 'zsrNumber',
                        ele: (props: any) => (
                            <>
                                {REGISTERED_ASSOCIATIONS.map((el: any) => {
                                    return (
                                        <Checkbox
                                            multiple
                                            variant="tile"
                                            id={`registeredAssociations-${el.value}`}
                                            type="checkbox"
                                            size="s"
                                            align="left"
                                            {...props}
                                            value={el.value}
                                            checked={associations.includes(
                                                el.value
                                            )}
                                            onChange={onAssociationsChange}
                                        >
                                            {el.label}
                                        </Checkbox>
                                    );
                                })}
                            </>
                        ),
                        col: 12,
                        isHidden: !hasAssociations,
                    },
                ]}
                onSubmit={handleSubmit}
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

export default AssociationForm;
