import { ComponentMeta, ComponentStory } from '@storybook/react';
import Logo from './Logo';

export default {
    title: 'Aepsy/Logo',
    component: Logo,
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args} />;

export const Default = Template.bind({});
Default.args = {
    theme: 'dark',
    size: 'xs',
    align: 'left',
};
