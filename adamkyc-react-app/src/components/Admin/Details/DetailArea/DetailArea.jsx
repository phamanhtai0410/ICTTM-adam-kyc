import { Title } from 'components'
import './DetailArea.style.scss'

export function DetailArea ({ data }) {
  return (
    <div className='admin-detail__wrapper'>
      <Title text='Detail' textClassname='hero-title__smaller' />
      <div className='admin-detail'>
        <p className='admin-detail__textarea'>{data.details}</p>
      </div>
    </div>
  )
}
