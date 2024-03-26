import { ComponentMeta, ComponentStory } from '@storybook/react';
import { IconCalendar, IconHome } from './list';

import Icon from './Icon';

export default {
    title: 'Aepsy/Icon',
    component: Icon,
    argTypes: {
        onClick: {
            control: false,
        },
        icon: {
            control: false,
        },
    },
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />;

export const ReactIcon = Template.bind({});
ReactIcon.args = {
    icon: <IconCalendar />,
    size: 'xs',
    theme: 'soft',
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
    icon: <IconHome />,
    size: 'l',
    theme: 'danger',
};
