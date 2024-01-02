import { Link } from 'react-router-dom'
import { DetailsModalButton } from 'components'
import assets from '../../../../assets/index'
import '../../../Details/DetailsRelationships/DetailsRelationships.style.scss'

export function DetailsUnknownLinkedTable ({ data }) {
  return (
    <div className='person-details__relationship person-details__factsheet'>
      <div className='person-details__factsheet-column person-details__unknownLink-column'>
        <div className='person-details__relationship-column__hint'><p className='person-details__media-column__subtext'>Linked to</p></div>
      </div>
      <div className='person-details__factsheet-column'>
        <div className='person-details__media-column__1 person-details__relationship-column__1'>
          <p className='person-details__media-column__subtext'>Object</p>
        </div>
        <div className='person-details__media-column__2 person-details__relationship-column__2'>
          <p className='person-details__media-column__subtext'>Role</p>
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
              <Link to={`/entity/${item.properties.object}`}>{item.properties.objectEntity.caption}</Link>
            </div>
            <div className='person-details__media-column__2 person-details__relationship-column__2'>
              <p>{Array.isArray(item.properties.role) ? item.properties.role.join(', ') : '-'}</p>
            </div>
            <div className='person-details__media-column__3 person-details__relationship-column__3'>
              <p>{item.properties.startDate ? item.properties.startDate : '-'}</p>
            </div>
            <div className='person-details__relationship-column__4'>
              <p>{item.properties.endDate ? item.properties.endDate : '-'}</p>
            </div>
            <div className='person-details__media-column__5 person-details__relationship-column__5'>
              <DetailsModalButton item={item} type='Linked to' />
            </div>
          </div>
        )
      })}
    </div>
  )
}
