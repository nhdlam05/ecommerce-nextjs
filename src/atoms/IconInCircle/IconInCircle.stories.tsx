import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FiHome } from 'react-icons/fi';
import IconInCircle from './IconInCircle';

export default {
    title: 'Aepsy/IconInCircle',
    component: IconInCircle,
    argTypes: {
        icon: {
            control: false,
        },
    },
} as ComponentMeta<typeof IconInCircle>;

const Template: ComponentStory<typeof IconInCircle> = (args) => (
    <IconInCircle {...args} />
);

export const Home = Template.bind({});
Home.args = {
    icon: <FiHome size="50" />,
    size: 'l',
};
