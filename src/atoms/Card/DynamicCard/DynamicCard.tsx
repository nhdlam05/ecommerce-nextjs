import { Box } from '@mui/material'
import Badge, { BadgeProps } from 'atoms/Badge/Badge'
import Button from 'atoms/Button/Button'
import ButtonGroup from 'atoms/ButtonGroup'
import { ButtonGroupProps } from 'atoms/ButtonGroup/ButtonGroup'
import Module from 'atoms/Module/Module'
import ModuleGroup from 'atoms/ModuleGroup'
import Text from 'atoms/Text/Text'
import Title from 'atoms/Title/Title'

export const renderElementByType = (ele: any) => {
  switch (ele.type) {
    case 'badge':
      return (
        <Box sx={ele.sx} display='flex'>
          <Badge size='s' {...ele} />
        </Box>
      )
    case 'text':
      return (
        <Box sx={ele.sx}>
          <Text noMargin {...ele}>
            {ele.text}
          </Text>
        </Box>
      )
    case 'title':
      return (
        <Box sx={ele.sx}>
          <Title noMargin {...ele}>
            {ele.text}
          </Title>
        </Box>
      )
    case 'button':
      return (
        <Box sx={ele.sx}>
          <Button align='center' {...ele} />
        </Box>
      )
    case 'node':
      return ele.node
    default:
      return <></>
  }
}

type CardElementType = 'badge' | 'title' | 'text' | 'button' | 'node'

// TODO add more Props for DynamicCardElement
export interface DynamicCardElement extends BadgeProps {
  type: CardElementType
}

interface Props {
  elements: Array<unknown>
  header?: React.ReactNode
  footerButtons?: ButtonGroupProps
}

const DynamicCard: React.FC<Props> = ({ elements, header, footerButtons }) => {
  return (
    <div style={{ width: '100%' }}>
      <ModuleGroup>
        <Module padding='none' radius='l'>
          {header && header}
          <Box sx={{ p: 3 }}>
            {elements.map((ele: any) =>
              ele.clickable ? (
                <div className='cursor-pointer' key={ele.id} onClick={ele.onClick}>
                  {renderElementByType(ele)}
                </div>
              ) : (
                renderElementByType(ele)
              )
            )}
          </Box>

          {footerButtons && <ButtonGroup borderPosition='bottom' {...footerButtons} />}
        </Module>
      </ModuleGroup>
    </div>
  )
}

export default DynamicCard
