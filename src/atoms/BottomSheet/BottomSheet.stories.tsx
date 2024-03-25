import { ComponentMeta, ComponentStory } from '@storybook/react';
import BottomSheet from './BottomSheet';

export default {
    title: 'Example/BottomSheet',
    component: BottomSheet,
} as ComponentMeta<typeof BottomSheet>;

const Template: ComponentStory<typeof BottomSheet> = (args) => (
    <BottomSheet {...args} />
);

export const BasicBottomSheet = Template.bind({});
BasicBottomSheet.args = {
    isShown: true,
};
