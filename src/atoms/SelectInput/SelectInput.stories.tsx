import { ComponentMeta, ComponentStory } from '@storybook/react';
import { getAgeList } from 'util/globalHelpers';
import SelectInput from './SelectInput';

export default {
    title: 'Aepsy/SelectInput',
    component: SelectInput,
} as ComponentMeta<typeof SelectInput>;

const Template: ComponentStory<typeof SelectInput> = (args) => (
    <SelectInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
    id: 'Default',
    name: 'Default',
    label: 'Alter',
    items: getAgeList(),
};
