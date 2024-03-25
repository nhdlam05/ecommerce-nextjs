import { ComponentMeta, ComponentStory } from '@storybook/react';
import AnnouncementBar from './AnnouncementBar';

export default {
    title: 'Aepsy/AnnouncementBar',
    component: AnnouncementBar,
} as ComponentMeta<typeof AnnouncementBar>;

const Template: ComponentStory<typeof AnnouncementBar> = (args) => (
    <AnnouncementBar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    text: 'Attention!!',
    onClose: () => {},
};
