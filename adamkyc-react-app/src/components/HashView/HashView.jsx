import { Link } from 'react-router-dom'
import { buildUrl } from 'helpers'
import assets from '../../assets/index'
import './HashView.style.scss'

export function HashViewComponent ({ type, data }) {
  return (
    <div className='recentsearch-container'>
      <h2 className='recentsearch-title'>
        {type === 'recentviewed' ? 'Recent Searches' : 'Last Data Viewed'}
      </h2>
      <ul className='recentsearch-subtext__list'>
        {type === 'recentviewed'
          ? data?.map((item) => {
            if (item === '') return null
            return (
              <li key={item} className='recentsearch-list__item'>
                <Link
                  aria-label='link to search tag view'
                  to={buildUrl(item)}
                >
                  <assets.Hash
                    width={16}
                    height={16}
                    className='recentsearch-list__icon search-item__flex-icon'
                  />
                  <p className='recentsearch-subtitle'>{item}</p>
                </Link>
              </li>
            )
          })
          : data?.map((item) => {
            return (
              <li key={item.id} className='recentsearch-list__item'>
                <Link
                  aria-label='link to details page id view'
                  to={`/entity/${item.id}`}
                >
                  <assets.Hash
                    width={16}
                    height={16}
                    className='recentsearch-list__icon search-item__flex-icon'
                  />
                  <p className='recentsearch-subtitle'>{item.caption}</p>
                </Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
