import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import Badge from './Badge'

export default {
  title: 'Aepsy/Badge',
  component: Badge,
  argTypes: {
    startIcon: {
      control: false
    },
    endSlot: {
      control: false
    }
  }
} as ComponentMeta<typeof Badge>

const Template: ComponentStory<typeof Badge> = args => <Badge {...args} />

export const Default = Template.bind({})
Default.args = {
  variant: 'success',
  label: 'Badge'
}

export const HasStartSlot = Template.bind({})
HasStartSlot.args = {
  variant: 'notification',
  label: 'Notification',
  startSlot: <AiOutlineInfoCircle />
}

export const HasEndSlot = Template.bind({})
HasEndSlot.args = {
  variant: 'sky',
  label: 'Therapy',
  endSlot: <AiOutlineInfoCircle />,
  onClick: () => alert('Show therapy info!!!')
}
