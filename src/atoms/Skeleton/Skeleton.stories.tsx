import { ComponentMeta, ComponentStory } from '@storybook/react';
import Module from '../Module/Module';
import Skeleton from './Skeleton';

export default {
    title: 'Aepsy/Skeleton',
    component: Skeleton,
} as ComponentMeta<typeof Skeleton>;

const Template: ComponentStory<typeof Skeleton> = (args) => <Skeleton />;

export const Default = Template.bind({});

const WithCardTemplate: ComponentStory<typeof Skeleton> = (args) => (
    <Module padding="m" radius="xl" highlighted>
        <Skeleton />
    </Module>
);

export const WithCard = WithCardTemplate.bind({});
