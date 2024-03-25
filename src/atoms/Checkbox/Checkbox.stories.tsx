import { ComponentMeta, ComponentStory } from '@storybook/react';
import Checkbox from './Checkbox';

export default {
    title: 'Aepsy/Checkbox',
    component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => (
    <Checkbox {...args} />
);

export const Default = Template.bind({});
Default.args = {
    variant: 'bubble',
    type: 'checkbox',
    id: 'Default',
    name: 'Default',
    children: <>Default</>,
};
