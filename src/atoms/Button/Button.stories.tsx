import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BsCalendar } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import Button from './Button';

export default {
    title: 'Aepsy/Button',
    component: Button,
    argTypes: {
        startIcon: {
            control: false,
        },
        icon: {
            control: false,
        },
    },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
    variant: 'primary',
    label: 'Button',
    theme: 'dark',
    align: 'left',
    size: 'm',
    shape: 'normal',
    onClick: () => alert('Button clicked!'),
};

export const HasIcon = Template.bind({});
HasIcon.args = {
    variant: 'outlined',
    label: 'Reschedule',
    theme: 'dark',
    align: 'center',
    size: 'l',
    shape: 'normal',
    onClick: () => alert('Reschedule clicked!'),
    icon: <BsCalendar />,
};

export const HasStartIcon = Template.bind({});
HasStartIcon.args = {
    variant: 'naked',
    label: 'Send',
    theme: 'dark',
    align: 'right',
    size: 's',
    shape: 'normal',
    onClick: () => alert('Send clicked!'),
    startIcon: <FiSend />,
};
