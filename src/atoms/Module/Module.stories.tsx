import { ComponentMeta, ComponentStory } from '@storybook/react';
import Module from './Module';

export default {
    title: 'Aepsy/Module',
    component: Module,
} as ComponentMeta<typeof Module>;

const Template: ComponentStory<typeof Module> = (args) => <Module {...args} />;

export const Default = Template.bind({});
Default.args = {
    highlighted: true,
    children: <>Default</>,
};
