import { ComponentMeta, ComponentStory } from '@storybook/react';
import Popover from './Popover';

export default {
    title: 'Example/Popover',
    component: Popover,
} as ComponentMeta<typeof Popover>;

const Template: ComponentStory<typeof Popover> = (args) => (
    <Popover {...args} />
);

export const Default = Template.bind({});
Default.args = {
    name: 'test',
    controllerProps: {
        title: 'Topics',
        subtitle: 'Stress...',
    },
};
