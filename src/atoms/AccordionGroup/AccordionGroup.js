import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import MarkdownText from 'atoms/MarkdownText'
import Text from 'atoms/Text/Text'
import Title from 'atoms/Title/Title'
import { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { logFirebaseEvent } from 'service/auth'
import './AccordionGroup.scss'

function AccordionGroup({ data, comingFrom = '', titleSize = 'ml', variant = '', defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded ? 'panel0' : false)

  const handleChange = (panel, question) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)

    if (!expanded && comingFrom.length > 0) {
      logFirebaseEvent('faqClick', {
        question,
        comingFrom
      })
    }
  }

  const myData = data
  const listItems = myData
    ? myData.map(({ question, answer, isMarkdown, content }, index) => (
        <Accordion
          key={index}
          elevation={0}
          expanded={expanded === 'panel' + index}
          onChange={handleChange('panel' + index, question)}
        >
          <AccordionSummary
            expandIcon={<IoIosArrowDown />}
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
          >
            {typeof question === 'string' ? <Title size={titleSize}>{question}</Title> : question}
          </AccordionSummary>
          <AccordionDetails>
            {isMarkdown && <MarkdownText content={answer} size='m' />}
            {!isMarkdown && (
              <Text tag='div'>
                <div dangerouslySetInnerHTML={{ __html: answer }}></div>
              </Text>
            )}
            {content && content}
          </AccordionDetails>
        </Accordion>
      ))
    : []

  return <div className={`AccordionGroup variant-${variant}`}>{listItems}</div>
}

export default AccordionGroup
