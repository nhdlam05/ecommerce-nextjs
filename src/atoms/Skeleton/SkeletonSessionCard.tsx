import { IonSkeletonText } from '@ionic/react'
import { Box } from '@mui/material'
import Module from '../Module/Module'
import Section from '../Section/Section'
import './Skeleton.scss'

const SkeletonSessionCard = () => (
  <Module>
    <IonSkeletonText animated style={{ width: '40%', height: '20px' }} />
    <Section spacingTop='m' spacingBottom='xs'>
      <IonSkeletonText animated style={{ width: '50%', height: '20px' }} />
    </Section>
    <IonSkeletonText animated style={{ width: '70%', height: '40px' }} />
    <Section spacingTop='s'>
      <Box display='flex'>
        <IonSkeletonText animated style={{ width: '20%', height: '20px', marginRight: '8px' }} />
        <IonSkeletonText animated style={{ width: '20%', height: '20px', marginRight: '8px' }} />
        <IonSkeletonText animated style={{ width: '20%', height: '20px' }} />
      </Box>
    </Section>

    <Section spacingTop='m'>
      <Box display='flex' justifyContent='center'>
        <IonSkeletonText animated style={{ width: '80%', height: '30px' }} />
      </Box>
      <Box display='flex' justifyContent='center'>
        <IonSkeletonText animated style={{ width: '40%' }} />
      </Box>
    </Section>

    <Section spacingTop='m'>
      <Box display='flex' justifyContent='space-between'>
        <IonSkeletonText animated style={{ width: '40%', height: '40px' }} />

        <IonSkeletonText animated style={{ width: '40%', height: '40px' }} />
      </Box>
    </Section>
  </Module>
)

export default SkeletonSessionCard
