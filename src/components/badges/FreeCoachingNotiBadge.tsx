import Badge from 'atoms/Badge/Badge'
import { useTranslationWithContext } from 'hooks'

interface Props {
  amount: number
}

const FreeCoachingNotiBadge: React.FC<Props> = ({ amount }) => {
  const { translate } = useTranslationWithContext()
  if (amount === 0) return <></>

  return (
    <Badge
      size='xs'
      label={translate({
        key: 'matching.badge.free.coach',
        context: {
          amount
        }
      })}
      variant='notification'
    />
  )
}

export default FreeCoachingNotiBadge
