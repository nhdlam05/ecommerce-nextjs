import { ComponentMeta, ComponentStory } from '@storybook/react';
import { RiInformationLine } from 'react-icons/ri';
import CalloutHighlighted from './CalloutHighlighted';
import CalloutInline from './CalloutInline';

export default {
    title: 'Aepsy/Callout',
    component: CalloutInline,
} as ComponentMeta<typeof CalloutInline>;

const Template: ComponentStory<typeof CalloutInline> = (args) => (
    <CalloutInline {...args} />
);

export const Inline = Template.bind({});
Inline.args = {
    icon: <RiInformationLine />,
    text: 'Default',
};

const HilightedTemplate: ComponentStory<typeof CalloutHighlighted> = (args) => (
    <CalloutHighlighted {...args} />
);

export const Hilighted = HilightedTemplate.bind({});
Hilighted.args = {
    icon: <RiInformationLine />,
    text: 'Description',
    title: 'Main title',
};
