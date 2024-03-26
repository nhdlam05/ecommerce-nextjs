import { ComponentMeta, ComponentStory } from '@storybook/react';
import Divider from 'atoms/Divider/Divider';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import Strikethrough from './Strikethrough';
import Typography from './Typography';

export default {
    title: 'Atoms/Typography',
    component: Typography,
    argTypes: {
        color: {
            type: 'string',
        },
    },
} as ComponentMeta<typeof Typography>;

const Template: ComponentStory<typeof Typography> = (args) => {
    return (
        <div>
            <Strikethrough variant="body2" {...args}>
                Strikethrough
            </Strikethrough>
            <Divider spacing="m" />
            <Typography variant="giant" {...args}>
                giant
            </Typography>

            <Title size="giant" font="alt">
                Title giant
            </Title>

            <Divider spacing="m" />
            <Typography variant="body1" {...args}>
                body1
            </Typography>
            <Title size="m">Title m</Title>
            <Divider spacing="m" />

            <Typography fontWeight="light" variant="body2" {...args}>
                body2
            </Typography>

            <Text size="m">Text m</Text>

            <Divider spacing="m" />

            <Typography variant="subtitle1" {...args}>
                subtitle1
            </Typography>

            <Title size="s">Title s</Title>

            <Divider spacing="m" />

            <Typography variant="subtitle2" {...args}>
                subtitle2
            </Typography>

            <Text size="s">Text s</Text>

            <Divider spacing="m" />

            <Typography variant="body1" {...args}>
                body1 and{' '}
                <Typography variant="caption" {...args}>
                    caption inside body1
                </Typography>
            </Typography>
            <Typography variant="body2" {...args}>
                body2 and{' '}
                <Typography variant="caption" {...args}>
                    caption inside body2
                </Typography>
            </Typography>

            <Divider spacing="m" />

            <Text size="footnote">Text footnote </Text>
            <Typography variant="footnote">footnote</Typography>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    children: '',
    text: 'primary',
};
