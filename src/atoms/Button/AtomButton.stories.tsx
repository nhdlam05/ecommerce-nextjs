import { ComponentMeta, ComponentStory } from '@storybook/react';
import Divider from '../Divider/Divider';
import AtomButton from './AtomButton';
import Button from './Button';
import PinkGradientButton from './PinkGradientButton';

export default {
    title: 'Atoms/Button',
    component: AtomButton,
} as ComponentMeta<typeof AtomButton>;

const Template: ComponentStory<typeof AtomButton> = (args) => (
    <>
        <PinkGradientButton {...args}>PinkGradienButton</PinkGradientButton>
        <Divider spacing="s" />
        <AtomButton {...args} />
        <Divider spacing="s" />
        <Button label="Some text" size="s" />
    </>
);

export const Default = Template.bind({});
Default.args = {
    children: 'Some text',
    color: 'cta',
    border: 4,
    variant: 'contained',
    size: 'large',
};
