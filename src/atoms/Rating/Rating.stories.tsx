import { ComponentMeta, ComponentStory } from '@storybook/react';
import Rating from './Rating';

export default {
    title: 'Aepsy/Rating',
    component: Rating,
} as ComponentMeta<typeof Rating>;

const Template: ComponentStory<typeof Rating> = (args) => <Rating {...args} />;

export const Default = Template.bind({});
Default.args = {
    size: '40',
};
