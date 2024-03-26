import { ComponentMeta, ComponentStory } from '@storybook/react';
import InputText from './InputText';

export default {
    title: 'Aepsy/InputText',
    component: InputText,
} as ComponentMeta<typeof InputText>;

const Template: ComponentStory<typeof InputText> = (args) => (
    <InputText {...args} />
);

export const Default = Template.bind({});
Default.args = {
    id: 'Default',
    name: 'Default',
};
