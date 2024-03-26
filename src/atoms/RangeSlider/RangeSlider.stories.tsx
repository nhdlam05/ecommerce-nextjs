import { ComponentMeta, ComponentStory } from '@storybook/react';
import RangeSlider from './RangeSlider';

export default {
    title: 'Aepsy/RangeSlider',
    component: RangeSlider,
} as ComponentMeta<typeof RangeSlider>;

const Template: ComponentStory<typeof RangeSlider> = (args) => (
    <RangeSlider {...args} />
);

export const Default = Template.bind({});
Default.args = {
    min: 1,
    max: 10,
    defaultValue: 5,
};
