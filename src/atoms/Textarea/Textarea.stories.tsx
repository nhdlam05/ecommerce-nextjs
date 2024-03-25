import { ComponentMeta, ComponentStory } from '@storybook/react';
import Textarea from './Textarea';

export default {
    title: 'Example/Textarea',
    component: Textarea,
} as ComponentMeta<typeof Textarea>;

const Template: ComponentStory<typeof Textarea> = (args) => (
    <Textarea {...args} />
);

export const Default = Template.bind({});
Default.args = {
    variant: 'primary',
    showSafeMessage: true,
};
