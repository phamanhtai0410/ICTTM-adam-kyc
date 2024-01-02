import { Link } from 'react-router-dom'
import { DetailsModalButton } from 'components'
import assets from '../../../../assets/index'
import '../../../Details/DetailsRelationships/DetailsRelationships.style.scss'

export function DetailsOwnedAssetsTable ({ data }) {
  return (
    <div className='person-details__relationship person-details__factsheet'>
      <div className='person-details__factsheet-column person-details__associate-column'>
        <div className='person-details__relationship-column__hint'><p className='person-details__media-column__subtext'>Assets and shares</p></div>
      </div>
      <div className='person-details__factsheet-column'>
        <div className='person-details__media-column__1 person-details__relationship-column__1'>
          <p className='person-details__media-column__subtext'>Asset</p>
        </div>
        <div className='person-details__media-column__2 person-details__relationship-column__2'>
          <p className='person-details__media-column__subtext'>Percentage held</p>
        </div>
        <div className='person-details__media-column__3 person-details__relationship-column__3'>
          <p className='person-details__media-column__subtext'>Start date</p>
        </div>
        <div className='person-details__relationship-column__4'>
          <p className='person-details__media-column__subtext'>End date</p>
        </div>
        <div className='person-details__media-column__5 person-details__relationship-column__5'>
          <assets.ArrowRightUPSVG
            width={16}
            height={16}
          />
        </div>
      </div>
      {data?.map((item, index) => {
        return (
          <div className='person-details__factsheet-column' key={`${item} ${index}`}>
            <div className='person-details__media-column__1 person-details__relationship-column__1'>
              <Link to={`/entity/${item.properties.asset}`}>{item.properties?.assetEntity?.caption || 'Unknown name'}</Link>
            </div>
            <div className='person-details__media-column__2 person-details__relationship-column__2'>
              <p>{item.properties.percentage?.[0] !== undefined ? (item.properties.percentage[0] + '%') : '-'}</p>
            </div>
            <div className='person-details__media-column__3 person-details__relationship-column__3'>
              <p>{item.properties.startDate ? item.properties.startDate[0] : '-'}</p>
            </div>
            <div className='person-details__relationship-column__4'>
              <p>{item.properties.endDate ? item.properties.endDate[0] : '-'}</p>
            </div>
            <div className='person-details__media-column__5 person-details__relationship-column__5'>
              <DetailsModalButton item={item} type='Assets' />
            </div>
          </div>
        )
      })}
    </div>
  )
}
