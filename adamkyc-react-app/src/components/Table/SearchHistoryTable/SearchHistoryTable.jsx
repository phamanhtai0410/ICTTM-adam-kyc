import { Link } from 'react-router-dom'
import { buildUrl } from 'helpers'
import assets from '../../../assets/index'
import './SearchhistoryTable.style.scss'

export function SearchHistoryTable ({ tableDate, data }) {
  return (
    <div className='table'>
      <h2 className='table-date'>{tableDate}</h2>
      <table className='table-base'>
        <thead className='table-head'>
          <tr>
            <th>Keyword</th>
            <th>Type</th>
            <th>Number of Results</th>
            <th>Time</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody className='table-body'>
          {data.map((item, index) => (
            <tr key={index}>
              <td>
                <Link to={buildUrl(item.search)} className='table-subtext underline-hover'>
                  {item.search.length > 21 ? item.search.slice(0, 21) + '...' : item.search === '' ? 'Unknown search item' : item.search}
                </Link>
              </td>
              <td className='table-subtext'>{item.type === '' ? 'Any' : item.type}</td>
              <td className='table-subtext'>{item.count || 'Unknown number'}</td>
              <td className='table-subtext'>{item.created_at || 'Unknown date'}</td>
              <td className='table-link__item link-pointer'>
                <Link
                  to={buildUrl(item.search)}
                  aria-label='link to tag view'
                  className='table-link'
                >
                  <p className='table-subtext__link'>Search again</p>
                  <assets.ArrowRightRendered
                    width={16}
                    height={16}
                    className='table-link__icon'
                    title='arrow-right'
                  />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
