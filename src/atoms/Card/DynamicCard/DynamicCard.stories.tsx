import { Grid } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AiOutlineMessage } from 'react-icons/ai';
import { BsBoxArrowInDownLeft } from 'react-icons/bs';
import DynamicCard from './DynamicCard';

export default {
    title: 'Aepsy/DynamicCard',
    component: DynamicCard,
} as ComponentMeta<typeof DynamicCard>;

const Template: ComponentStory<typeof DynamicCard> = (args) => (
    <Grid container spacing={4} style={{ background: '#f5f3ea' }}>
        <Grid item xs={6}>
            <DynamicCard {...args} />
        </Grid>
    </Grid>
);

export const Default = Template.bind({});
Default.args = {
    elements: [
        {
            type: 'badge',
            label: 'Payment pending',
            variant: 'warning',
            sx: {
                mb: 1,
            },
        },
        {
            type: 'subTitle',
            text: 'Thurday, 24.12.21',
            align: 'left',
        },
        {
            type: 'title',
            text: '16:30 - 17:30',
            align: 'left',
        },
        {
            type: 'tag',
            label: 'Video-call',
            startSlot: <AiOutlineMessage />,
        },
        {
            type: 'tag',
            label: '60min',
            startSlot: <BsBoxArrowInDownLeft />,
        },
        {
            type: 'tag',
            label: 'Coach',
        },
        {
            type: 'mainButton',
            label: 'Join call',
            sx: { mt: 2, mb: 1 },
        },
        {
            type: 'subTitle',
            text: 'Call open 15min before the session',
            size: 'xs',
        },
        {
            type: 'button',
            label: 'Trouble joining the call?',
            variant: 'inline',
            sx: { mt: 1, mb: 1 },
        },
    ],
};
