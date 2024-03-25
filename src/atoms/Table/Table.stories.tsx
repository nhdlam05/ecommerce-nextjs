import { ComponentMeta, ComponentStory } from '@storybook/react';
import { getAgeList } from 'util/globalHelpers';
import Table from './Table';
import TableItem from './TableItem';

export default {
    title: 'Aepsy/Table',
    component: Table,
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = (args) => (
    <Table {...args}>
        {getAgeList().map((item) => (
            <TableItem key={item.value}>{item.label}</TableItem>
        ))}
    </Table>
);

export const Default = Template.bind({});
Default.args = {
    variant: 'block',
};
