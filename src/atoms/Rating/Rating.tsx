import { useState } from 'react'
import './Rating.scss'

interface Props {
  defaultScore?: number
  size: number | string
  number?: number
  onRate: (score: number) => void
}

const Rating: React.FC<Props> = ({ defaultScore = 0, size, number = 5, onRate }) => {
  const [score, setScore] = useState(defaultScore)
  const ratings = [...new Array(number)]

  const handleTouchMove = (event: any, index: number) => {
    setScore(index + 1)
  }

  const handleClick = () => onRate(score)

  return (
    <span className='RatingContainer' onMouseLeave={() => setScore(0)}>
      {ratings.map((_, index) => (
        <span
          key={index}
          onMouseOver={event => handleTouchMove(event, index)}
          onTouchMove={event => handleTouchMove(event, index)}
          onClick={handleClick}
          className='RatingContainer--star'
        >
          {score > index ? 'icon star fill' : 'icon star not fill'}
        </span>
      ))}
    </span>
  )
}
export default Rating
