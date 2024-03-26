import { ComponentMeta, ComponentStory } from '@storybook/react';
import Stepper from './Stepper';

export default {
    title: 'Aepsy/Stepper',
    component: Stepper,
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = (args) => (
    <Stepper {...args} />
);

export const Default = Template.bind({});
Default.args = {
    activeIndex: 4,
    numberOfSteps: 10,
};
