import { Title } from 'components'
import { Capitalize, deCapitalize } from 'helpers'
import './DetailsChangelog.style.scss'

export function DetailsChangelog ({ data }) {
  function formatDate (date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    return formattedDate
  }

  return (
    <div className='admin-changelog'>
      <Title text='Changelog' textClassname='hero-title__smaller' />
      <div className='admin-changelog--element'>
        {data?.map((item, index) => {
          return <p className='admin-changelog--subtitle' key={`${item} ${index}`}><span className='admin-changelog--span'>{Capitalize(item.user.name)}</span> {deCapitalize(item.message)} at {deCapitalize(item.message) === 'created note' ? item.created_at.split(' ')[1] : deCapitalize(item.message) === 'deleted note' ? item.updated_at.split(' ')[1] : item.updated_at.split(' ')[1]} on {formatDate(item.updated_at.split(' ')[0])}</p>
        })}
      </div>
    </div>
  )
}
