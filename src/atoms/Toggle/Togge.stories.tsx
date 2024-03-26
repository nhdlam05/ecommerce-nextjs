import { ComponentMeta, ComponentStory } from '@storybook/react';
import Toggle from './Toggle';

export default {
    title: 'Aepsy/Toggle',
    component: Toggle,
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = (args) => <Toggle {...args} />;

export const Default = Template.bind({});
Default.args = {
    defaultChecked: true,
};
